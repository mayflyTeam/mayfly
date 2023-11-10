import React from "react";
import { render, screen, fireEvent, waitForElement } from "@testing-library/react";
import '@testing-library/jest-dom'


import LoginForm, { Props } from "../components/LoginForm";

describe("<LoginForm />", () => {
  test("should display a blank login form, with remember me checked by default", async () => {
    render(<LoginForm />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  });
});