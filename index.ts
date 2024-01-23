import {
  ChildProcess,
  fork,
  ForkOptions,
  Serializable,
  SendHandle,
} from "child_process";

export class ChildProcessService {
  processes: { [key: number]: ChildProcess };

  constructor() {
    this.processes = {};
  }

  private _fork(
    path: string,
    args?: Array<string>,
    options?: ForkOptions,
  ): ChildProcess {
    const process = fork(path, args, options);

    if (process.pid === undefined) {
      throw Error("Invaild Pid");
    }

    this.processes[process.pid] = process;

    return process;
  }

  fork(
    path: string,
    args?: Array<string>,
    options?: ForkOptions,
  ): ChildProcess {
    const process = this._fork(path, args, options);

    return process;
  }

  handleExitCodes(
    process: ChildProcess,
    exitCodes: {
      [key: number]: (
        code: number | null,
        signal: NodeJS.Signals | null,
      ) => void;
    },
  ): void {
    if (process.pid === undefined || !(process.pid in this.processes)) {
      throw Error("Invaild Pid, This Pid was not created from this service");
    }

    // NOTE: I want to try this style of adding the listeners. I do not know if will be faster or better
    Object.keys(exitCodes).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(exitCodes, key)) {
        const parsedCode: number = parseInt(key, 10);
        const handler = exitCodes[parsedCode];

        process.on(
          "exit",
          (code: number | null, signal: NodeJS.Signals | null) => {
            if (code === null) {
              // TODO: Exit normally
              return;
            }

            if (code !== parsedCode) {
              // TODO: We are not handling for this one
              return;
            }

            handler(code, signal);
          },
        );
      }
    });
  }

  handleMessage(
    process: ChildProcess,
    listener: (message: Serializable, sendHandle: SendHandle) => void,
  ) {
    if (process.pid === undefined || !(process.pid in this.processes)) {
      throw Error("Invaild Pid, This Pid was not created from this service");
    }

    process.on("message", listener);
  }
}

export default ChildProcessService;
