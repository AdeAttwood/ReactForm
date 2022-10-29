import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import Form from "../src/form";
import Input from "./input-component";
import createValidator from "../src/validator";

interface FormModel {
  input: string;
}
const initialValues: FormModel = { input: "" };

it("will render and submit a form with one input", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form<FormModel> initialValues={initialValues} onSubmit={onSubmit}>
      <Input attribute="password" />
      <button>submit</button>
    </Form>
  );

  fireEvent.change(getByLabelText("password"), { target: { value: "My value" } });
  fireEvent.click(getByText("submit"));

  await waitFor(() => expect(onSubmit).toBeCalledTimes(1));
  expect(onSubmit).toBeCalledWith(
    expect.objectContaining({
      formState: expect.objectContaining({ password: "My value" }),
    })
  );
});

it("will have a default value and submit", async () => {
  const onSubmit = jest.fn();
  const { getByText } = render(
    <Form initialValues={{ input: "Default" }} onSubmit={onSubmit}>
      <Input attribute="input" />
      <button>submit</button>
    </Form>
  );

  fireEvent.click(getByText("submit"));
  await waitFor(() => expect(onSubmit).toBeCalledTimes(1));
  expect(onSubmit).toBeCalledWith(
    expect.objectContaining({
      formState: { input: "Default" },
    })
  );
});

it("will validate on save and prevent submit", async () => {
  const onSubmit = jest.fn();
  const { getByText } = render(
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validator={createValidator({
        input: [
          ({ input }) => {
            if (!input || input.length === 0) {
              return "Input is required";
            }

            return "";
          },
        ],
      })}
    >
      <Input attribute="input" />
      <button>submit</button>
    </Form>
  );

  await act(async () => {
    fireEvent.click(getByText("submit"));
  });

  expect(onSubmit).toBeCalledTimes(0);
});
