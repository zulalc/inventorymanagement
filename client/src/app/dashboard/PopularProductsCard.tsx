import { useGetDashboardDataQuery } from "@/state/api";
import { Rating } from "@mui/material";
import React from "react";
import { ShoppingBag } from "react-feather";

const PopularProductsCard = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetDashboardDataQuery();
  console.log(dashboardData);
  return (
    <div className="row-span-2 xl:row-span-2 bg-white shadow-md rounded-2xl pb-16">
      <h3 className="text-lg font-semibold px-7 pt-5 pb-2">Best Sellers</h3>
      <hr />
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
          <span className="ml-2 text-violet-500">Loading...</span>
        </div>
      ) : (
        <>
          <div className="overflow-auto h-full">
            {dashboardData?.productDetails.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between gap-3 px-5 py-5 border-b last:border-none"
              >
                <div className="flex items-center gap-3">
                  <div>img</div>
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

                <div className="text-s flex items-center">
                  <button className="p-2 rounded-full bg-violet-100 text-violet-600 mr-2">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  {Math.round(product.totalQuantitySold!)} Sold
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

export default PopularProductsCard;
