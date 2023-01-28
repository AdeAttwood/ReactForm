import React from "react";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Form, { OnSubmitFunction } from "../src/form";
import Input from "./input-component";
import { useFormContext } from "../src/form-context";

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

it("will set the errors from the onSubmit callback", async () => {
  const onSubmit: OnSubmitFunction = () => {
    throw {
      errorBag: { "test-input": ["This is a error from the errors"] },
    };
  };

  render(
    <Form onSubmit={onSubmit}>
      <Input attribute="test-input" />
      <button>Submit</button>
    </Form>
  );

  await act(async () => {
    await userEvent.click(screen.getByText("Submit"));
  });

  expect(screen.getByText("This is a error from the errors"));
});

it("will set the status to clean if the errors are cleared", async () => {
  const onSubmit: OnSubmitFunction = () => {
    throw { errorBag: {} };
  };

  function StatusComponent() {
    const { status } = useFormContext();
    return <span>Status: {status}</span>;
  }

  render(
    <Form onSubmit={onSubmit}>
      <Input attribute="test-input" />
      <StatusComponent />
      <button>Submit</button>
    </Form>
  );

  await act(async () => {
    await userEvent.click(screen.getByText("Submit"));
  });

  expect(screen.getByText("Status: clean"));
});
