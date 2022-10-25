import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";

describe("<LoginForm", () => {
  const user = userEvent.setup();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("component rendering", () => {
    render(<LoginForm />);
    screen.getByText(/Sign in/i);
    screen.getByLabelText(/Username/i);
    screen.getByLabelText(/assword/i);
  });

  it("click button calls event handler", async () => {
    const mockHandler = jest.fn();
    render(<LoginForm handleSubmit={mockHandler} />);

    const button = screen.getByTestId("login-button");
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(0);
  });

  it("validates username and password field to be not empty after write", async () => {
    const mockHandler = jest.fn();
    render(<LoginForm handleSubmit={mockHandler} />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(usernameInput, "diego");
    await user.type(passwordInput, "Diego123_");

    const button = screen.getByTestId("login-button");
    await user.click(button);

    expect(usernameInput.value).toBe("diego");
    expect(passwordInput.value).toBe("Diego123_");
    expect(mockHandler).toHaveBeenCalledTimes(2);
  });

  it("checks button click", async () => {
    const mockHandler = jest.fn();
    render(<LoginForm handleSubmit={mockHandler} />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await userEvent.type(usernameInput, "diego");
    await userEvent.type(passwordInput, "Diego123_");

    const button = screen.queryByTestId("login-button");
    await user.click(button);

    expect(usernameInput.value).toBe("diego");
    expect(passwordInput.value).toBe("Diego123_");
    expect(mockHandler).toHaveBeenCalledTimes(2);
  });

  it("checks button click", async () => {
    const mockHandler = jest.fn();
    render(<LoginForm handleSubmit={mockHandler} />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await userEvent.type(usernameInput, "diego");
    await userEvent.type(passwordInput, "Diego123_");

    const button = screen.queryByTestId("login-button");
    await user.click(button);

    expect(usernameInput.value).toBe("diego");
    expect(passwordInput.value).toBe("Diego123_");
    expect(mockHandler).toHaveBeenCalledTimes(2);
  });
});
