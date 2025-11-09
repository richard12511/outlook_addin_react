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
});
