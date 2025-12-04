import type { FC } from "react";
import { CreditUsageTable } from "../components/CreditsUsageTable/CreditsUsageTable";

const mock_data = {
  usage: [
    {
      message_id: 1001,
      timestamp: "2025-12-01T08:12:34Z",
      report_name: "Monthly Sales Report",
      credits_used: 15.4332,
    },
    { message_id: 1002, timestamp: "2025-12-01T09:45:10Z", credits_used: 5 },
    {
      message_id: 1003,
      timestamp: "2025-12-02T14:22:05Z",
      report_name: "User Activity Report",
      credits_used: 12.1,
    },
    { message_id: 1004, timestamp: "2025-12-02T16:10:45Z", credits_used: 7 },
    {
      message_id: 1005,
      timestamp: "2025-12-03T10:05:20Z",
      report_name: "Financial Summary Q4",
      credits_used: 20,
    },
    { message_id: 1006, timestamp: "2025-12-03T11:18:55Z", credits_used: 8 },
    {
      message_id: 1007,
      timestamp: "2025-12-03T13:45:01Z",
      report_name: "Inventory Report",
      credits_used: 18,
    },
    { message_id: 1008, timestamp: "2025-12-03T15:30:22Z", credits_used: 4 },
    {
      message_id: 1009,
      timestamp: "2025-12-04T09:12:12Z",
      report_name: "Customer Feedback",
      credits_used: 10,
    },
    { message_id: 1010, timestamp: "2025-12-04T11:40:50Z", credits_used: 6 },
    {
      message_id: 1011,
      timestamp: "2025-12-04T14:25:33Z",
      report_name: "Marketing Insights",
      credits_used: 14,
    },
    { message_id: 1012, timestamp: "2025-12-04T16:50:11Z", credits_used: 7 },
    {
      message_id: 1013,
      timestamp: "2025-12-05T08:05:47Z",
      report_name: "Quarterly Review",
      credits_used: 20,
    },
    { message_id: 1014, timestamp: "2025-12-05T09:33:29Z", credits_used: 5 },
    {
      message_id: 1015,
      timestamp: "2025-12-05T12:12:03Z",
      report_name: "Weekly Metrics",
      credits_used: 12,
    },
    { message_id: 1016, timestamp: "2025-12-05T14:47:18Z", credits_used: 9 },
    {
      message_id: 1017,
      timestamp: "2025-12-06T10:10:10Z",
      report_name: "Sales Forecast",
      credits_used: 17,
    },
    { message_id: 1018, timestamp: "2025-12-06T11:25:30Z", credits_used: 6 },
    {
      message_id: 1019,
      timestamp: "2025-12-06T13:40:50Z",
      report_name: "Employee Productivity",
      credits_used: 11,
    },
    { message_id: 1020, timestamp: "2025-12-06T15:55:22Z", credits_used: 8 },
    {
      message_id: 1021,
      timestamp: "2025-12-07T08:22:44Z",
      report_name: "Annual Summary",
      credits_used: 22,
    },
    { message_id: 1022, timestamp: "2025-12-07T09:33:56Z", credits_used: 7 },
    {
      message_id: 1023,
      timestamp: "2025-12-07T11:45:12Z",
      report_name: "Website Analytics",
      credits_used: 13,
    },
    { message_id: 1024, timestamp: "2025-12-07T13:50:05Z", credits_used: 6 },
    {
      message_id: 1025,
      timestamp: "2025-12-08T10:15:33Z",
      report_name: "Client Engagement",
      credits_used: 16,
    },
    { message_id: 1026, timestamp: "2025-12-08T12:20:44Z", credits_used: 5 },
    {
      message_id: 1027,
      timestamp: "2025-12-08T14:35:12Z",
      report_name: "Expense Report",
      credits_used: 14,
    },
  ],
};

export const DashboardView: FC = () => {
  return (
    <div className="flex flex-col px-4 sm:px-10 md:px-20 lg:px-32 xl:px-60">
      <>
        <CreditUsageTable usageData={mock_data} />
      </>
    </div>
  );
};
