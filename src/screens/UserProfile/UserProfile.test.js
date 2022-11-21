import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import renderer, { act } from "react-test-renderer";
import UserProfile from ".";

jest.mock("axios");

describe("UserProfile", () => {
  // const user = userEvent.setup();
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render the component", () => {
    axios.get.mockImplementationOnce(() => Promise.resolve());
    render(<UserProfile />);
    expect(screen.getByTestId("userAvatar")).toBeInTheDocument();
    expect(screen.getByTestId("userName")).toBeInTheDocument();
    expect(screen.getByTestId("userSettingsButton")).toBeInTheDocument();
    expect(screen.getByText(/User stats/i)).toBeInTheDocument();
    expect(screen.getByText(/Matches played/i)).toBeInTheDocument();
    expect(screen.getByText(/Matches won/i)).toBeInTheDocument();
    expect(screen.getByText(/Victory rate/i)).toBeInTheDocument();
  });

  it("should render user stats after succesful fetch", async () => {
    const mockAxiosResponse = {
      status: 200,
      data: { played_matches: 1, victories: 1 },
    };
    axios.get.mockImplementation(() => Promise.resolve(mockAxiosResponse));

    act(() => {
      render(<UserProfile />);
    });

    expect(screen.getByTestId("statsPlayed")).toHaveTextContent(
      mockAxiosResponse.data.played_matches
    );

    expect(screen.getByTestId("statsWon")).toHaveTextContent(
      mockAxiosResponse.data.victories
    );

    expect(screen.getByTestId("statsRate")).toHaveTextContent(
      mockAxiosResponse.data.victories / mockAxiosResponse.data.played_matches +
        "%"
    );
  });

  it("should render Skeletons after unsuccesful fetch", async () => {
    const mockAxiosError = {
      detail: "dummy error message",
    };

    jest
      .mocked(axios.get)
      .mockImplementation(() =>
        Promise.reject({ detail: "dummy error message" })
      );

    act(() => {
      render(<UserProfile />);
    });
    expect(screen.getAllByTestId("statsSkeleton")).toHaveLength(3);
    expect(screen.getByTestId("profileSnackbar")).toHaveTextContent(
      mockAxiosError.detail
    );
  });

  // it("should render menu after click on user settings button", async () => {
  //   render(<UserProfile />);
  //   const userSettingsButton = screen.getByTestId("userSettingsButton");
  //   await user.click(userSettingsButton);

  //   const userSettingsMenu = screen.getByTestId("userSettingsMenu");
  //   const avatarMenuItem = screen.getByText("Change user avatar");
  //   const passwordMenuItem = screen.getByText("Change password");

  //   expect(userSettingsMenu).toBeInTheDocument();
  //   expect(userSettingsMenu).toContainElement(avatarMenuItem);
  //   expect(userSettingsMenu).toContainElement(passwordMenuItem);
  // });

  //   it("should stop rendering menu after clicking away", async () => {
  //     const user = userEvent.setup();
  //     render(<UserProfile />);
  //     const userSettingsButton = screen.getByTestId("userSettingsButton");

  //     await user.click(userSettingsButton);
  //     expect(screen.getByTestId("userSettingsMenu")).toBeInTheDocument();

  //     fireEvent.click(screen.getByText("Change user avatar"));
  //     await waitFor(() => {
  //       expect(screen.getByTestId("userSettingsMenu")).toBeInTheDocument();
  //     });
  //   });

  it("matches Snapshot", () => {
    const component = renderer.create(<UserProfile />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
