import React from "react";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

  await act(async () => {
    await userEvent.type(screen.getByLabelText("test-input"), "A");
  });

  expect(onChange).toHaveBeenCalled();
});
