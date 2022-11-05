import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
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

  await userEvent.click(screen.getByText("submit"));
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

  await userEvent.type(screen.getByLabelText("firstName"), "testing");
  await waitFor(() => expect(validateAttribute).toHaveBeenCalledTimes(1));

  await userEvent.click(screen.getByText("submit"));
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