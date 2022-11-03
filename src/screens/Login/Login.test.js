import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import Login from "./Login";

describe("<Login", () => {
  const user = userEvent.setup();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("component rendering", async () => {
    const component = renderer.create(<Login />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("component renders with all the components", () => {
    render(<Login />);
  });

  it("mock fetch", async () => {
    const fakeUser = {
      username: "diego",
      password: "Diego123_",
    };

    // await Login.loginUser(fakeUser);
    // expect(Login.handleSubmit).toHaveBeenCalledTimes(1);
    // expect(Login.handleSubmit).toHaveBeenCalledWith(fakeUser);
  });
});
