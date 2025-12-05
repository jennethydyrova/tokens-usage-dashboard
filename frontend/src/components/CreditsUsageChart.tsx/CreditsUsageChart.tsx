import { type FC } from "react";
import type { UsageData } from "../../lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { transformUsageDataForChart } from "./CreditsUsageChart.utils";

interface CreditUsageChartProps {
  usageData: UsageData;
}

export const CreditUsageChart: FC<CreditUsageChartProps> = ({ usageData }) => {
  return (
    <div className="p-4 ">
      <BarChart
        data={transformUsageDataForChart(usageData)}
        style={{
          width: "100%",
          aspectRatio: 4,
          minHeight: "40vh",
        }}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        responsive
      >
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis
          dataKey="name"
          // TODO: Extract magic numbers to named constants for better readability
          // (e.g., LARGE_DATASET_THRESHOLD = 50, INTERVAL_SPARSE = 10, INTERVAL_DENSE = 3)
          interval={usageData.usage.length > 50 ? 10 : 3}
          // TODO: Extract font size to a named constant or theme variable
          fontSize={"8px"}
          tick={{ className: "hidden lg:block" }}
        ></XAxis>
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Bar
          name="Credits Used"
          dataKey="creditsUsed"
          fill="#8884d8"
          label={{
            position: "top",
            className: "hidden sm:block",
            fontSize: "8px",
          }}
        />
      </BarChart>
    </div>
  );
};
