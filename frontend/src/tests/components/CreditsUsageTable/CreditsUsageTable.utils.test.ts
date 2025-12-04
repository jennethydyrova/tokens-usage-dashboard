import { describe, it, expect, beforeEach } from "vitest";
import {
  buildTableURLParams,
  createTableColumns,
  getTableParamsFromURL,
  transformUsageData,
} from "../../../components/CreditsUsageTable/CreditsUsageTable.utils";
import type { TableDataType, UsageData } from "../../../lib/types";

describe("getTableParamsFromURL", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("returns default values when URL has no params", () => {
    const result = getTableParamsFromURL();

    expect(result).toEqual({
      defaultReportSort: null,
      defaultCreditsSort: null,
      paginationCurrent: 1,
    });
  });

  it("parses valid sort orders from URL", () => {
    window.history.replaceState(
      {},
      "",
      "/?reportName=ascend&creditsUsed=descend"
    );

    const result = getTableParamsFromURL();

    expect(result.defaultReportSort).toBe("ascend");
    expect(result.defaultCreditsSort).toBe("descend");
  });

  it("ignores invalid sort order values", () => {
    window.history.replaceState(
      {},
      "",
      "/?reportName=invalid&creditsUsed=random"
    );

    const result = getTableParamsFromURL();

    expect(result.defaultReportSort).toBe(null);
    expect(result.defaultCreditsSort).toBe(null);
  });

  it("parses valid pagination current page", () => {
    window.history.replaceState({}, "", "/?paginationCurrent=5");

    const result = getTableParamsFromURL();

    expect(result.paginationCurrent).toBe(5);
  });

  it("defaults to page 1 for invalid pagination values", () => {
    const invalidValues = ["0", "-1", "abc", "1.5"];

    invalidValues.forEach((value) => {
      window.history.replaceState({}, "", `/?paginationCurrent=${value}`);
      const result = getTableParamsFromURL();
      expect(result.paginationCurrent).toBe(1);
    });
  });
});

describe("createTableColumns", () => {
  it("creates columns with correct structure", () => {
    const columns = createTableColumns(null, null);

    expect(columns).toHaveLength(4);
    expect(columns[0].title).toBe("Message ID");
    expect(columns[1].title).toBe("Timestamp");
    expect(columns[2].title).toBe("Report Name");
    expect(columns[3].title).toBe("Credits Used");
  });

  it("applies default sort orders when provided", () => {
    const columns = createTableColumns("ascend", "descend");

    expect(columns[2].defaultSortOrder).toBe("ascend");
    expect(columns[3].defaultSortOrder).toBe("descend");
  });

  it("applies null sort orders directly", () => {
    const columns = createTableColumns(null, null);

    expect(columns[2].defaultSortOrder).toBe(null);
    expect(columns[3].defaultSortOrder).toBe(null);
  });

  it("report name sorter handles empty strings", () => {
    const columns = createTableColumns(null, null);
    const sorter = columns[2].sorter as {
      compare: (a: TableDataType, b: TableDataType) => number;
    };

    const mockA: TableDataType = {
      key: "1",
      messageId: 123,
      timestamp: "",
      reportName: "Alpha",
      creditsUsed: "0",
    };
    const mockB: TableDataType = {
      key: "2",
      messageId: 123,
      timestamp: "",
      reportName: "Beta",
      creditsUsed: "0",
    };

    expect(sorter.compare(mockA, mockB)).toBeLessThan(0);
    expect(sorter.compare(mockB, mockA)).toBeGreaterThan(0);
  });

  it("report name sorter handles null values", () => {
    const columns = createTableColumns(null, null);
    const sorter = columns[2].sorter as {
      compare: (a: TableDataType, b: TableDataType) => number;
    };

    const mockA: TableDataType = {
      key: "1",
      messageId: 123,
      timestamp: "",
      reportName: "",
      creditsUsed: "0",
    };
    const mockB: TableDataType = {
      key: "2",
      messageId: 123,
      timestamp: "",
      reportName: "Beta",
      creditsUsed: "0",
    };

    expect(sorter.compare(mockA, mockB)).toBeLessThan(0);
  });

  it("credits used sorter compares numerically", () => {
    const columns = createTableColumns(null, null);
    const sorter = columns[3].sorter as {
      compare: (a: TableDataType, b: TableDataType) => number;
    };

    const mock10: TableDataType = {
      key: "1",
      messageId: 123,
      timestamp: "",
      reportName: "",
      creditsUsed: "10",
    };
    const mock5: TableDataType = {
      key: "2",
      messageId: 123,
      timestamp: "",
      reportName: "",
      creditsUsed: "5",
    };

    expect(sorter.compare(mock10, mock5)).toBeGreaterThan(0);
    expect(sorter.compare(mock5, mock10)).toBeLessThan(0);
    expect(sorter.compare(mock5, mock5)).toBe(0);
  });

  it("credits used sorter handles decimal values", () => {
    const columns = createTableColumns(null, null);
    const sorter = columns[3].sorter as {
      compare: (a: TableDataType, b: TableDataType) => number;
    };

    const mock1: TableDataType = {
      key: "1",
      messageId: 123,
      timestamp: "",
      reportName: "",
      creditsUsed: "1.50",
    };
    const mock2: TableDataType = {
      key: "2",
      messageId: 123,
      timestamp: "",
      reportName: "",
      creditsUsed: "2.25",
    };

    expect(sorter.compare(mock1, mock2)).toBeLessThan(0);
  });
});

