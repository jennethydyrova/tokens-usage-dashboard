import type { FC } from "react";
import { CreditUsageTable } from "../components/CreditsUsageTable/CreditsUsageTable";
import { CreditUsageChart } from "../components/CreditsUsageChart.tsx/CreditsUsageChart";
import { useFetch } from "../hooks/useFetch";
import { Spinner } from "../components/Spinner";
import { Alert } from "antd";

export const DashboardView: FC = () => {
  const { data, isPending, error } = useFetch("http://localhost:8000/usage");

  // Show spinner while loading
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  // Show error if request failed
  if (error) {
    return (
      <div className="flex flex-col px-4 sm:px-10 md:px-20 lg:px-32 xl:px-60 py-8">
        <Alert title="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  // Show "No Data" only after loading is complete and data is null
  if (!data) {
    return (
      <div className="flex flex-col px-4 sm:px-10 md:px-20 lg:px-32 xl:px-60 py-8">
        <Alert
          title="No Data"
          description="No usage data available"
          type="info"
          showIcon
        />
      </div>
    );
  }

  // Show the actual data
  return (
    <div className="flex flex-col px-4 sm:px-10 md:px-20 lg:px-32 xl:px-60">
      <CreditUsageChart usageData={data} />
      <CreditUsageTable usageData={data} />
    </div>
  );
};
