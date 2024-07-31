import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { Form, OnSubmitFunction } from "../src";
import { useFormContext } from "../src/form-context";
import Input from "./input-component";

afterEach(cleanup);

it("will call onSubmit", async () => {
  const onSubmitMock = jest.fn();
  // Split out the onSubmit callback so we can explicity type it like the
  // external API to tests the types.
  const onSubmit: OnSubmitFunction = () => onSubmitMock();

  render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <Input attribute="test-input" />
      <button>Submit</button>
    </Form>
  );

  await userEvent.click(screen.getByText("Submit"));
  expect(onSubmitMock).toHaveBeenCalled();
});

it("will set the errors from the onSubmit callback", async () => {
  const onSubmit: OnSubmitFunction = () => {
    return { "test-input": ["This is a error from the errors"] };
  };

  render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <Input attribute="test-input" />
      <button>Submit</button>
    </Form>
  );

  await userEvent.click(screen.getByText("Submit"));
  expect(screen.getByText("This is a error from the errors"));
});

it("will set the status to clean if the errors are cleared", async () => {
  const onSubmit: OnSubmitFunction = () => {
    return {};
  };

  function StatusComponent() {
    const { status } = useFormContext();
    return <span>Status: {status}</span>;
  }

  render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <Input attribute="test-input" />
      <StatusComponent />
      <button>Submit</button>
    </Form>
  );

  await userEvent.click(screen.getByText("Submit"));
  expect(screen.getByText("Status: clean"));
});
