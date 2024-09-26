"use client";

import ExpenseSummaryCard from "./ExpenseSummaryCard";
import SalesExpenseCard from "./SalesExpenseCard";
import PopularProductsCard from "./PopularProductsCard";
import PurchaseSummaryCard from "./PurchaseSummaryCard";
import SalesSummaryCard from "./SalesSummaryCard";
import TotalNumberCard from "./TotalNumberCard";
import LowStockCard from "./LowStockCard";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <PopularProductsCard />
      <TotalNumberCard />
      <LowStockCard />
      <SalesSummaryCard />
      <PurchaseSummaryCard />
      <SalesExpenseCard />
      <ExpenseSummaryCard />
    </div>
  );
};

export default Dashboard;
