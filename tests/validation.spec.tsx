import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Form from "../src/form";
import Input from "./input-component";

import createValidator from "../src/validator";
import { get } from "../src/dot-notation";

afterEach(cleanup);

const required = (attribute: string) => (formState: any) => {
  if (!get(formState, attribute)) {
    return "Required";
  }

  return "";
};

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

it("will validate nested data", async () => {
  const validator = createValidator().addRule("user.firstname", required("user.firstname"));

  let result = await validator.validate({});
  expect(result).toStrictEqual({ "user.firstname": ["Required"] });

  result = await validator.validate({ user: { firstname: "Testing" } });
  expect(result).toStrictEqual({});
});

it("will validate array data", async () => {
  const validator = createValidator().addRule("users..firstname", required("users..firstname"));

  const result = await validator.validate({ users: [{}, {}] });
  expect(result).toStrictEqual({ "users.0.firstname": ["Required"], "users.1.firstname": ["Required"] });
});
