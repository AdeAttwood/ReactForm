import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Form from "../src/form";
import InputGroup from "../src/input-group";

const Input = ({ attribute }: { attribute: string }) => (
  <InputGroup attribute={attribute}>
    {({ props }) => (
      <div>
        <label htmlFor={attribute}>{attribute}</label>
        <input {...props} />
      </div>
    )}
  </InputGroup>
);

interface FormModel {
  input: string;
}
const initialValues: FormModel = { input: "" };

it("will render and submit a form with one input", () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form<FormModel> initialValues={initialValues} onSubmit={onSubmit}>
      <Input attribute="password" />
      <button>submit</button>
    </Form>
  );

  fireEvent.change(getByLabelText("password"), { target: { value: "My value" } });
  fireEvent.click(getByText("submit"));

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith(
    expect.objectContaining({
      formState: expect.objectContaining({ password: "My value" }),
    })
  );
});

it("will have a default value and submit", () => {
  const onSubmit = jest.fn();
  const { getByText } = render(
    <Form initialValues={{ input: "Default" }} onSubmit={onSubmit}>
      <Input attribute="input" />
      <button>submit</button>
    </Form>
  );

  fireEvent.click(getByText("submit"));
  expect(onSubmit).toBeCalledWith(
    expect.objectContaining({
      formState: { input: "Default" },
    })
  );
});

it("will validate on save and prevent submit", () => {
  const onSubmit = jest.fn();
  const { getByText } = render(
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      rules={{
        input: [
          ({ input }) => {
            if (!input || input.length === 0) {
              return "Input is required";
            }

            return "";
          },
        ],
      }}
    >
      <Input attribute="input" />
      <button>submit</button>
    </Form>
  );

  fireEvent.click(getByText("submit"));
  expect(onSubmit).toBeCalledTimes(0);
});
