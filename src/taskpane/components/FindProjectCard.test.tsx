import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FindProjectCard from "./FindProjectCard";

describe("FindProjectCard", () => {
  const mockOnFind = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders only the project code input field at first", () => {
    render(<FindProjectCard onFind={mockOnFind} />);

    expect(screen.getByLabelText(/Project Code/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Project Path/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Project Name/i)).not.toBeInTheDocument();
  });

  it("renders the name and path input fields after expand is clicked", async () => {
    const user = userEvent.setup();
    render(<FindProjectCard onFind={mockOnFind} />);

    const expandButton = screen.getByRole("button", { name: /expand/i });
    await user.click(expandButton);

    expect(screen.getByLabelText(/Project Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Path/i)).toBeInTheDocument();
  });

  it("calls onFind with entered values when Find button is clicked", async () => {
    const user = userEvent.setup();
    render(<FindProjectCard onFind={mockOnFind} />);

    await user.type(screen.getByLabelText(/project code/i), "15876");
    await user.click(screen.getByRole("button", { name: /find/i }));

    expect(mockOnFind).toHaveBeenCalledWith("15876", "", "");
  });
});
