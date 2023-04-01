import { act, render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Form from "../src/form";
import { InputGroup } from "../src/input-group";
import { ListGroup, ListOption, useListAttribute } from "../src/list-group";

it("will render and submit with a radio list", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <ListGroup attribute="tags" newItem={() => ""}>
        {({ add }) => (
          <div>
            <ListOption>
              {({ index, remove }) => (
                <InputGroup key={index} attribute={`tags.${index}`}>
                  {({ props }) => (
                    <div>
                      <label htmlFor={props.id}>Tag {parseInt(index) + 1}</label>
                      <input {...props} />
                      <button type="button" onClick={remove}>
                        Remove {parseInt(index) + 1}
                      </button>
                    </div>
                  )}
                </InputGroup>
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

  await act(async () => {
    await userEvent.click(getByText("Remove 1"));
    await userEvent.click(getByText("Submit"));
  });

  expect(onSubmit).toBeCalledTimes(4);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { tags: ["Tag Two"] } }));
});

it("will reorder the items", async () => {
  const initialValues = { myList: ["One", "Two", "Three"] };
  const hook = renderHook(() => useListAttribute("myList", () => ""), {
    wrapper: ({ children }: any) => {
      return (
        <Form onSubmit={jest.fn} initialValues={initialValues}>
          {children}
        </Form>
      );
    },
  });

  expect(hook.result.current.value).toStrictEqual(["One", "Two", "Three"]);

  await act(async () => {
    hook.result.current.reorder(0, 3);
  });

  expect(hook.result.current.value).toStrictEqual(["Two", "Three", "One"]);
});
