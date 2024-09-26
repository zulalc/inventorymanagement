import { useGetDashboardDataQuery } from "@/state/api";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const IncomeExpenseCard = () => {
  const { data, isLoading, isError } = useGetDashboardDataQuery();
  const salesData = data?.salesSummary || [];
  const expensesData = data?.expenseSummary || [];

  const combinedData = salesData.map((item) => {
    const expense = expensesData.find((exp) => exp.date === item.date);

    return {
      date: item.date,
      sales: item.totalValue,
      expenses: expense ? expense.totalExpenses : 0,
    };
  });
  return (
    <div className="flex flex-col row-auto xl:row-auto md:col-auto xl:col-auto bg-white shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold px-7 pt-5 mb-2">Sales & Expenses</h3>
      <hr />
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 mt-7 px-7">
            <p className="text-sm text-gray-400">Sales vs Expenses</p>
            <ResponsiveContainer width="100%" height={450} className="p-2">
              <LineChart
                data={combinedData}
                margin={{ top: 20, right: 0, left: -35, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-US")
                  }
                />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString("en")}`]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default IncomeExpenseCard;
