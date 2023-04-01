import { act, fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import CheckGroup from "../src/check-group";
import Form from "../src/form";
import createValidator from "../src/validator";

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

  await act(async () => userEvent.click(getByLabelText("Check")));
  await act(async () => userEvent.click(getByText("Submit")));

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { checkMe: true } }));

  await act(async () => userEvent.click(getByLabelText("Check")));
  await act(async () => userEvent.click(getByText("Submit")));

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { checkMe: false } }));
});

it("will have a default value and submit", async () => {
  const onSubmit = jest.fn();
  const { getByText } = render(
    <Form initialValues={{ input: true }} onSubmit={onSubmit}>
      <CheckGroup attribute="input">
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

  await act(async () => userEvent.click(getByText("Submit")));
  await waitFor(() => expect(onSubmit).toBeCalledTimes(1));
  expect(onSubmit).toBeCalledWith(
    expect.objectContaining({
      formState: { input: true },
    })
  );
});

it("will validate on save and prevent submit", async () => {
  const onSubmit = jest.fn();
  const { getByText } = render(
    <Form
      onSubmit={onSubmit}
      initialValues={{ input: false }}
      validator={createValidator({
        input: [
          ({ input }) => {
            if (!input) {
              return "Input cannot be false";
            }
          },
        ],
      })}
    >
      <CheckGroup attribute="input">
        {({ props }) => (
          <div>
            <label htmlFor={props.id}>Check</label>
            <input {...props} />
          </div>
        )}
      </CheckGroup>
      <button>submit</button>
    </Form>
  );

  await act(async () => {
    fireEvent.click(getByText("submit"));
  });

  expect(onSubmit).toBeCalledTimes(0);
});
