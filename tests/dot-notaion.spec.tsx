import { get, set } from "../src/dot-notation";

it("will get a value", () => {
  const input = { a: { b: "value" } };
  const output = get(input, "a.b");

  expect(output).toBe("value");
});

it("will return undefined if it cannot resolve the path", () => {
  const input = { a: { b: "value" } };
  const output = get(input, "a.c.e");

  expect(output).toBeUndefined();
});

it("wont crash if we pass in undefined", () => {
  expect(get(undefined, "a.c.e")).toBeUndefined();
});

it("will work on an array", () => {
  const input = { a: { b: "value" } };
  const output = get(input, ["a", "b"]);

  expect(output).toBe("value");
});

it("will set a value in a object", () => {
  const input = { a: { b: "value" } };
  set(input, "a.b", "new value");

  expect(input.a.b).toBe("new value");
});

it("will set empty objects", () => {
  const input: any = {};
  set(input, "a.b", "new value");

  expect(input.a.b).toBe("new value");
});
