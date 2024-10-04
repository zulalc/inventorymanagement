import { useGetDashboardDataQuery } from "@/state/api";
import React from "react";
import {
  Archive,
  ExternalLink,
  ShoppingBag,
  ShoppingCart,
  User,
} from "react-feather";
import Link from "next/link";

const TotalNumberCard = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetDashboardDataQuery();

  const h2 = "text-sm md:text-lg font-semibold text-gray-700";

  return (
    <div className="bg-white shadow-md sm:shadow-md md:shadow-md rounded-2xl p-2 sm:p-3 md:p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-full w-full overflow-auto max-h-full">
            {/* Users Card */}
            <Link
              href="/users"
              className="p-2 md:p-4 rounded-lg shadow-md bg-[#FFCDD2] flex items-start justify-between text-decoration-none hover:bg-[#EF9A9A] active:bg-[#E57373] transition-all duration-200 ease-in-out cursor-pointer"
            >
              <div>
                <h2 className={h2}>Users</h2>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {dashboardData?.users?.length ?? "N/A"}
                </p>
              </div>
              <div className="text-2xl md:text-3xl text-[#D32F2F]">
                <User />
                <ExternalLink className="mt-4 ml-1 w-5 h-5" />
              </div>
            </Link>

            {/* Products Card */}
            <Link
              href="/products"
              className="p-2 md:p-4 rounded-lg shadow-md bg-[#C8E6C9] flex items-start justify-between text-decoration-none hover:bg-[#A5D6A7] active:bg-[#81C784] transition-all duration-200 ease-in-out cursor-pointer"
            >
              <div>
                <h2 className={h2}>Products</h2>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {dashboardData?.productDetails?.length ?? "N/A"}
                </p>
              </div>
              <div className="text-2xl md:text-3xl text-[#388E3C]">
                <Archive />
                <ExternalLink className="mt-4 ml-1 w-5 h-5" />
              </div>
            </Link>

            {/* Purchases Card */}
            <Link
              href="/analytics"
              className="p-2 md:p-4 rounded-lg shadow-md bg-[#BBDEFB] flex items-start justify-between text-decoration-none hover:bg-[#90CAF9] active:bg-[#64B5F6] transition-all duration-200 ease-in-out cursor-pointer"
            >
              <div>
                <h2 className={h2}>Purchases</h2>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {dashboardData?.purchaseSummary?.length ?? "N/A"}
                </p>
              </div>
              <div className="text-2xl md:text-3xl text-[#1976D2]">
                <ShoppingBag />
                <ExternalLink className="mt-4 ml-1 w-5 h-5" />
              </div>
            </Link>

            {/* Sales Card */}
            <Link
              href="/analytics"
              className="p-2 md:p-4 rounded-lg shadow-md bg-[#FFF9C4] flex items-start justify-between text-decoration-none hover:bg-[#FFF59D] active:bg-[#FFF176] transition-all duration-200 ease-in-out cursor-pointer"
            >
              <div>
                <h2 className={h2}>Sales</h2>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {dashboardData?.salesSummary?.length ?? "N/A"}
                </p>
              </div>
              <div className="text-2xl md:text-3xl text-[#FBC02D]">
                <ShoppingCart />
                <ExternalLink className="mt-4 ml-1 w-5 h-5" />
              </div>
            </Link>
          </div>

          {isError && <div className="m-5">Failed to fetch data</div>}
        </>
      )}
    </div>
  );
};

export default TotalNumberCard;
