import React from "react";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Form, { OnSubmitFunction } from "../src/form";
import Input from "./input-component";

afterEach(cleanup);

it("will call onSubmit", async () => {
  const onSubmitMock = jest.fn();
  // Split out the onSubmit callback so we can explicity type it like the
  // external API to tests the types.
  const onSubmit: OnSubmitFunction = () => onSubmitMock();

  render(
    <Form onSubmit={onSubmit}>
      <Input attribute="test-input" />
      <button>Submit</button>
    </Form>
  );

  await act(async () => {
    await userEvent.click(screen.getByText("Submit"));
  });

  expect(onSubmitMock).toHaveBeenCalled();
});
