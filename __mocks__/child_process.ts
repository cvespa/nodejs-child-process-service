import {
  ChildProcess as _ChildProcess,
  ForkOptions,
  Serializable,
  SendHandle,
} from "child_process";
import EventEmitter from "events";
import { Readable } from "stream";

const childProcess =
  jest.createMockFromModule<typeof import("child_process")>("child_process");

const { ChildProcess } = childProcess;

const fork = (
  modulePath: string,
  args?: readonly string[] | ForkOptions,
  options?: ForkOptions,
) => {
  let Args: string[] = [];
  let Options: ForkOptions = {};
  if (args !== undefined && !Array.isArray(args)) {
    if (Array.isArray(args)) {
      Args = args;
    } else {
      Options = args as ForkOptions;
    }
  }

  if (options !== undefined) {
    Options = options;
  }

  const process = new EventEmitter() as _ChildProcess;

  process.stdout = new EventEmitter() as Readable;
  process.stderr = new EventEmitter() as Readable;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  if (Options.execArgv !== undefined) {
    (process as any).spawnargs = Options.execArgv;
  } else {
    (process as any).spawnargs = Args;
  }

  if (Options.execPath !== undefined) {
    (process as any).spawnfile = Options.execPath;
  } else {
    (process as any).spawnfile = modulePath;
  }
  (process as any).pid = 1;
  /* eslint-enable  @typescript-eslint/no-explicit-any */

  return process;
};

childProcess.fork = fork;

export default childProcess;
export { ChildProcess, fork, ForkOptions, Serializable, SendHandle };
