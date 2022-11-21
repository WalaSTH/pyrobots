import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, render } from "@testing-library/react";
import Lobby from "./";
import renderer, { act } from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";

describe("Lobby", () => {
  it("renders correctly", () => {
    act(() =>
      render(
        <BrowserRouter>
          <Lobby />
        </BrowserRouter>
      )
    );
    screen.getByText(/Back/i);
    screen.getByText(/Participants/i);
    screen.getByText(/Details/i);
  });

  it("matches Snapshot", () => {
    const component = renderer.create(
      <BrowserRouter>
        <Lobby />
      </BrowserRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
