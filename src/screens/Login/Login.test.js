import React from "react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import Login from "./";

describe("<Login", () => {
  it("component rendering", async () => {
    const component = renderer.create(<Login />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("mock fetch", async () => {
    Login.loginUser = jest.fn();
    const fakeUser = {
      username: "diego",
      password: "Diego123_",
    };

    await Login.loginUser(fakeUser);
    expect(Login.loginUser).toHaveBeenCalledTimes(1);
    expect(Login.loginUser).toHaveBeenCalledWith(fakeUser);
  });
});
