import {
  ExpenseByCategorySummary,
  useGetDashboardDataQuery,
} from "@/state/api";
import { TrendingUp } from "react-feather";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type ExpenseSums = {
  [category: string]: number;
};
const colors = ["#00C49F", "#0088FE", "#FFBB28"];
const ExpenseSummaryCard = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetDashboardDataQuery();
  const expenseSummary = dashboardData?.expenseSummary[0];

  const expenseByCategorySummary =
    dashboardData?.expenseByCategorySummary || [];

  const expenseSums = expenseByCategorySummary.reduce(
    (accumulator: ExpenseSums, item: ExpenseByCategorySummary) => {
      const category = item.category + " Expenses";
      const amount = parseInt(item.amount, 10);
      if (!accumulator[category]) accumulator[category] = 0;
      accumulator[category] += amount;
      return accumulator;
    },
    {}
  );

  const expenseCategories = Object.entries(expenseSums).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const totalExpenses = expenseCategories.reduce(
    (acc, category: { value: number }) => acc + category.value,
    0
  );
  const formattedTotalExpenses = totalExpenses.toFixed(2);
  return (
    <div className="row-span-2 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      <h3 className="text-lg font-semibold px-7 pt-5 pb-2">Expense Summary</h3>
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
          <div className="xl:flex justify-between pr-7">
            <div className="relative basis-3/5">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    innerRadius={50}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
                <span className="font-bold text-xl">
                  ${formattedTotalExpenses}
                </span>
              </div>
            </div>

            <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
              {expenseCategories.map((entry, index) => (
                <li
                  key={`legend-${index}`}
                  className="flex items-center text-xs"
                >
                  <span
                    className="mr-2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></span>
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <hr />
            {expenseSummary && (
              <div className="mt-3 flex justify-between items-center px-7 mb-4">
                <div className="pt-2">
                  <p className="text-sm">
                    Average:{" "}
                    <span className="font-semibold">
                      ${(expenseSummary.totalExpenses / 1000000).toFixed(1)}
                    </span>
                  </p>
                </div>
                <span className="flex items-center mt-2">
                  <TrendingUp className="mr-2 text-green-500" />
                  30%
                </span>
              </div>
            )}
          </div>
          {isError && <div className="m-5">Failed to fetch data</div>}
        </>
      )}
    </div>
  );
};

export default ExpenseSummaryCard;
