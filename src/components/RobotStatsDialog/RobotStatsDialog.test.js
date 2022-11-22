import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import RobotStatsDialog from ".";

describe("RobotStatsDialog", () => {
  it("should render the component", async () => {
    const testDialogProps = {
      open: true,
      name: "dummyName",
      stats: {
        played: 1,
        won: 1,
      },
    };

    render(<RobotStatsDialog {...testDialogProps} />);

    // Typographies
    screen.getByText(testDialogProps.name + "'s stats");
    screen.getByText("Matches played");
    screen.getByText("Matches won");
    screen.getByText("Win rate");

    // Stats
    const statsItems = screen.queryAllByTestId("statsItem");
    expect(statsItems).toHaveLength(3);
    expect(statsItems[0]).toHaveTextContent(testDialogProps.stats.played);
    expect(statsItems[1]).toHaveTextContent(testDialogProps.stats.won);
    expect(statsItems[2]).toHaveTextContent(
      (
        (testDialogProps.stats.won / testDialogProps.stats.played) *
        100
      ).toFixed(2) + "%"
    );

    // Buttons
    screen.getByText("Close");
  });

  it("should render win rate of 0.00% when matches played is 0", async () => {
    const testDialogProps = {
      open: true,
      name: "dummyName",
      stats: {
        played: 0,
        won: 0,
      },
    };

    render(<RobotStatsDialog {...testDialogProps} />);

    const statsItems = screen.queryAllByTestId("statsItem");
    expect(statsItems).toHaveLength(3);
    expect(statsItems[2]).toHaveTextContent("0.00%");

    // Buttons
    screen.getByText("Close");
  });

  it("should match Snapshot", () => {
    const tree = renderer
      .create(
        <RobotStatsDialog
          open={false}
          stats={{
            played: 1,
            won: 1,
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
