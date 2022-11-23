import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import RecoverForm from "./";

describe("<RecoverForm", () => {
  const user = userEvent.setup();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("component rendering", () => {
    const component = renderer.create(<RecoverForm />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("component renders with all the components", () => {
    render(<RecoverForm />);
    screen.getByLabelText(/Email/i);
    screen.getByText("Return to login");
    expect(screen.getByText("Return to login")).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("validates email field to be not empty after write", async () => {
    const mockHandler = jest.fn();
    render(<RecoverForm handleSubmit={mockHandler} />);

    const emailInput = screen.getByLabelText(/Email/i);

    await user.type(emailInput, "test@gmail.com");

    const button = screen.getByTestId("recover-button");
    await user.click(button);

    expect(emailInput.value).toBe("test@gmail.com");
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("checks recover without email does not send email", async () => {
    const mockHandler = jest.fn();
    render(<RecoverForm handleSubmit={mockHandler} />);

    const button = screen.queryByTestId("recover-button");
    await user.click(button);

    expect(mockHandler).toHaveBeenCalledTimes(0);
  });
});
