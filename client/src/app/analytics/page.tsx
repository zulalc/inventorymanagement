"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useGetAnalyticsDataQuery } from "@/state/api";

const COLORS = ["#6c5b9e", "#f5a6b1", "#4db6ac", "#ffbb28"];

type ExpenseGroup = {
  id: number;
  category: string;
  amount: number;
  date: string;
};

const Analytics = () => {
  const [expenseStartDate, setExpenseStartDate] = useState<Date | null>(null);
  const [expenseEndDate, setExpenseEndDate] = useState<Date | null>(null);

  const [salesStartDate, setSalesStartDate] = useState<Date | null>(null);
  const [salesEndDate, setSalesEndDate] = useState<Date | null>(null);

  const [purchaseStartDate, setPurchaseStartDate] = useState<Date | null>(null);
  const [purchaseEndDate, setPurchaseEndDate] = useState<Date | null>(null);
  const {
    data: analyticsData,
    isLoading,
    isError,
  } = useGetAnalyticsDataQuery();

  const filterByDateRange = (
    data: any[],
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (!startDate || !endDate) return data;
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  let idCounter = 0;

  const chartData = analyticsData
    ? filterByDateRange(
        analyticsData.expenseByCategorySummary.reduce<ExpenseGroup[]>(
          (acc, expense) => {
            const existingCategory = acc.find(
              (item) => item.category === expense.category
            );
            if (existingCategory) {
              existingCategory.amount += parseFloat(expense.amount);
            } else {
              acc.push({
                id: idCounter++,
                category: expense.category,
                amount: parseFloat(expense.amount),
                date: expense.date,
              });
            }
            return acc;
          },
          []
        ),
        expenseStartDate,
        expenseEndDate
      )
    : [];

  const rowData = analyticsData
    ? filterByDateRange(
        analyticsData.expenseByCategorySummary.map((expense) => ({
          id: idCounter++,
          category: expense.category,
          amount: parseFloat(expense.amount),
          date: expense.date,
        })),
        expenseStartDate,
        expenseEndDate
      )
    : [];

  const salesData = filterByDateRange(
    analyticsData?.salesSummary || [],
    salesStartDate,
    salesEndDate
  );
  const purchaseData = filterByDateRange(
    analyticsData?.purchaseSummary || [],
    purchaseStartDate,
    purchaseEndDate
  );

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const expenseColumns: GridColDef[] = [
    { field: "category", headerName: "Category", width: 150 },
    { field: "amount", headerName: "Amount", width: 120, type: "number" },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueFormatter: (params) => {
        if (!params) {
          return "No Date";
        }
        const dateValue = new Date(params);
        return isNaN(dateValue.getTime())
          ? "Invalid Date"
          : dateFormatter.format(dateValue);
      },
    },
  ];

  const salesColumns: GridColDef[] = [
    { field: "salesSummaryId", headerName: "Sales Summary ID", width: 150 },

    {
      field: "totalValue",
      headerName: "Total Value",
      width: 150,
      type: "number",
    },
    {
      field: "changePercentage",
      headerName: "Change Percentage",
      width: 120,
      type: "number",
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueFormatter: (params) => {
        if (!params) {
          return "No Date";
        }

        const dateValue = new Date(params);
        return isNaN(dateValue.getTime())
          ? "Invalid Date"
          : dateFormatter.format(dateValue);
      },
    },
  ];

  const purchaseColumns: GridColDef[] = [
    {
      field: "purchaseSummaryId",
      headerName: "Purchase Summary ID",
      width: 150,
    },

    {
      field: "totalPurchased",
      headerName: "Total Purchased",
      width: 150,
      type: "number",
    },
    {
      field: "changePercentage",
      headerName: "Change Percentage",
      width: 120,
      type: "number",
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueFormatter: (params) => {
        if (!params) {
          return "No Date";
        }

        const dateValue = new Date(params);
        return isNaN(dateValue.getTime())
          ? "Invalid Date"
          : dateFormatter.format(dateValue);
      },
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Expenses Pie Chart */}
        <div className="row-span-1 bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Expense Summary</h3>

          <DatePicker
            showIcon
            isClearable
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            selected={expenseStartDate || undefined}
            onChange={(date) => setExpenseStartDate(date)}
            placeholderText="Start Date"
            selectsStart
            startDate={expenseStartDate || undefined}
            endDate={expenseEndDate || undefined}
          />
          <DatePicker
            showIcon
            isClearable
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            selected={expenseEndDate || undefined}
            onChange={(date) => setExpenseEndDate(date)}
            placeholderText="End Date"
            selectsEnd
            startDate={expenseStartDate || undefined}
            endDate={expenseEndDate || undefined}
            minDate={expenseStartDate || undefined}
          />
          {isLoading ? (
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]">
              <span className="sr-only">Loading...</span>
            </div>
          ) : isError ? (
            <div className="text-red-600 mt-4">Failed to fetch data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    fill="#00C49F"
                    label
                  >
                    {chartData?.map((entry, index) => (
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

              <div className="mt-6" style={{ height: 400, overflowY: "auto" }}>
                <DataGrid
                  rows={rowData}
                  columns={expenseColumns}
                  getRowId={(row) => row.id}
                  pagination
                  style={{ maxHeight: 400 }}
                />
              </div>
            </>
          )}
        </div>

        {/* Sales Bar Chart */}
        <div className="row-span-1 bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Summary</h3>
          <DatePicker
            showIcon
            isClearable
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            selected={salesStartDate || undefined}
            onChange={(date) => setSalesStartDate(date)}
            placeholderText="Start Date"
            selectsStart
            startDate={salesStartDate || undefined}
            endDate={salesEndDate || undefined}
          />
          <DatePicker
            showIcon
            isClearable
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            selected={salesEndDate || undefined}
            onChange={(date) => setSalesEndDate(date)}
            placeholderText="End Date"
            selectsEnd
            startDate={salesStartDate || undefined}
            endDate={salesEndDate || undefined}
            minDate={salesStartDate || undefined}
          />

          {isLoading ? (
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]">
              <span className="sr-only">Loading...</span>
            </div>
          ) : isError ? (
            <div className="text-red-600 mt-4">Failed to fetch data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={360} className="mt-5">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
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
                  <Legend />
                  <Bar dataKey="totalValue" fill="#6c5b9e" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6" style={{ height: 400, overflowY: "auto" }}>
                <DataGrid
                  rows={salesData}
                  columns={salesColumns}
                  getRowId={(row) => row.salesSummaryId}
                  pagination
                  style={{ maxHeight: 400 }}
                />
              </div>
            </>
          )}
        </div>

        {/* Purchases Bar Chart */}
        <div className="row-span-1 bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>
          <DatePicker
            showIcon
            isClearable
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            selected={purchaseStartDate || undefined}
            onChange={(date) => setPurchaseStartDate(date)}
            placeholderText="Start Date"
            selectsStart
            startDate={purchaseStartDate || undefined}
            endDate={purchaseEndDate || undefined}
          />
          <DatePicker
            showIcon
            isClearable
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            selected={purchaseEndDate || undefined}
            onChange={(date) => setPurchaseEndDate(date)}
            placeholderText="End Date"
            selectsEnd
            startDate={purchaseStartDate || undefined}
            endDate={purchaseEndDate || undefined}
            minDate={purchaseStartDate || undefined}
          />
          {isLoading ? (
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]">
              <span className="sr-only">Loading...</span>
            </div>
          ) : isError ? (
            <div className="text-red-600 mt-4">Failed to fetch data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={360} className="mt-5">
                <BarChart data={purchaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
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
                  <Legend />
                  <Bar dataKey="totalPurchased" fill="#f5a6b1" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6" style={{ height: 400, overflowY: "auto" }}>
                <DataGrid
                  rows={purchaseData}
                  columns={purchaseColumns}
                  getRowId={(row) => row.purchaseSummaryId}
                  pagination
                  style={{ maxHeight: 400 }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
