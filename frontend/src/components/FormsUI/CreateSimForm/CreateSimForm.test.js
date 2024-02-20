import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, render, act } from "@testing-library/react";
import CreateSimForm from "./";
import renderer from "react-test-renderer";

console.error = () => {};

describe("CreateSimForm", () => {
  it("Render component", () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => render(<CreateSimForm />));
    screen.getByText(/Create Simulation/i);
    screen.getByText(/Number of rounds/i);
    screen.getByLabelText(/Rounds/i);
    const selectRobotButtons = screen.getAllByRole("button", {
      name: /robotSelect/i,
    });
    expect(selectRobotButtons).toHaveLength(4);
    selectRobotButtons.forEach((button) => {
      expect(button).toHaveTextContent(/Select robot/i, { exact: false });
    });
    screen.getByText(/Run simulation/i);
  });

  it("Matches Snapshot", () => {
    const component = renderer.create(<CreateSimForm />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("handleError functionality", () => {
    CreateSimForm.handleError = jest.fn();
    CreateSimForm.handleError();
    expect(CreateSimForm.handleError).toHaveBeenCalledTimes(1);
  });
});
