/**
 * Throws an error amending the call stack to remove the first call. This is to
 * trick the react console logger into thinking the call came one call earlier.
 * Then it will print out a much more logical errors and code snippets.
 */
function throwError(error: Error) {
  if (!error.stack) {
    throw new Error("Error must have a stack");
  }

  const lines = error.stack.split("\n");
  lines.splice(1, 1);
  error.stack = lines.join("\n");

  throw error;
}

jest.spyOn(console, "error").mockImplementation(() => throwError(new Error()));
jest.spyOn(console, "warn").mockImplementation(() => throwError(new Error()));
