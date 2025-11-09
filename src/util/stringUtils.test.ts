import { removeParentheses } from "./stringUtils";

describe("removeParentheses", () => {
  it("removes single set of parentheses", () => {
    const input = "FW: (JJ-Test Company Bhd) HTRI membership renewal";
    const expected = "FW: HTRI membership renewal";

    expect(removeParentheses(input)).toBe(expected);
  });

  it("handles text with no parentheses", () => {
    const input = "No parenthesis here";

    expect(removeParentheses(input)).toBe(input);
  });

  it("cleanes up extra spaces after removal", () => {
    const input = "Dummy   (removed)  text";
    const expected = "Dummy text";

    expect(removeParentheses(input)).toBe(expected);
  });

  it("handles empty string", () => {
    expect(removeParentheses("")).toBe("");
  });

  it("handles null/undefined gracefully", () => {
    expect(removeParentheses(null)).toBe(null);
    expect(removeParentheses(undefined)).toBe(undefined);
  });
});
