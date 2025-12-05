import type { TableColumnsType } from "antd";
import type { TableDataType, UsageData } from "../../lib/types";
import { formatISO } from "../../lib/formatters/date";
import type { SorterResult } from "antd/es/table/interface";

type SortOrder = "ascend" | "descend" | null;

type TableParams = {
  defaultReportSort: SortOrder;
  defaultCreditsSort: SortOrder;
  paginationCurrent: number;
};

const toSortOrder = (value: string | null): SortOrder => {
  if (value === "ascend" || value === "descend") return value;
  return null;
};

/**
 * Alphabetically compares report names, treating null/undefined as empty strings
 */
const compareReportName = (a: TableDataType, b: TableDataType) =>
  (a.reportName ?? "").localeCompare(b.reportName ?? "");

/**
 * Numerically compares credit values for sorting
 */
const compareCreditsUsed = (a: TableDataType, b: TableDataType) =>
  Number(a.creditsUsed) - Number(b.creditsUsed);

/**
 * Reads table sort orders and current page from the URL query string.
 * Called once on component mount to initialize table state from URL.
 */
export const getTableParamsFromURL = (): TableParams => {
  const params = new URLSearchParams(window.location.search);

  const paginationParam = Number(params.get("paginationCurrent"));
  const paginationCurrent =
    Number.isInteger(paginationParam) && paginationParam > 0
      ? paginationParam
      : 1;

  return {
    defaultReportSort: toSortOrder(params.get("reportName")),
    defaultCreditsSort: toSortOrder(params.get("creditsUsed")),
    paginationCurrent,
  };
};

/**
 * Creates table column definitions with optional default sort orders.
 * Columns include Message ID, Timestamp, Report Name (sortable), and Credits Used (sortable).
 */
export const createTableColumns = (
  defaultReportSort: SortOrder | null,
  defaultCreditsSort: SortOrder | null
): TableColumnsType<TableDataType> => {
  return [
    { title: "Message ID", dataIndex: "messageId", key: "messageId" },
    { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
    {
      title: "Report Name",
      dataIndex: "reportName",
      key: "reportName",
      sorter: {
        compare: compareReportName,
        multiple: 2,
      },
      defaultSortOrder: defaultReportSort,
    },
    {
      title: "Credits Used",
      dataIndex: "creditsUsed",
      key: "creditsUsed",
      sorter: {
        compare: compareCreditsUsed,
        // Credits Used column will take precedence while sorting two columns.
        multiple: 1,
      },
      defaultSortOrder: defaultCreditsSort,
    },
  ];
};

/**
 * Transforms raw usage data from the API into table-ready format.
 * Formats timestamps to ISO strings and credits to 2 decimal places.
 */
export const transformUsageData = (usageData: UsageData): TableDataType[] => {
  return usageData.usage.map((d) => ({
    key: d.message_id,
    messageId: d.message_id,
    timestamp: formatISO(d.timestamp),
    reportName: d.report_name ?? "",
    creditsUsed: d.credits_used.toFixed(2),
  }));
};

/**
 * Builds URL search parameters from table state (sorting and pagination).
 * Used to sync table state with the browser URL for shareable links.
 */
export const buildTableURLParams = (
  pagination: { current?: number },
  sorter: SorterResult<TableDataType> | SorterResult<TableDataType>[]
): URLSearchParams => {
  const sorts = Array.isArray(sorter) ? sorter : [sorter];
  const params = new URLSearchParams();

  sorts.forEach((s) => {
    if (s?.field && s.order != null) {
      params.set(String(s.field), s.order);
    }
  });

  params.set("paginationCurrent", String(pagination.current));

  return params;
};
