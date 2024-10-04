import { useGetDashboardDataQuery } from "@/state/api";
import { Rating } from "@mui/material";
import Image from "next/image";
import React from "react";
import { AlertCircle, XCircle } from "react-feather";

const LowStockCard = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetDashboardDataQuery();
  return (
    <div className="row-span-1 bg-white shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
        Low Stock Products
      </h3>
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
          <div className="max-h-[380px] overflow-y-auto">
            {dashboardData?.lowStockProducts.map((product) => (
              <div
                key={product.productId}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 px-4 py-4 border-b last:border-none"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <Image
                      src={`https://s3-inventorym.s3.eu-central-1.amazonaws.com/product${
                        Math.floor(Math.random() * 3) + 1
                      }.jpg`}
                      alt={product.name}
                      width={25}
                      height={25}
                      className="rounded-lg w-14 h-14"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-base text-gray-700">
                      {product.name}
                    </div>
                    <div className="flex text-base items-center">
                      <span className="font-bold text-violet-500 text-s">
                        ${product.price}
                      </span>
                      <span className="mx-2">•</span>
                      <Rating defaultValue={product.rating || 0} readOnly />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {product.stockQuantity === 0 ? (
                    <div className="p-2 rounded-full bg-red-100 text-red-600">
                      <XCircle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                  <span
                    className={`text-lg font-bold ${
                      product.stockQuantity === 0
                        ? "text-red-600"
                        : "text-orange-400"
                    }`}
                  >
                    {product.stockQuantity}
                  </span>
                </div>
              </div>
            ))}
            {isError && <div className="m-5">Failed to fetch data</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default LowStockCard;
