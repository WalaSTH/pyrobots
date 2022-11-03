import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import CreateMatchForm from "./";

describe("<CreateMatchForm", () => {
  const user = userEvent.setup();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("component rendering", async () => {
    const component = renderer.create(<CreateMatchForm />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("component renders with all the components", () => {
    render(<CreateMatchForm />);
    screen.getByLabelText(/Name of the match/i);
    screen.getByLabelText(/Password/i);
    screen.getByLabelText(/Min players/i);
    screen.getByLabelText(/Max players/i);
    screen.getByLabelText(/Games/i);
    screen.getByLabelText(/Rounds/i);
    screen.getByLabelText(/Robot ID/i);
  });

  it("mock fetch", async () => {
    CreateMatchForm.handleSubmit = jest.fn();
    const fakeMatch = {
      name: "PatriaoPaper",
      password: "",
      min_players: "2",
      max_players: "4",
      games_per_match: "10000",
      rounds: "200",
      robot_id: "1",
      creator: 1,
    };

    await CreateMatchForm.handleSubmit(fakeMatch);
    expect(CreateMatchForm.handleSubmit).toHaveBeenCalledTimes(1);
    expect(CreateMatchForm.handleSubmit).toHaveBeenCalledWith(fakeMatch);
  });
});
