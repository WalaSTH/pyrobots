import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import RobotStatsDialog from ".";

describe("RobotStatsDialog", () => {
  const testDialogProps = {
    open: true,
    onClose: jest.fn(),
    name: "dummyName",
    stats: {
      played: 1,
      won: 1,
    },
  };

  it("should render the component", async () => {
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

  it("should match Snapshot", () => {
    const tree = renderer
      .create(<RobotStatsDialog open={false} stats={testDialogProps.stats} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
