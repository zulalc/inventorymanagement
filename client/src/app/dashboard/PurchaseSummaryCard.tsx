import { useGetDashboardDataQuery } from "@/state/api";
import numeral from "numeral";
import React from "react";
import { TrendingDown, TrendingUp } from "react-feather";
import {
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

const PurchaseSummaryCard = () => {
  const { data, isLoading, isError } = useGetDashboardDataQuery();
  const purchaseData = data?.purchaseSummary || [];
  const dataEndPoint = purchaseData[purchaseData.length - 1] || null;

  const highestTotalValue = purchaseData.reduce((accumulator, current) => {
    return accumulator.totalPurchased > current.totalPurchased
      ? accumulator
      : current;
  }, purchaseData[0] || {});

  const highestValueDate = highestTotalValue.date
    ? new Date(highestTotalValue.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      })
    : "N/A";
  return (
    <div className="row-span-1 bg-white shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold mb-2 px-7 pt-5">Purchase Summary</h3>
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
          <div>
            <div className="mb-4 mt-7 px-7">
              <p className="text-xs text-gray-400">Purchased</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">
                  {dataEndPoint
                    ? numeral(dataEndPoint.totalPurchased).format("$0.00a")
                    : "0"}
                </p>
              </div>
              {dataEndPoint && (
                <p
                  className={`text-sm ${
                    dataEndPoint.changePercentage! >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  } flex ml-3`}
                >
                  {dataEndPoint.changePercentage! >= 0 ? (
                    <TrendingUp className="w-6 h-6 mr-2" stroke="green" />
                  ) : (
                    <TrendingDown className="w-6 h-6 mr-2" stroke="red" />
                  )}
                  {Math.abs(dataEndPoint.changePercentage!)}%
                </p>
              )}
            </div>
            <ResponsiveContainer width="100%" height={300} className="p-3">
              <AreaChart
                data={purchaseData}
                margin={{ top: 0, right: 0, left: -30, bottom: 45 }}
              >
                <XAxis
                  dataKey="date"
                  tick={true}
                  axisLine={false}
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-US")
                  }
                />
                <YAxis
                  dataKey="totalPurchased"
                  tickLine={true}
                  tick={true}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString("en")}`]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
                <Area
                  type="linear"
                  dataKey="totalPurchased"
                  stroke="#5C7AF6"
                  fill="#8BA6FA"
                  dot={true}
                />
              </AreaChart>
            </ResponsiveContainer>

            <hr />
            <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
              <p className="text-sm">
                Highest Purchase Date:{" "}
                <span className="font-bold">{highestValueDate}</span>
              </p>
            </div>
          </div>
        </>
      )}

      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default PurchaseSummaryCard;
