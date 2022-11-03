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

  it("validates fields to have something after write", async () => {
    CreateMatchForm.handleSubmit = jest.fn();
    render(<CreateMatchForm />);

    const nameOfTheMatchInput = screen.getByLabelText(/Name of the match/i);
    const minPlayersInput = screen.getByLabelText(/Password/i);
    const maxPlayersInput = screen.getByLabelText(/Min players/i);
    const gamesInput = screen.getByLabelText(/Max players/i);
    const roundsInput = screen.getByLabelText(/Games/i);
    const robotIdInput = screen.getByLabelText(/Rounds/i);

    await user.type(nameOfTheMatchInput, "diego");
    await user.type(minPlayersInput, "2");
    await user.type(maxPlayersInput, "4");
    await user.type(gamesInput, "200");
    await user.type(roundsInput, "10000");
    await user.type(robotIdInput, "1");

    const button = screen.getByRole("button", { name: /Create-match/i });
    await user.click(button);

    expect(nameOfTheMatchInput.value).toBe("diego");
    expect(minPlayersInput.value).toBe("2");
    expect(maxPlayersInput.value).toBe("4");
    expect(gamesInput.value).toBe("200");
    expect(roundsInput.value).toBe("10000");
    expect(robotIdInput.value).toBe("1");
  });

  it("mock fetch", async () => {
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
