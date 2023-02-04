import React from "react";
import { render, screen } from "@testing-library/react";

import Form from "../src/form";
import Input from "./input-component";

it("will display errors when they are passed in via props", async () => {
  const onSubmit = jest.fn();

  render(
    <Form initialValues={{ firstName: "" }} onSubmit={onSubmit} errors={{ firstName: ["This error"] }}>
      <Input attribute="firstName" />
      <button>submit</button>
    </Form>
  );

  screen.getByText("This error");
});
