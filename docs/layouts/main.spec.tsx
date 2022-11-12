import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Main from "./main";

it("will render and have links", () => {
  render(<Main meta={{ title: "Testing" }}>The content</Main>);
  const link = screen.getByText("Overview");
  expect(link).toHaveAttribute("href", "/");

  screen.getByText("The content");
});
