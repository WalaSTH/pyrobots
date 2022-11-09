import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import ResetPasswordForm from "./";

describe("<ResetPassword", () => {
  const user = userEvent.setup();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("component rendering", () => {
    const component = renderer.create(<ResetPasswordForm />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("component renders with all the components", () => {
    render(<ResetPasswordForm />);
    screen.getByText("Reset your password");
    screen.getByTestId("Password");
    screen.getByTestId("passwordConfirmation");
    screen.getByTestId("resetPassword-button");
  });

  it("validates password field to be not empty after write", async () => {
    const mockHandler = jest.fn();
    render(<ResetPasswordForm handleSubmit={mockHandler} />);

    const passwordInput = screen.getByLabelText(/Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm your password/);

    await user.type(passwordInput, "Password1");
    await user.type(confirmPasswordInput, "Password1");

    const button = screen.getByTestId("resetPassword-button");
    await user.click(button);

    expect(passwordInput.value).toBe("Password1");
    expect(confirmPasswordInput.value).toBe("Password1");
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("checks recover without email does not send email", async () => {
    const mockHandler = jest.fn();
    render(<ResetPasswordForm handleSubmit={mockHandler} />);

    const button = screen.queryByTestId("recover-button");
    await user.click(button);

    expect(mockHandler).toHaveBeenCalledTimes(0);
  });
});
