import React from "react";
import { renderHook, act, cleanup } from "@testing-library/react";

import { Form } from "../src/form";
import { useAttribute, useBooleanAttribute, useStringAttribute } from "../src/use-attribute";

afterEach(cleanup);

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Form onSubmit={jest.fn}>{children}</Form>;
};

it("useAttribute will mount and update the base attribute hook", () => {
  const { result } = renderHook(() => useAttribute("testing", ""), { wrapper });

  expect(result.current.value).toBe("");
  act(() => result.current.set("Hello"));
  expect(result.current.value).toBe("Hello");
});

it("useAttribute can be used as a generic and the value is of the same type", () => {
  type User = { firstName: string };
  const user = { firstName: "John" };
  const { result } = renderHook(() => useAttribute("testing1", user), { wrapper });

  function getFirstName(user: User) {
    return user.firstName;
  }

  expect(getFirstName(result.current.value)).toBe("John");
});

test.each([
  [1, 1],
  [null, null],
  ["testing", "testing"],
  [{ one: "two" }, { one: "two" }],
])("useAttribute %s is cast to a anything and will be %s", (value, expected) => {
  const { result } = renderHook(() => useAttribute("testing", ""), { wrapper });
  act(() => result.current.set(value));
  expect(result.current.value).toStrictEqual(expected);
});

test.each([
  ["string", "string"],
  [1, "1"],
  [true, "true"],
  [undefined, "undefined"],
])("useStringAttribute %s is cast to a string and will be %s", (value, expected) => {
  const { result } = renderHook(() => useStringAttribute("testing", ""), { wrapper });
  act(() => result.current.set(value));
  expect(result.current.value).toStrictEqual(expected);
});

test.each([
  [true, true],
  [false, false],
  [1, true],
  [0, false],
  ["test", true],
])("useBooleanAttribute setting %s is cast to a boolean be %s", (value, expected) => {
  const { result } = renderHook(() => useBooleanAttribute("testing", false), { wrapper });
  act(() => result.current.set(value));
  expect(result.current.value).toStrictEqual(expected);
});
