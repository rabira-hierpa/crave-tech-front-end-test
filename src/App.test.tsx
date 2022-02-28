import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "./containers/HomePage";

// TODO: write tests for adding tasks, adding subtasks, unlocking next stage and checking all subtasks complete

test("check if homepage is rendered", () => {
  render(<HomePage />);
  expect(screen.getByText(/Startup Progress Tracker/i)).toBeInTheDocument();
});
