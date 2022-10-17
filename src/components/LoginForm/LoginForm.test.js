import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LoginForm from "./LoginForm";

test("component rendering", () => {
  const component = render(<LoginForm />);
  component.getByText("Sign in");
  component.getByLabelText("Username");
  component.getByLabelText("Password");
  expect(component.container).toHaveTextContent("Username");
});
