import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor } from "@testing-library/react";
import renderer, { act } from "react-test-renderer";
import UserProfile from ".";
import axios from "axios";

jest.mock("axios");

describe("UserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correct stats after fethching succesfully", async () => {
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

  it("should render skeletons and snackbar after fetching erroneously", async () => {
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

  it("matches Snapshot", () => {
    const component = renderer.create(<UserProfile />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
