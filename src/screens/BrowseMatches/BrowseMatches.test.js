import { render, screen } from "@testing-library/react";
import BrowseMatches from "./";

describe("<BrowseMatches", () => {
  it("should render", async () => {
    render(<BrowseMatches />);
    screen.getByText("Refresh");
  });
});
