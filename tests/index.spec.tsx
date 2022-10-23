import * as ReactForm from "../src";

test.each([
  // Components
  "CheckGroup",
  "Form",
  "InputGroup",
  "ListGroup",
  "ListOption",
  "RadioGroup",
  "RadioOption",
  "SelectGroup",

  // Hooks
  "useAttributeContext",
  "useCheckboxAttribute",
  "useFormContext",
  "useSelectAttribute",
  "useTextAttribute",
])("'%s' is exported from the index file", (variable: string) => {
  expect(ReactForm[variable as keyof typeof ReactForm]).not.toBeUndefined();
});
