import { useGetDashboardDataQuery } from "@/state/api";
import React from "react";
import { Archive, ShoppingBag, ShoppingCart, User } from "react-feather";

const TotalNumberCard = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetDashboardDataQuery();
  console.log(dashboardData, "data");

  return (
    <div className="bg-white shadow-md sm:shadow-lg md:shadow-xl rounded-2xl p-2 sm:p-3 md:p-4">
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
          <div className="grid grid-cols-4 md:grid-cols-2 gap-5 max-w-full w-full overflow-auto max-h">
            <div
              className={`p-2 md:p-4 rounded-lg shadow-md bg-[#FFCDD2] flex items-start justify-between`}
            >
              <div>
                <h2 className="text-sm md:text-lg font-semibold text-gray-700">
                  Users
                </h2>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {dashboardData?.users?.length ?? "N/A"}
                </p>
              </div>
              <div className="text-2xl md:text-3xl text-[#D32F2F]">
                <User />
              </div>
            </div>
            <div
              className={`p-2 md:p-4 rounded-lg shadow-md bg-[#C8E6C9] flex items-start justify-between`}
            >
              <div>
                <h2 className="text-sm md:text-lg font-semibold text-gray-700">
                  Products
                </h2>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {dashboardData?.popularProducts?.length ?? "N/A"}
                </p>
              </div>
              <div className="text-2xl md:text-3xl text-[#388E3C]">
                <Archive />
              </div>
            </div>

            <div
              className={`p-2 md:p-4 rounded-lg shadow-md bg-[#BBDEFB] flex items-start justify-between`}
            >
              <div>
                <h2 className="text-sm md:text-lg font-semibold text-gray-700">
                  Purchases
                </h2>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {dashboardData?.purchaseSummary?.length ?? "N/A"}
                </p>
              </div>
              <div className="text-2xl md:text-3xl text-[#1976D2]">
                <ShoppingBag />
              </div>
            </div>

            <div
              className={`p-2 md:p-4 rounded-lg shadow-md bg-[#FFF9C4] flex items-start justify-between`}
            >
              <div>
                <h2 className="text-sm md:text-lg font-semibold text-gray-700">
                  Sales
                </h2>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {dashboardData?.salesSummary?.length ?? "N/A"}
                </p>
              </div>
              <div className="text-2xl md:text-3xl text-[#FBC02D]">
                <ShoppingCart />
              </div>
            </div>
          </div>
          {isError && <div className="m-5">Failed to fetch data</div>}
        </>
      )}
    </div>
  );
};

export default TotalNumberCard;
