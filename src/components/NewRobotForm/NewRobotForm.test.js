import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, render } from "@testing-library/react";
import NewRobotForm from ".";

describe("NewRobotForm", () => {
  it("Render component", () => {
    render(<NewRobotForm />);
    screen.getByText(/New Robot/i);
    screen.getByLabelText(/Robot Name/i);
    screen.getByText(/Upload Avatar/i);
    screen.getByText(/Upload File/i);
    screen.getByText(/Create Robot/i);
  });
});
