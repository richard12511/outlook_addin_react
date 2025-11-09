import { calculateReminderDate, timeStringToInteger } from "./dateUtils";

describe("timeStringToInteger", () => {
  it("converts time string to an integer", () => {
    expect(timeStringToInteger("09:30")).toBe(930);
    expect(timeStringToInteger("14:45")).toBe(1445);
    expect(timeStringToInteger("00:00")).toBe(0);
  });

  it("handles invalid input", () => {
    expect(timeStringToInteger("")).toBe(0);
    expect(timeStringToInteger("invalid")).toBe(0);
  });
});

describe("calculateReminderDate", () => {
  const baseDate = "2025-11-15";

  it("subtracts minutes correctly", () => {
    const result = calculateReminderDate(baseDate, 15, "minutes");
    const expected = new Date("2025-11-15");
    expected.setMinutes(expected.getMinutes() - 15);

    expect(result).toBe(expected.toISOString().split("T")[0]);
  });

  it("subtracts hours correctly", () => {
    const result = calculateReminderDate(baseDate, 2, "hours");
    const expected = new Date("2025-11-15");
    expected.setHours(expected.getHours() - 2);

    expect(result).toBe(expected.toISOString().split("T")[0]);
  });

  it("subtracts days correctly", () => {
    const result = calculateReminderDate(baseDate, 3, "days");

    expect(result).toBe("2025-11-12");
  });
});
