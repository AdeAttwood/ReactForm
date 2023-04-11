import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Form from "../src/form";
import Input from "./input-component";

afterEach(cleanup);

it("will call onChange when a attribute is changed", async () => {
  const onChange = jest.fn();
  const onSubmit = jest.fn();

  render(
    <Form onChange={onChange} onSubmit={onSubmit}>
      <Input attribute="test-input" />
    </Form>
  );

  await userEvent.type(screen.getByLabelText("test-input"), "A");

  expect(onChange).toHaveBeenCalled();
  expect(onChange).toBeCalledWith(expect.objectContaining({ formState: { "test-input": "A" } }), "test-input");
});
