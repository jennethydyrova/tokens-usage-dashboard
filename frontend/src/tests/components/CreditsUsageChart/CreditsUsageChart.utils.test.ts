import { describe, it, expect } from "vitest";
import type { UsageData } from "../../../lib/types";
import { transformUsageDataForChart } from "../../../components/CreditsUsageChart.tsx/CreditsUsageChart.utils";

describe("transformUsageDataForChart", () => {
  it("transforms usage data into chart format", () => {
    const mockData: UsageData = {
      usage: [
        {
          message_id: 123,
          timestamp: "2024-01-15T10:30:00",
          report_name: "Sales Report",
          credits_used: 2.5,
        },
        {
          message_id: 124,
          timestamp: "2024-01-16T14:20:00",
          report_name: "Analytics",
          credits_used: 1.234,
        },
      ],
    };

    const result = transformUsageDataForChart(mockData);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      name: expect.stringMatching(/\d{2}-\d{2}-2024 \d{2}:\d{2}/),
      creditsUsed: 2.5,
    });
    expect(result[1]).toMatchObject({
      name: expect.stringMatching(/\d{2}-\d{2}-2024 \d{2}:\d{2}/),
      creditsUsed: 1.23,
    });
  });

  it("returns empty array when usage is empty", () => {
    const mockData: UsageData = { usage: [] };

    const result = transformUsageDataForChart(mockData);

    expect(result).toEqual([]);
  });

  it("returns empty array when usage is undefined", () => {
    const mockData = { usage: undefined } as any;

    const result = transformUsageDataForChart(mockData);

    expect(result).toEqual([]);
  });

  it("rounds credits to 2 decimal places", () => {
    const mockData: UsageData = {
      usage: [
        {
          message_id: 123,
          timestamp: "2024-01-15T10:30:00",
          report_name: "Test",
          credits_used: 1.999,
        },
        {
          message_id: 124,
          timestamp: "2024-01-15T10:30:00",
          report_name: "Test",
          credits_used: 1.111,
        },
      ],
    };

    const result = transformUsageDataForChart(mockData);

    expect(result[0].creditsUsed).toBe(2.0);
    expect(result[1].creditsUsed).toBe(1.11);
  });

  it("handles whole number credits", () => {
    const mockData: UsageData = {
      usage: [
        {
          message_id: 123,
          timestamp: "2024-01-15T10:30:00",
          report_name: "Test",
          credits_used: 5,
        },
      ],
    };

    const result = transformUsageDataForChart(mockData);

    expect(result[0].creditsUsed).toBe(5.0);
  });

  it("handles multiple data points in chronological order", () => {
    const mockData: UsageData = {
      usage: [
        {
          message_id: 123,
          timestamp: "2024-01-15T10:00:00",
          report_name: "Test",
          credits_used: 1.0,
        },
        {
          message_id: 124,
          timestamp: "2024-01-15T11:00:00",
          report_name: "Test",
          credits_used: 2.0,
        },
        {
          message_id: 125,
          timestamp: "2024-01-15T12:00:00",
          report_name: "Test",
          credits_used: 3.0,
        },
      ],
    };

    const result = transformUsageDataForChart(mockData);

    expect(result).toHaveLength(3);
    expect(result[0].creditsUsed).toBe(1.0);
    expect(result[1].creditsUsed).toBe(2.0);
    expect(result[2].creditsUsed).toBe(3.0);
  });
});
