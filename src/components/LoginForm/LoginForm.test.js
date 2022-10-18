import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";

describe("<LoginForm", () => {
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
    await fireEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(0);
  });

  test("validates username and password field to be not empty after write", async () => {});
  it("asdasdas", async () => {
    const mockHandler = jest.fn();
    render(<LoginForm handleSubmit={mockHandler} />);

    const usernameInput = screen
      .getByTestId("username-input")
      .querySelector("input");
    const passwordInput = screen
      .getByTestId("password-input")
      .querySelector("input");

    await userEvent.type(usernameInput, "diego");
    await userEvent.type(passwordInput, "Diego123_");

    expect(usernameInput.value).toBe("diego");
    expect(passwordInput.value).toBe("Diego123_");
  });
});
