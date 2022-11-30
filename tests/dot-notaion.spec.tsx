import { get, getAll, set } from "../src/dot-notation";

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

it("will return false value not the default value", () => {
  const input = { a: false };
  expect(get(input, "a")).toStrictEqual(false);
});

it("will return 0 value not the default value", () => {
  const input = { a: 0 };
  expect(get(input, "a")).toStrictEqual(0);
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

it("will set a false value", () => {
  const input = { a: "testing" };
  set(input, "a", false);

  expect(input.a).toStrictEqual(false);
});

it("will set a number value", () => {
  const input = { a: "testing" };
  set(input, "a", 22);

  expect(input.a).toStrictEqual(22);
});

it("will get all matching", () => {
  const input: any = {
    users: [{ name: "Ade" }, { name: "John" }, { name: "Jane" }],
  };

  expect(getAll(input, "users..name")).toStrictEqual([
    { path: "users.0.name", value: "Ade" },
    { path: "users.1.name", value: "John" },
    { path: "users.2.name", value: "Jane" },
  ]);
});

it("will get all matching", () => {
  const input: any = {
    tags: ["One", "Two", "Three"],
  };

  expect(getAll(input, "tags.")).toStrictEqual([
    { path: "tags.0", value: "One" },
    { path: "tags.1", value: "Two" },
    { path: "tags.2", value: "Three" },
  ]);
});

it("will get all nested matching", () => {
  const input: any = {
    users: [
      { name: "Ade", tags: [{ content: "One" }, { content: "Two" }] },
      { name: "John", tags: [{ content: "One" }] },
      { name: "Jane", tags: [{ content: "One" }] },
    ],
  };

  expect(getAll(input, "users..tags..content")).toStrictEqual([
    { path: "users.0.tags.0.content", value: "One" },
    { path: "users.0.tags.1.content", value: "Two" },
    { path: "users.1.tags.0.content", value: "One" },
    { path: "users.2.tags.0.content", value: "One" },
  ]);
});

it("will get all with undefined", () => {
  const input: any = { users: [{}, {}] };

  expect(getAll(input, "users..firstname")).toStrictEqual([
    { path: "users.0.firstname", value: undefined },
    { path: "users.1.firstname", value: undefined },
  ]);
});
