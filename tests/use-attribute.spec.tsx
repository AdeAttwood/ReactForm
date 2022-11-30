import React from "react";
import { renderHook, act } from "@testing-library/react";

import { Form } from "../src/form";
import { useBooleanAttribute, useStringAttribute } from "../src/use-attribute";

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Form onSubmit={jest.fn}>{children}</Form>;
};

const renderAttributeHook = (attribute: string, defaultValue: string) => {
  return renderHook(() => useStringAttribute(attribute, defaultValue), { wrapper });
};

it("useAttribute will mount and update the base attribute hook", () => {
  const { result } = renderAttributeHook("testing", "");

  expect(result.current.value).toBe("");
  act(() => result.current.set("Hello"));
  expect(result.current.value).toBe("Hello");
});

test.each([
  ["string", "string"],
  [1, "1"],
  [true, "true"],
  [undefined, "undefined"],
])("useAttribute setting %s is cast to a string and will be %s", (value, expected) => {
  const { result } = renderAttributeHook("testing", "");
  act(() => result.current.set(value));
  expect(result.current.value).toStrictEqual(expected);
});

const renderBooleanAttributeHook = (attribute: string, defaultValue: boolean) => {
  return renderHook(() => useBooleanAttribute(attribute, defaultValue), { wrapper });
};

test.each([
  [true, true],
  [false, false],
  [1, true],
  [0, false],
  ["test", true],
])("useBooleanAttribute setting %s is cast to a boolean be %s", (value, expected) => {
  const { result } = renderBooleanAttributeHook("testing", false);
  act(() => result.current.set(value));
  expect(result.current.value).toStrictEqual(expected);
});
