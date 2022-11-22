import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderer, { act } from "react-test-renderer";
import UserProfile from ".";
import axios from "axios";

jest.mock("axios");

describe("UserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render initial state of the component correctly", async () => {
    await act(async () => render(<UserProfile />));
    // User info
    expect(screen.getByTestId("userAvatar")).toBeInTheDocument();
    expect(screen.getByTestId("userName")).toBeInTheDocument();

    // User settings button
    expect(screen.getByTestId("userSettingsButton")).toBeInTheDocument();

    // User stats
    expect(screen.getByText(/User stats/i)).toBeInTheDocument();
    expect(screen.getByText(/Matches played/i)).toBeInTheDocument();
    expect(screen.getByText(/Matches won/i)).toBeInTheDocument();
    expect(screen.getByText(/Victory rate/i)).toBeInTheDocument();
    expect(screen.queryAllByTestId("statsSkeleton")).toHaveLength(3);

    // Settings menu should be closed
    expect(screen.queryByTestId("userSettingsMenu")).toBeNull();
    expect(screen.queryAllByTestId("menuItem")).toHaveLength(0);
    expect(screen.queryByText(/Change user avatar/i)).toBeNull();
    expect(screen.queryByText(/Change password/i)).toBeNull();
  });

  it("should render stats after succesfully fethching stats", async () => {
    const mockedStats = { played_matches: 1, victories: 1 };

    axios.get.mockResolvedValue({
      data: { stats: mockedStats },
    });

    render(<UserProfile />);

    await waitFor(() => {
      const statsItems = screen.queryAllByTestId("statsItem");
      const statsSkeletons = screen.queryAllByTestId("statsSkeleton");

      expect(statsItems).toHaveLength(3);
      expect(statsSkeletons).toHaveLength(0);

      expect(statsItems[0]).toHaveTextContent(mockedStats.played_matches);
      expect(statsItems[1]).toBeInTheDocument(mockedStats.victories);
      expect(statsItems[2]).toBeInTheDocument(
        mockedStats.victories / mockedStats.played_matches + "%"
      );
    });
  });

  it("should render skeletons and snackbar after erroneously fetching stats", async () => {
    const mockedDetail = "dummy error message";

    axios.get.mockRejectedValue({
      response: { data: { detail: mockedDetail } },
    });

    render(<UserProfile />);

    await waitFor(() => {
      const statsItems = screen.queryAllByTestId("statsItem");
      const statsSkeletons = screen.queryAllByTestId("statsSkeleton");
      const errorSkeleton = screen.getByTestId("profileSnackbar");

      expect(statsItems).toHaveLength(0);
      expect(statsSkeletons).toHaveLength(3);
      expect(errorSkeleton).toBeInTheDocument();
      expect(errorSkeleton).toHaveTextContent(mockedDetail);
    });
  });

  it("should open menu after clicking on the settings icon", async () => {
    const user = userEvent.setup();
    await act(async () => render(<UserProfile />));

    await user.click(screen.getByTestId("userSettingsButton"));

    expect(screen.getByTestId("userSettingsMenu")).toBeInTheDocument();
    expect(screen.queryAllByTestId("menuItem")).toHaveLength(2);
    expect(screen.getByText(/Change avatar/i)).toBeInTheDocument();
    expect(screen.getByText(/Change password/i)).toBeInTheDocument();
  });

  it("should close menu after clicking on any of the options", async () => {
    const user = userEvent.setup();
    await act(async () => render(<UserProfile />));

    await user.click(screen.getByTestId("userSettingsButton"));
    await user.click(screen.getByText(/Change avatar/i));
    await waitFor(() =>
      expect(screen.queryByTestId("userSettingsMenu")).toBeNull()
    );

    await user.click(screen.getByTestId("userSettingsButton"));
    await user.click(screen.getByText(/Change password/i));
    await waitFor(() =>
      expect(screen.queryByTestId("userSettingsMenu")).toBeNull()
    );
  });

  it("matches Snapshot", () => {
    const component = renderer.create(<UserProfile />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
