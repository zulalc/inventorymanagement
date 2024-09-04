"use client";

import ExpenseSummaryCard from "./ExpenseSummaryCard";
import IncomeExpenseCard from "./IncomeExpenseCard";
import PopularProductsCard from "./PopularProductsCard";
import PurchaseSummaryCard from "./PurchaseSummaryCard";
import SalesSummaryCard from "./SalesSummaryCard";
import TotalNumberCard from "./TotalNumberCard";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <PopularProductsCard />
      <TotalNumberCard />
      <div className="grid grid-cols-subgrid gap-4 col-span-1 sm:hidden md:hidden lg:grid" />
      <IncomeExpenseCard />
      <PurchaseSummaryCard />
      <SalesSummaryCard />
      <ExpenseSummaryCard />
    </div>
  );
};

export default Dashboard;
