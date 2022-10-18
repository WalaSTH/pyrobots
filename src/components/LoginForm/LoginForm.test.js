import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";

describe("<LoginForm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("component rendering", () => {
    render(<LoginForm />);
    screen.getByText(/Sign in/i);
    screen.getByLabelText(/Username/i);
    screen.getByLabelText(/Password/i);
    // const siT = component.getByText("Sign in");
    // const us = component.getByLabelText("Username");
    // const pswd = component.getByLabelText("Password");
    // expect(siT).toBeDefined();
    // expect(us).toBeDefined();
    // expect(pswd).toBeDefined();
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

  it("validates handleSubmit after correct parameters", async () => {
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

    const button = screen.getByTestId("login-button");
    button.click();

    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });
});
