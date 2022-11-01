import React from "react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import { screen, render } from "@testing-library/react";
import NewRobotForm from ".";

describe("NewRobotForm", () => {
  const user = userEvent.setup();

  it("rendering snapshot", () => {
    const tree = renderer.create(<NewRobotForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Render component", () => {
    render(<NewRobotForm />);
    screen.getByText(/New Robot/i);
    screen.getByLabelText(/Name/i);
    screen.getByText(/Select Avatar/i);
    screen.getByText(/Select File/i);
    screen.getByText(/Create Robot/i);
  });

  it("checks security of not letting create new robot withoute necessary data", async () => {
    const mockHandler = jest.fn();
    render(<NewRobotForm onSubmit={mockHandler} />);
    const button = screen.getByTestId("submitButton");
    await user.click(button);

    expect(mockHandler).toHaveBeenCalledTimes(0);
  });

  it("checks that new robot actually uploads", async () => {
    const mockHandler = jest.fn();
    render(<NewRobotForm onSubmit={mockHandler} />);

    const nameInput = screen.getByTestId("robotNameInput");
    const robotCodeInput = screen.getByTestId("robotCodeInput");
    const file = new File(["hello"], "examplerobot.py", { type: "py" });

    await user.type(nameInput, "Patria o paper");
    await user.upload(robotCodeInput, file);

    const button = screen.getByTestId("submitButton");
    await user.click(button);
  });
});