describe("transformUsageData", () => {
  it("transforms usage data to table format", () => {
    const mockData: UsageData = {
      usage: [
        {
          message_id: 123,
          timestamp: "2024-01-15T10:30:00Z",
          report_name: "Sales Report",
          credits_used: 2.5,
        },
        {
          message_id: 123,
          timestamp: "2024-01-16T14:20:00Z",
          report_name: undefined,
          credits_used: 1.234,
        },
      ],
    };

    const result = transformUsageData(mockData);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      key: 123,
      messageId: 123,
      reportName: "Sales Report",
      creditsUsed: "2.50",
    });
    expect(result[1].reportName).toBe("");
    expect(result[1].creditsUsed).toBe("1.23");
  });

  it("handles empty usage array", () => {
    const mockData: UsageData = { usage: [] };

    const result = transformUsageData(mockData);

    expect(result).toEqual([]);
  });

  it("formats credits to 2 decimal places", () => {
    const mockData: UsageData = {
      usage: [
        {
          message_id: 123,
          timestamp: "2024-01-15T10:30:00Z",
          report_name: "Test",
          credits_used: 1,
        },
        {
          message_id: 123,
          timestamp: "2024-01-15T10:30:00Z",
          report_name: "Test",
          credits_used: 1.1,
        },
        {
          message_id: 123,
          timestamp: "2024-01-15T10:30:00Z",
          report_name: "Test",
          credits_used: 1.999,
        },
      ],
    };

    const result = transformUsageData(mockData);

    expect(result[0].creditsUsed).toBe("1.00");
    expect(result[1].creditsUsed).toBe("1.10");
    expect(result[2].creditsUsed).toBe("2.00");
  });
});

describe("buildTableURLParams", () => {
  it("builds params with single sort order", () => {
    const params = buildTableURLParams(
      { current: 1 },
      { field: "reportName", order: "ascend" }
    );

    expect(params.toString()).toBe("reportName=ascend&paginationCurrent=1");
  });

  it("builds params with multiple sort orders", () => {
    const params = buildTableURLParams({ current: 2 }, [
      { field: "reportName", order: "ascend" },
      { field: "creditsUsed", order: "descend" },
    ]);

    expect(params.get("reportName")).toBe("ascend");
    expect(params.get("creditsUsed")).toBe("descend");
    expect(params.get("paginationCurrent")).toBe("2");
  });

  it("ignores sorters without field or order", () => {
    const params = buildTableURLParams({ current: 1 }, [
      { field: "reportName", order: "ascend" },
      { field: undefined, order: "descend" },
      { field: "creditsUsed", order: null },
    ]);

    expect(params.get("reportName")).toBe("ascend");
    expect(params.has("creditsUsed")).toBe(false);
  });

  it("handles empty sorter array", () => {
    const params = buildTableURLParams({ current: 3 }, []);

    expect(params.toString()).toBe("paginationCurrent=3");
  });
});
