import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";

test("component rendering", () => {
  const component = render(<LoginForm />);
  component.getByText("Sign in");
  component.getByLabelText("Username");
  component.getByLabelText("Password");
  // const siT = component.getByText("Sign in");
  // const us = component.getByLabelText("Username");
  // const pswd = component.getByLabelText("Password");
  // expect(siT).toBeDefined();
  // expect(us).toBeDefined();
  // expect(pswd).toBeDefined();
});

test("click button calls event handler", async () => {
  const mockHandler = jest.fn();
  const component = render(<LoginForm handleSubmit={mockHandler} />);

  const button = component.getByText("Login");
  fireEvent.click(button);

  expect(mockHandler.mock.calls).toHaveLength(0);
});

test("validates username and password field to be not empty after write", () => {
  const mockHandler = jest.fn();
  const component = render(<LoginForm handleSubmit={mockHandler} />);

  const usernameInput = component.getByTestId("username-input");
  const passwordInput = component.getByTestId("password-input");

  userEvent.type(usernameInput, "diego");
  userEvent.type(passwordInput, "Diego123_");

  expect(usernameInput).not.toBe("");
  expect(passwordInput).not.toBe("");
});

test("validates username and password field to be not empty after write", () => {
  const mockHandler = jest.fn();
  const component = render(<LoginForm handleSubmit={mockHandler} />);

  const usernameInput = component.getByTestId("username-input");
  const passwordInput = component.getByTestId("password-input");

  userEvent.type(usernameInput, "diego");
  userEvent.type(passwordInput, "Diego123_");

  const button = component.getByText("Login");
  fireEvent.click(button);

  expect(mockHandler.mock.calls).toHaveLength(0);
});
