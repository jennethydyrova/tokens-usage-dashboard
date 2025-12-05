import { formatISO } from "../../lib/formatters/date";
import type { UsageData } from "../../lib/types";

interface ChartDataPoint {
  name: string;
  creditsUsed: number;
}

/**
 * Transforms usage data into chart-ready format with formatted timestamps.
 */
export const transformUsageDataForChart = (
  usageData: UsageData
): ChartDataPoint[] => {
  if (!usageData.usage || usageData.usage.length === 0) {
    return [];
  }

  return usageData.usage.map((u) => ({
    name: formatISO(u.timestamp),
    creditsUsed: parseFloat(u.credits_used.toFixed(2)),
  }));
};
