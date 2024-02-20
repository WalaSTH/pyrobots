import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangeAvatarDialog from ".";
import axios from "axios";

jest.mock("axios");

describe("ChangeAvatarDialog", () => {
  const testDialogProps = {
    open: true,
    username: "dummyUser",
    onClose: jest.fn(),
    avatar: "dummyAvatar",
    setAvatar: jest.fn(),
    snackbarProps: {
      setOpen: jest.fn(),
      setSeverity: jest.fn(),
      setBody: jest.fn(),
    },
  };

  it("should render the component", async () => {
    render(<ChangeAvatarDialog {...testDialogProps} />);

    // Avatar
    screen.getByTestId("avatarDisplay");

    // Typographies
    screen.getByText("Change avatar");

    // Buttons
    screen.getByText("Select an image");
    screen.getByText("Delete");
    screen.getByText("Cancel");
    screen.getByText("Update");
  });

  it("should submit form after uploading valid file", async () => {
    axios.put.mockResolvedValue({
      data: { detail: "dummy message", new_avatar: "dummy avatar" },
    });

    render(<ChangeAvatarDialog {...testDialogProps} />);
    const user = userEvent.setup();

    const file = new File(["dummyContent"], "dummyFile.png", {
      type: "image/png",
    });
    const readFile = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    await user.upload(screen.getByTestId("avatarInputButton"), file);
    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveAttribute("src", readFile);
    });

    await user.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/user/update",
        {
          username: testDialogProps.username,
          param: "avatar",
          new_pic: readFile,
        }
      );
    });
  });

  it("should submit form after deleting avatar", async () => {
    axios.put.mockResolvedValue({
      data: { detail: "dummy message", new_avatar: "dummy avatar" },
    });

    render(<ChangeAvatarDialog {...testDialogProps} />);
    const user = userEvent.setup();

    await user.click(screen.getByText("Delete"));
    await user.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/user/update",
        {
          username: testDialogProps.username,
          param: "avatar",
          new_pic: "",
        }
      );
    });
  });
});
