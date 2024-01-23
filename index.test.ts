import { ChildProcess, ForkOptions } from "child_process";
// eslint-disable-next-line import/no-named-as-default
import ChildProcessService from "./index";

jest.mock("child_process");

describe("Index", () => {
  describe("constructor", () => {
    test("should not throw error", () => {
      expect(() => {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const service = new ChildProcessService();
      }).not.toThrow();
    });
  });

  describe("functions", () => {
    let service: ChildProcessService;
    beforeEach(() => {
      service = new ChildProcessService();
    });

    const parameterizeTest = ["fork", "handleExitCodes", "handleMessage"];
    parameterizeTest.forEach((element) => {
      test(`should have property of ${element}`, () => {
        expect(service).toHaveProperty(element);
      });
    });

    describe("private", () => {
      describe("_fork", () => {
        test("should have property", () => {
          expect(service).toHaveProperty("_fork");
        });

        let func: (
          path: string,
          args?: Array<string>,
          options?: ForkOptions,
        ) => ChildProcess;
        let path: string;
        beforeEach(() => {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any --
           * NOTE: Doing this becasue _fork is private and need to do a simple trick to get it.
           */
          func = (ChildProcessService.prototype as any)._fork.bind(service);
          path = ".";
        });

        test("should return defined", () => {
          expect(func(path)).toBeDefined();
        });
      });
    });

    describe("fork", () => {
      test("should have property", () => {
        expect(service).toHaveProperty("fork");
      });
    });
  });
});
