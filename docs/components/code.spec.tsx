import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Code from "./code";

it("will render some code without a language", () => {
  render(<Code>some code</Code>);

  const code = screen.getByText("some code");
  expect(code.tagName.toLowerCase()).toBe("code");
});

it("will highlight code with a language", () => {
  render(<Code className="language-js">{'const a = "b"'}</Code>);

  const keyword = screen.getByText("const");
  expect(keyword).toHaveClass("token");
  expect(keyword).toHaveClass("keyword");
});
