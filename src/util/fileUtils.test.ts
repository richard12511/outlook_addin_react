import { generateUniqueId } from "./fileUtils";

describe("generateUniqueId", () => {
  it("generates different ids each time", () => {
    const result1 = generateUniqueId();
    const result2 = generateUniqueId();
    const result3 = generateUniqueId();

    expect(result1).not.toBe(result2);
    expect(result1).not.toBe(result3);
    expect(result2).not.toBe(result3);
  });

  it("removes url unsafe characters", () => {
    const result1 = generateUniqueId();
    const result2 = generateUniqueId();
    const result3 = generateUniqueId();

    expect(result1).not.toContain("=");
    expect(result1).not.toContain("+");

    expect(result2).not.toContain("=");
    expect(result2).not.toContain("+");

    expect(result3).not.toContain("=");
    expect(result3).not.toContain("+");
  });
});
