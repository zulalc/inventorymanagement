"use client";

import { useGetExpensesByCategoryQuery } from "@/state/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6c5b9e", "#f5a6b1", "#4db6ac"];

type ExpenseGroup = {
  category: string;
  amount: number;
  date: string;
};

const ExpensePieChartCard = () => {
  const {
    data: expenses,
    isLoading,
    isError,
  } = useGetExpensesByCategoryQuery();

  const chartData = expenses
    ? expenses.reduce<ExpenseGroup[]>((acc, expense) => {
        const existingCategory = acc.find(
          (item) => item.category === expense.category
        );
        if (existingCategory) {
          existingCategory.amount += parseFloat(expense.amount);
        } else {
          acc.push({
            category: expense.category,
            amount: parseFloat(expense.amount),
            date: expense.date,
          });
        }
        return acc;
      }, [])
    : [];

  return (
    <div className="row-span-1 bg-white shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold mb-2 px-7 pt-5">Expenses Summary</h3>
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
            <div className="mb-4 mt-4 px-4 md:px-7 sm:px-6">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={360} className="p-1">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={chartData}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      fill="#00C49F"
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {isError && <div className="text-red-600 mt-4">Failed to fetch data</div>}
    </div>
  );
};

export default ExpensePieChartCard;
