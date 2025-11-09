import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FindBpCard from "./FindBpCard";

describe("FindBpCard", () => {
  const mockOnFind = jest.fn();
  const mockOnBrowse = jest.fn();
  const mockEmailOptions = [
    { displayName: "John Doe", emailAddress: "john@example.com" },
    { displayName: "Jane Smith", emailAddress: "jane@example.com" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields", () => {
    render(
      <FindBpCard onFind={mockOnFind} onBrowse={mockOnBrowse} emailOptions={mockEmailOptions} />
    );

    expect(screen.getByPlaceholderText("Search by CardCode")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search by CardName")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type or select an email")).toBeInTheDocument();
  });

  it("calls onFind with entered values when Find button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FindBpCard onFind={mockOnFind} onBrowse={mockOnBrowse} emailOptions={mockEmailOptions} />
    );

    await user.type(screen.getByPlaceholderText("Search by CardCode"), "P49002");
    await user.type(screen.getByPlaceholderText("Search by CardName"), "Richard");
    await user.type(screen.getByPlaceholderText("Type or select an email"), "test@gmail.com");

    await user.click(screen.getByRole("button", { name: /find/i }));

    expect(mockOnFind).toHaveBeenCalledWith("P49002", "Richard", "test@gmail.com");
  });
});
