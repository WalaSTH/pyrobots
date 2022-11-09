import React from "react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import Recover from "./";
import { BrowserRouter } from "react-router-dom";

describe("<Recover", () => {
  it("component rendering", async () => {
    const component = renderer.create(
      <BrowserRouter>
        <Recover />
      </BrowserRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("mock fetch", async () => {
    Recover.handleSubmit = jest.fn();
    const fakeReset = {
      user: "fake token",
      password: "Password1",
    };

    await Recover.handleSubmit(fakeReset);
    expect(Recover.handleSubmit).toHaveBeenCalledTimes(1);
    expect(Recover.handleSubmit).toHaveBeenCalledWith(fakeReset);
  });
});
