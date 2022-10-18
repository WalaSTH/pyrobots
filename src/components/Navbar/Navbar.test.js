import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, render } from "@testing-library/react";
import Navbar from "./Navbar";

describe("<Navbar", () => {
  it("component rendering", () => {
    render(<Navbar />);
    screen.getByLabelText(/logo/i);
    screen.getByText(/PY-ROBOTS/i);
    screen.getByText(/Home/i);
    screen.getByText(/Login/i);
    screen.getByText(/Register/i);
  });

  it("Navbar should change when token is not null", () => {
    const newProps = {
      token: 1,
    };
    render(<Navbar {...newProps} />);
    screen.getByAltText = /User Avatar/i;
  });
});
