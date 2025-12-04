import { describe, it, expect } from "vitest";
import { formatISO } from "../../../lib/formatters/date";

describe("formatISO", () => {
  it("formats ISO string to DD-MM-YYYY HH:mm format", () => {
    const result = formatISO("2024-01-15T10:30:00Z");
    expect(result).toBe("15-01-2024 10:30");
  });

  it("pads single digit days and months with zeros", () => {
    const result = formatISO("2024-03-05T08:05:00Z");
    expect(result).toBe("05-03-2024 08:05");
  });

  it("handles midnight correctly", () => {
    const result = formatISO("2024-12-25T00:00:00Z");
    expect(result).toBe("25-12-2024 00:00");
  });

  it("handles end of day correctly", () => {
    const result = formatISO("2024-12-31T23:59:00Z");
    expect(result).toBe("31-12-2024 23:59");
  });

  it("formats dates with milliseconds", () => {
    const result = formatISO("2024-06-15T14:30:45.123Z");
    expect(result).toBe("15-06-2024 14:30");
  });

  it("handles leap year date", () => {
    const result = formatISO("2024-02-29T12:00:00Z");
    expect(result).toBe("29-02-2024 12:00");
  });
});
