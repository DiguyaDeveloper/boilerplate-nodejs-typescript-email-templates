// tslint:disable-next-line:ban-types
export function fixStack(
  target: Error,
  // tslint:disable-next-line:ban-types
  fn: Function = target.constructor
): void {
  // tslint:disable-next-line:ban-types
  const captureStackTrace: Function = (Error as any).captureStackTrace;
  // tslint:disable-next-line:no-unused-expression
  captureStackTrace && captureStackTrace(target, fn);
}
