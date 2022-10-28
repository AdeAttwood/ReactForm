import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "../src/form";
import CheckGroup from "../src/check-group";

it("will render and submit with a checkbox attribute", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <CheckGroup attribute="checkMe">
        {({ props }) => (
          <div>
            <label htmlFor={props.id}>Check</label>
            <input {...props} />
          </div>
        )}
      </CheckGroup>
      <button>Submit</button>
    </Form>
  );

  await userEvent.click(getByLabelText("Check"));
  await userEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { checkMe: true } }));

  await userEvent.click(getByLabelText("Check"));
  await userEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { checkMe: false } }));
});
