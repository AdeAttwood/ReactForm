import React from "react";
import { render, screen, cleanup, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Form from "../src/form";
import Input from "./input-component";

import createValidator, { ValidationFunction } from "../src/validator";

afterEach(cleanup);

const required: ValidationFunction<any> = (_, { value }) => (value ? "" : "Required");

type User = {
  firstName: string;
};

const validator = createValidator<User>({
  firstName: [
    ({ firstName }) => {
      if (!firstName || firstName.length === 0) {
        return "First name is required";
      }

      return "";
    },
  ],
});

it("will validate the data with a raw function", async () => {
  render(
    <Form initialValues={{ firstName: "" }} onSubmit={({ formState }) => formState} validator={validator}>
      <Input attribute="firstName" />
      <button>submit</button>
    </Form>
  );

  await act(async () => userEvent.click(screen.getByText("submit")));
  await waitFor(() => expect(screen.getByText("First name is required")).not.toBeNull());
});

it("will validate after input delay", async () => {
  const validate = jest.fn();
  const validateAttribute = jest.fn(async () => []);

  render(
    <Form
      initialValues={{ firstName: "" }}
      onSubmit={({ formState }) => formState}
      validator={{ validate, validateAttribute }}
    >
      <Input attribute="firstName" />
      <button>submit</button>
    </Form>
  );

  await act(async () => userEvent.type(screen.getByLabelText("firstName"), "testing"));
  await waitFor(() => expect(validateAttribute).toHaveBeenCalledTimes(1));

  await act(async () => await userEvent.click(screen.getByText("submit")));
  await waitFor(() => expect(validate).toHaveBeenCalledTimes(1));
});

it("will validate nested data", async () => {
  const validator = createValidator().addRule("user.firstname", required);

  let result = await validator.validate({});
  expect(result).toStrictEqual({ "user.firstname": ["Required"] });

  result = await validator.validate({ user: { firstname: "Testing" } });
  expect(result).toStrictEqual({});
});

it("will validate array data", async () => {
  const validator = createValidator().addRule("users..firstname", required);

  let result = await validator.validate({ users: [{}, {}] });
  expect(result).toStrictEqual({ "users.0.firstname": ["Required"], "users.1.firstname": ["Required"] });

  result = await validator.validate({ users: [{ firstname: "One" }, { firstname: "Two" }] });
  expect(result).toStrictEqual({});

  const attributeResult = await validator.validateAttribute("users.0.firstname", { users: [{}, {}] });
  expect(attributeResult).toStrictEqual(["Required"]);
});

const nestedValidator = createValidator({
  "author.name": [
    (formState) => {
      if (!formState?.author?.name) {
        return "Author name can not be blank";
      }

      return "";
    },
  ],
});

it("will validate nested validators", async () => {
  const onSubmit = jest.fn();
  render(
    <Form initialValues={{ author: { name: "" } }} validator={nestedValidator} onSubmit={onSubmit}>
      <Input attribute="author.name" />
      <button>submit</button>
    </Form>
  );

  await act(async () => userEvent.click(screen.getByText("submit")));
  await waitFor(() => screen.getByText("Author name can not be blank"));

  expect(onSubmit).not.toHaveBeenCalled();
});

it("will use a validation function that returns undefined", async () => {
  const validator = createValidator({
    userName: [
      ({ userName }) => {
        if (!userName) {
          return "Error message";
        }
      },
    ],
  });

  const result = await validator.validate({});
  expect(result).toStrictEqual({ userName: ["Error message"] });
});

it("will use validation functions that are empty or undefined as valid", async () => {
  const validator = createValidator({
    userName: [() => "", () => undefined],
  });

  const result = await validator.validate({});
  expect(result).toStrictEqual({});
});

it("will take a async function in the validation", async () => {
  const validator = createValidator({
    userName: [() => Promise.resolve("This is an error")],
  });

  const result = await validator.validate({});
  expect(result).toStrictEqual({ userName: ["This is an error"] });
});
