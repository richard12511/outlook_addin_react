export const removeParentheses = (text: string): string => {
  if (!text) {
    return text;
  }

  // Remove all text within parentheses, including the parentheses
  let result = text.replace(/\([^)]*\)/g, "");
  // Clean up multiple spaces that may result from removal
  result = result.replace(/\s+/g, " ");

  // Trim leading/trailing whitespace
  result = result.trim();

  return result;
};
