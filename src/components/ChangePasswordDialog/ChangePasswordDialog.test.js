import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePasswordDialog from ".";
import axios from "axios";

jest.mock("axios");

describe("ChangePasswordDialog", () => {
  const testDialogProps = {
    open: true,
    username: "dummyUser",
    onClose: jest.fn(),
    snackbarProps: {
      setOpen: jest.fn(),
      setSeverity: jest.fn(),
      setBody: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", async () => {
    render(<ChangePasswordDialog {...testDialogProps} />);

    // Textfields
    expect(screen.queryAllByLabelText(/Password/)).toHaveLength(2);
    screen.queryByLabelText(/Confirm password/i);

    // Typographies
    screen.getByText("Change password");
    screen.getByText("Enter your current password and a new password.");
    screen.getByText("Current password");
    screen.getByText("New password");

    // Buttons
    screen.getByText("Cancel");
    screen.getByText("Update");
  });

  it("should submit form when inputs are valid", async () => {
    axios.put.mockResolvedValue({
      data: { detail: "dummy message" },
    });

    render(<ChangePasswordDialog {...testDialogProps} />);
    const user = userEvent.setup();

    const passwordFields = screen.queryAllByLabelText(/Password/);
    const confirmPasswordField = screen.queryByLabelText(/Confirm password/i);

    fireEvent.change(passwordFields[0], {
      target: { value: "OldPassword1234" },
    });
    fireEvent.change(passwordFields[1], {
      target: { value: "NewPassword1234" },
    });
    fireEvent.change(confirmPasswordField, {
      target: { value: "NewPassword1234" },
    });

    await user.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/user/update",
        {
          username: testDialogProps.username,
          param: "password",
          new_pwd: "NewPassword1234",
          current_pwd: "OldPassword1234",
        }
      );
    });
  });

  it("should show an error message when password is invalid", async () => {
    render(<ChangePasswordDialog {...testDialogProps} />);
    const user = userEvent.setup();

    const passwordFields = screen.queryAllByLabelText(/Password/);
    const confirmPasswordField = screen.queryByLabelText(/Confirm password/i);

    fireEvent.change(passwordFields[0], {
      target: { value: "password" },
    });
    fireEvent.change(passwordFields[1], {
      target: { value: "NewPassword1234" },
    });
    fireEvent.change(confirmPasswordField, {
      target: { value: "NewPassword123" },
    });

    await user.click(screen.getByText("Update"));

    await waitFor(() => {
      screen.getByText("Incorrect password");
    });
  });

  it("should show an error message when new password is invalid", async () => {
    render(<ChangePasswordDialog {...testDialogProps} />);
    const user = userEvent.setup();

    const passwordFields = screen.queryAllByLabelText(/Password/);
    const confirmPasswordField = screen.queryByLabelText(/Confirm password/i);

    fireEvent.change(passwordFields[0], {
      target: { value: "OldPassword1234" },
    });
    fireEvent.change(passwordFields[1], {
      target: { value: "password" },
    });
    fireEvent.change(confirmPasswordField, {
      target: { value: "password" },
    });

    await user.click(screen.getByText("Update"));

    await waitFor(() => {
      screen.getByText(
        "Must contain 8 characters, one uppercase, one lowercase and one number"
      );
    });
  });

  it("should show an error message when new password and confirmation don't match", async () => {
    render(<ChangePasswordDialog {...testDialogProps} />);
    const user = userEvent.setup();

    const passwordFields = screen.queryAllByLabelText(/Password/);
    const confirmPasswordField = screen.queryByLabelText(/Confirm password/i);

    fireEvent.change(passwordFields[0], {
      target: { value: "OldPassword1234" },
    });
    fireEvent.change(passwordFields[1], {
      target: { value: "NewPassword1234" },
    });
    fireEvent.change(confirmPasswordField, {
      target: { value: "NewPassword123" },
    });

    await user.click(screen.getByText("Update"));

    await waitFor(() => {
      screen.getByText("Passwords don't match");
    });
  });
});
