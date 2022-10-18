import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, render } from "@testing-library/react";
import Leftbar from "./Leftbar";

describe("<Leftbar", () => {
  it("component rendering when token is 1", () => {
    render(<Leftbar />);
    screen.getByText(/Home/i);
    screen.getByText(/Profile/i);
    screen.getByText(/Find match/i);
    screen.getByText(/Create match/i);
    screen.getByText(/Create simulation/i);
    screen.getByText(/Create robot/i);
    screen.getByText(/Match history/i);
    screen.getByText(/Settings/i);
    screen.getByText(/Logout/i);
  });
});
