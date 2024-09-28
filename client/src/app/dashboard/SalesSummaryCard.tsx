import { SalesSummary, useGetDashboardTimelyDataQuery } from "@/state/api";
import React, { useState, useMemo } from "react";
import { TrendingDown, TrendingUp } from "react-feather";
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const SalesSummaryCard = () => {
  // Explicitly type the `time` state variable
  const [time, setTime] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Pass time parameter to query
  const { data, isLoading, isError } = useGetDashboardTimelyDataQuery(time);
  const salesData = data?.salesSummary || [];

  // Function to group data by selected period
  const groupByPeriod = (
    data: SalesSummary[],
    period: "daily" | "weekly" | "monthly"
  ) => {
    const result: { date: string; totalValue: number }[] = [];
    const resultMap: Record<string, number> = {};

    data.forEach((item) => {
      const date = new Date(item.date);
      let key: string;

      switch (period) {
        case "daily":
          key = date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
          break;
        case "weekly":
          const startOfWeek = new Date(
            date.setDate(date.getDate() - date.getDay())
          ); // Start of the week
          key = `${startOfWeek.getFullYear()}-${
            startOfWeek.getMonth() + 1
          }-${startOfWeek.getDate()}`;
          break;
        case "monthly":
          key = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format as 'YYYY-MM'
          break;
        default:
          throw new Error("Invalid period");
      }

      if (!resultMap[key]) {
        resultMap[key] = 0;
      }
      resultMap[key] += item.totalValue;
    });

    for (const [date, totalValue] of Object.entries(resultMap)) {
      result.push({ date, totalValue });
    }

    return result;
  };

  // Memoize processed data to prevent unnecessary recalculations
  const processedData = useMemo(
    () => groupByPeriod(salesData, time),
    [salesData, time]
  );

  const sumTotalValue =
    processedData.reduce(
      (accumulator, current) => accumulator + current.totalValue,
      0
    ) || 0;

  const getAverageChangePerc =
    salesData.reduce((accumulator, current, _, array) => {
      return accumulator + (current.changePercentage || 0) / array.length;
    }, 0) || 0;

  const highestTotalValue = processedData.reduce((accumulator, current) => {
    return accumulator.totalValue > current.totalValue ? accumulator : current;
  }, processedData[0] || {});

  const highestValueDate = highestTotalValue.date
    ? new Date(highestTotalValue.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      })
    : "N/A";

  return (
    <div className="row-span-1 bg-white shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold mb-2 px-7 pt-5">Sales Summary</h3>
      <hr />
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-7 mt-5 mb-6">
            <div className="text-lg font-medium">
              <p className="text-sm text-gray-400"> Value</p>
              <span className="text-2xl font-extrabold">
                $
                {(sumTotalValue / 1000000).toLocaleString("en", {
                  maximumFractionDigits: 2,
                })}
              </span>
              {getAverageChangePerc && (
                <p
                  className={`text-sm ${
                    getAverageChangePerc! >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  } flex ml-3`}
                >
                  {getAverageChangePerc! >= 0 ? (
                    <TrendingUp className="w-6 h-6 mr-2" stroke="green" />
                  ) : (
                    <TrendingDown className="w-6 h-6 mr-2" stroke="red" />
                  )}
                  {getAverageChangePerc.toFixed(2)}%
                </p>
              )}
            </div>
            <select
              className="shadow-sm border border-gray-300 bg-white p-2 rounded"
              value={time}
              onChange={(e) =>
                setTime(e.target.value as "daily" | "weekly" | "monthly")
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={350} className="px-7">
            <BarChart
              data={processedData}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-US")
                }
              />
              <YAxis
                tickLine={false}
                tick={{ fontSize: 12, dx: -1 }}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString("en")}`,
                ]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                }}
              />
              <Bar
                dataKey="totalValue"
                fill="#7AACDF"
                barSize={10}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <hr />
          <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
            <p>
              {processedData.length || 0}{" "}
              {time === "daily"
                ? "days"
                : time === "weekly"
                ? "weeks"
                : "months"}
            </p>
            <p className="text-sm">
              Highest Sales Date:{" "}
              <span className="font-bold">{highestValueDate}</span>
            </p>
          </div>
        </>
      )}
      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default SalesSummaryCard;
