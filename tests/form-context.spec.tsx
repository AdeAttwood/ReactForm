import { act, renderHook } from "@testing-library/react";
import React from "react";

import { createValidator, Form, useFormContext } from "../src";

it("will allow you to validate the form from the context", async () => {
  const onSubmit = jest.fn();

  const validator = createValidator({ test: [() => "I will always fail"] });

  const { result } = renderHook(() => useFormContext(), {
    wrapper: ({ children }) => (
      <Form initialValues={{}} onSubmit={onSubmit} validator={validator}>
        {children}
      </Form>
    ),
  });

  const errors = await result.current.validate(result.current.formState);
  expect(errors).toStrictEqual({ test: ["I will always fail"] });

  const attributeErrors = await result.current.validateAttribute("test-1", result.current.formState);
  expect(attributeErrors).toHaveLength(0);

  expect(result.current.status).toBe("clean");
  await act(async () => result.current.setErrors(errors));
  expect(result.current.status).toBe("error");
});
