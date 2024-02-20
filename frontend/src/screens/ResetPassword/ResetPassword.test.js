import React from "react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import ResetPassword from "./";
import { BrowserRouter } from "react-router-dom";

describe("<ResetPassword", () => {
  it("component rendering", async () => {
    const component = renderer.create(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("mock fetch", async () => {
    ResetPassword.handleSubmit = jest.fn();
    const fakeReset = {
      user: "fake token",
      password: "Password1",
    };

    await ResetPassword.handleSubmit(fakeReset);
    expect(ResetPassword.handleSubmit).toHaveBeenCalledTimes(1);
    expect(ResetPassword.handleSubmit).toHaveBeenCalledWith(fakeReset);
  });
});
