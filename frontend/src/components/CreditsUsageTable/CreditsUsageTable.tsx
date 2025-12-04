import { Table, type TableProps } from "antd";
import { type FC } from "react";
import type { TableDataType, UsageData } from "../../lib/types";
import { CopyURLButton } from "./CopyURLButton";
import {
  buildTableURLParams,
  createTableColumns,
  getTableParamsFromURL,
  transformUsageData,
} from "./CreditsUsageTable.utils";

interface CreditUsageTableProps {
  usageData: UsageData;
}

export const CreditUsageTable: FC<CreditUsageTableProps> = ({ usageData }) => {
  const { defaultReportSort, defaultCreditsSort, paginationCurrent } =
    getTableParamsFromURL();

  const handleTableChange: TableProps<TableDataType>["onChange"] = (
    pagination,
    _,
    sorter
  ) => {
    const params = buildTableURLParams(pagination, sorter);
    // Update URL without triggering navigation or page reload
    window.history.replaceState({}, "", `?${params.toString()}`);
  };

  return (
    <div className="flex flex-col p-2 sm:p-0">
      <div className="pb-2 self-end">
        <CopyURLButton />
      </div>
      <Table
        dataSource={transformUsageData(usageData)}
        columns={createTableColumns(defaultReportSort, defaultCreditsSort)}
        onChange={handleTableChange}
        pagination={{ defaultCurrent: paginationCurrent, responsive: true }}
        size="small"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
