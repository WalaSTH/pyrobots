import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, render } from "@testing-library/react";
import MainPage from "./";
import { act } from "react-test-renderer";

describe("<MainPage", () => {
  it("component rendering", () => {
    act(() => render(<MainPage />));
    screen.getByText(/Py Robots/i);
    screen.getByText(/Build your own robot and compete!/i);
    screen.getByText(/Login/i);
    screen.getByText(/Register/i);
  });
});
