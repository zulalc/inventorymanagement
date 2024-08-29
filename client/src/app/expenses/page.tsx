"use client";

import {
  ExpenseByCategorySummary,
  useGetExpensesByCategoryQuery,
} from "@/state/api";
import Header from "@/app/(components)/Header";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

const COLORS = ["#6c5b9e", "#f5a6b1", "#4db6ac"];
//const COLORS = ["#3498db", "#e67e22", "#2ecc71"];

type ExpenseGroup = {
  category: string;
  amount: number;
  date: string; // Adjust if needed
};

const Expenses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const {
    data: expenses,
    isLoading,
    isError,
  } = useGetExpensesByCategoryQuery();

  const filteredData = expenses
    ? selectedCategory === "All"
      ? expenses
      : expenses.filter(
          (expense: ExpenseByCategorySummary) =>
            expense.category === selectedCategory
        )
    : [];
  console.log(filteredData, "expenses");

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

  // Ensure that each item has a unique `id`
  const rows = filteredData.map((expense) => ({
    id: `${expense.expenseSummaryId}-${expense.date}`, // Use expenseByCategorySummaryId as the ID
    category: expense.category,
    amount: parseFloat(expense.amount), // Convert amount to number if needed
    date: formatDate(expense.date),
  }));

  const chartData = filteredData.reduce<ExpenseGroup[]>((acc, expense) => {
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
  }, []);

  const Categories = expenses
    ? Array.from(new Set(expenses.map((expense) => expense.category)))
    : [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 }, // Use `id` field in columns
    { field: "category", headerName: "Category", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
  ];

  return (
    <div>
      <hr />
      {isLoading ? (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <Header name="Expenses" />
          </div>
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="All">All</option>
              {Categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <PieChart width={500} height={500}>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={180}
                  fill="#00C49F"
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
            </div>
            <div className="flex-2">
              <div className="h-[500px] w-full">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  getRowId={(row) => row.id}
                  className="bg-white shadow rounded-lg border border-gray-00 mt-5 !text-gray-700"
                  sx={{
                    "& .Mui-checked": {
                      color: "#8b5cf6 !important",
                    },
                    "& .MuiCheckbox-indeterminate .MuiSvgIcon-root": {
                      color: "#8b5cf6",
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "#8b5cf6",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default Expenses;
