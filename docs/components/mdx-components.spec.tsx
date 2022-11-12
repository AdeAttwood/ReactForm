import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import components from "./mdx-components";

it("will render table and add the class to it", async () => {
  const Table = components.table;

  const { container } = render(
    <Table>
      <tbody>
        <tr>
          <td>Table content</td>
        </tr>
      </tbody>
    </Table>
  );

  const tableElement = container.querySelectorAll("table.table");
  expect(tableElement).toHaveLength(1);
});

it("will skip rendering a pre tag", async () => {
  const Pre = components.pre;

  const { container } = render(
    <Pre>
      <h1>Hello</h1>
    </Pre>
  );

  const preElement = container.querySelector("pre");
  expect(preElement).not.toBeInTheDocument();

  const hello = screen.getByText("Hello");
  expect(hello.tagName.toLowerCase()).toBe("h1");
});
