import * as React from "react";
import { render, screen } from "@testing-library/react";
import App from "./components/LoginForm/LoginForm";

test("renders login form", () => {
  render(<App />);
});

// // import "@testing-library/jest-dom/extend-expect";

// // import { fireEvent, render } from "@testing-library/react";
// // import * as React from "react";

// // import FormTest from "./components/LoginForm/LoginForm";

// // describe("account login form", () => {
// //   it("renders default state", () => {
// //     const { getByTestId } = render(<FormTest />);

// //     const username = getByTestId("account-username");
// //     const password = getByTestId("account-password");
// //     const submit = getByTestId("account-submit");

// //     expect(username.value).not.toBe("");
// //     expect(password.value).not.toBe("");
// //     expect(submit).not.toHaveClass("Mui-disabled");
// //   });

// //   it("keeps the submit button disabled when only password provided", () => {
// //     const { getByTestId } = render(<FormTest />);

// //     const password = getByTestId("account-password");
// //     const submit = getByTestId("account-submit");

// //     fireEvent.change(password, { target: { value: "password" } });
// //     expect(submit).not.toHaveClass("Mui-disabled");
// //   });

// //   it("keeps the submit button disabled when only confirm is checked", () => {
// //     const { getByTestId } = render(<FormTest />);

// //     const username = getByTestId("account-username");
// //     const submit = getByTestId("account-submit");

// //     fireEvent.change(username, { target: { value: "username" } });
// //     expect(submit).toHaveClass("Mui-disabled");
// //   });

// //   it("enables the submit button when the form is filled out", () => {
// //     const { getByTestId } = render(<FormTest />);

// //     const password = getByTestId("account-password");
// //     const confirm = getByTestId("account-username");
// //     const submit = getByTestId("account-submit");

// //     fireEvent.change(password, { target: { value: "password" } });
// //     fireEvent.change(username, { target: { value: "diego" } });

// //     expect(submit).not.toHaveClass("Mui-disabled");
// //   });
// // });
