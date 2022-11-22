import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import { render, screen, act } from "@testing-library/react";
import CreateMatchForm from "./";
import { BrowserRouter } from "react-router-dom";

console.error = () => {};

describe("<CreateMatchForm", () => {
  const user = userEvent.setup();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("component rendering", async () => {
    const component = renderer.create(
      <BrowserRouter>
        <CreateMatchForm />
      </BrowserRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("component renders with all the components", () => {
    render(
      <BrowserRouter>
        <CreateMatchForm />
      </BrowserRouter>
    );
    screen.getByLabelText(/Name of the match/i);
    screen.getByLabelText("Password (Optional)");
    screen.getByLabelText(/Min players/i);
    screen.getByLabelText(/Max players/i);
    screen.getByLabelText(/Games/i);
    screen.getByLabelText(/Rounds/i);
    screen.getByText("Create Match");
  });

  it("mock fetch", async () => {
    const mockHandler = jest.fn();
    // eslint-disable-next-line testing-library/no-unnecessary-act
    render(
      <BrowserRouter>
        <CreateMatchForm userID={1} handleSubmit={mockHandler} />
      </BrowserRouter>
    );

    const name = screen.getByLabelText(/Name of the match/i);
    const min = screen.getByLabelText(/Min players/i);
    const max = screen.getByLabelText(/Max players/i);
    const games = screen.getByLabelText(/Games/i);
    const rounds = screen.getByLabelText(/Rounds/i);
    const createMatchButton = screen.getByTestId("createMatchButton");

    await user.type(name, "PatriaoPaper");
    expect(screen.getByLabelText(/Name of the match/i).value).toBe(
      "PatriaoPaper"
    );
    await user.type(min, "2");
    expect(screen.getByLabelText(/Min players/i).value).toBe("2");
    await user.type(max, "4");
    expect(screen.getByLabelText(/Max players/i).value).toBe("4");
    await user.type(games, "200");
    expect(screen.getByLabelText(/Games/i).value).toBe("200");
    await user.type(rounds, "1000");
    expect(screen.getByLabelText(/Rounds/i).value).toBe("1000");
    await user.click(createMatchButton);
  });

  it("mock wrong form submit", async () => {
    const mockHandler = jest.fn();
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() =>
      render(
        <BrowserRouter>
          <CreateMatchForm userID={1} handleSubmit={mockHandler} />
        </BrowserRouter>
      )
    );

    await user.type(
      screen.getByLabelText(/Name of the match/i),
      "PatriaoPaper"
    );
    await user.type(screen.getByLabelText(/Min players/i), "2");
    await user.type(screen.getByLabelText(/Max players/i), "4");
    await user.type(screen.getByLabelText(/Games/i), "0");
    await user.type(screen.getByLabelText(/Rounds/i), "200");
    await user.click(screen.getByTestId("createMatchButton"));
    expect(mockHandler).toHaveBeenCalledTimes(0);
  });
});
