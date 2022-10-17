import React from "react";
import { render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import LoginForm from "./LoginForm";

let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("<LoginForm />", () => {
  it("Should have Typography 'Sign in'", () => {
    render(<LoginForm />);
    //screen.debug();
    // const { getByTestId } = render(<LoginForm />);
    // const signinText = getByTestId("typography-signin");
    // console.log("Signintext", signinText);
    // expect(signinText).not.toBe("Sign in");
  });
});
