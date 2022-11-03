import React from "react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import Login from "./Login";

describe("<Login", () => {
  it("component rendering", async () => {
    const component = renderer.create(<Login />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
