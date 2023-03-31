import React from "react";
import { renderHook, act } from "@testing-library/react";

import { Form, useFormContext, createValidator } from "../src";

it("will allow you to validate the form from the context", async () => {
  const onSubmit = jest.fn();

  const validator = createValidator({ test: [() => "I will always fail"] });

  const { result } = renderHook(() => useFormContext(), {
    wrapper: ({ children }) => (
      <Form onSubmit={onSubmit} validator={validator}>
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
