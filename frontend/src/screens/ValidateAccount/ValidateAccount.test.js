import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import ValidateAccount from "./";
import { BrowserRouter } from "react-router-dom";

describe("<ResetPassword", () => {
  it("component rendering", async () => {
    const component = renderer.create(
      <BrowserRouter>
        <ValidateAccount />
      </BrowserRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
