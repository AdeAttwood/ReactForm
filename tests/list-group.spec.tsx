import React from "react";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "../src/form";
import { ListGroup, ListOption } from "../src/list-group";
import { InputGroup } from "../src/input-group";

it("will render and submit with a radio list", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <ListGroup attribute="tags" newItem={() => ""}>
        {({ add }) => (
          <div>
            <ListOption>
              {({ index }) => (
                <div key={index}>
                  <InputGroup attribute={`tags.${index}`}>
                    {({ props }) => (
                      <div>
                        <label htmlFor={props.id}>Tag {parseInt(index) + 1}</label>
                        <input {...props} />
                      </div>
                    )}
                  </InputGroup>
                </div>
              )}
            </ListOption>
            <button type="button" onClick={add}>
              Add Tag
            </button>
          </div>
        )}
      </ListGroup>
      <button>Submit</button>
    </Form>
  );

  await act(async () => {
    await userEvent.click(getByText("Add Tag"));
    await userEvent.click(getByText("Submit"));
  });

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { tags: [""] } }));

  await act(async () => {
    await userEvent.type(getByLabelText("Tag 1"), "Tag One");
    await userEvent.click(getByText("Submit"));
  });

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { tags: ["Tag One"] } }));

  await act(async () => userEvent.click(getByText("Add Tag")));

  await act(async () => {
    await userEvent.type(getByLabelText("Tag 2"), "Tag Two");
    await userEvent.click(getByText("Submit"));
  });

  expect(onSubmit).toBeCalledTimes(3);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { tags: ["Tag One", "Tag Two"] } }));
});
