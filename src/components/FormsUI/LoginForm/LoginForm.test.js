import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import LoginForm from "./";

describe("<LoginForm", () => {
  const user = userEvent.setup();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("component rendering", () => {
    const component = renderer.create(<LoginForm />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("component renders with all the components", () => {
    render(<LoginForm />);
    screen.getByText(/Sign in/i);
    screen.getByLabelText(/Username/i);
    screen.getByLabelText(/Password/i);
    screen.getByTestId(/login-button/i);
    screen.getByText("Don't have an account? Sign Up");
    screen.getByText("Forgot username?");
    screen.getByText("Forgot password?");
    expect(screen.getByText("Don't have an account? Sign Up")).toHaveAttribute(
      "href",
      "/register"
    );
    expect(screen.getByText("Forgot username?")).toHaveAttribute(
      "href",
      "/recover?type=username"
    );
    expect(screen.getByText("Forgot password?")).toHaveAttribute(
      "href",
      "/recover?type=password"
    );
  });

  it("validates username and password field to be not empty after write", async () => {
    const mockHandler = jest.fn();
    render(<LoginForm handleSubmit={mockHandler} />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await user.type(usernameInput, "diego");
    await user.type(passwordInput, "Diego123_");

    const button = screen.getByTestId("login-button");
    await user.click(button);

    expect(usernameInput.value).toBe("diego");
    expect(passwordInput.value).toBe("Diego123_");
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("checks login without username and password does not login", async () => {
    const mockHandler = jest.fn();
    render(<LoginForm handleSubmit={mockHandler} />);

    const button = screen.queryByTestId("login-button");
    await user.click(button);

    expect(mockHandler).toHaveBeenCalledTimes(0);
  });
});
