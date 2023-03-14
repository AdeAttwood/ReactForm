const consoleErrorMock = jest.spyOn(console, "error");
const consoleWarnMock = jest.spyOn(console, "warn");

function getMessageForMock(prefix: string, calls: Array<Array<string>>) {
  const messages: { [k: string]: number } = {};
  for (const [message] of calls) {
    if (!(message in messages)) {
      messages[message] = 0;
    }

    messages[message]++;
  }

  return Object.entries(messages)
    .map(([message, count]) => `${prefix} (${count}x): ${message}`)
    .join("\n")
    .trim();
}

beforeEach(() => {
  consoleErrorMock.mockReset();
  consoleWarnMock.mockReset();
});
afterAll(() => {
  consoleErrorMock.mockRestore();
  consoleWarnMock.mockRestore();
});

afterEach(() => {
  const errors = getMessageForMock("ERROR", consoleErrorMock.mock.calls);
  const warnings = getMessageForMock("WARNING", consoleWarnMock.mock.calls);
  if (errors || warnings) {
    throw new Error(`Console must not throw errors or warnings\n\n${errors}\n${warnings}`);
  }
});
