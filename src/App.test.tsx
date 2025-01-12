import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders", () => {
  render(<App />);
  const addValueHighlightElement = screen.getByText(/Add value highlight/i);
  expect(addValueHighlightElement).toBeInTheDocument();
});
