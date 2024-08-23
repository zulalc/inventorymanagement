"use client";
import { useGetProductsQuery, useCreateProductMutation } from "@/state/api";
import { useState } from "react";
import { AlertCircle, PlusCircle, Search } from "react-feather";
import Header from "../(components)/Header";
import { Rating } from "@mui/material";

const Products = () => {
  const [searchWord, setSearchWord] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchWord);
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
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded">
                <Search className="w-5 h-5 text-gray-500 m-2" />
                <input
                  placeholder="Search products"
                  className="w-full py-2 px-4 rounded bg-white focus:outline-violet-400"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <Header name="Products" />
              <button
                className="flex items-center bg-violet-500 hover:bg-violet-700 text-gray-200 font-bold py-2 px-4 rounded"
                onClick={() => setIsProductModalOpen(true)}
              >
                <PlusCircle className="w-5 h-5 mr-3 !text-gray-200" /> Create
                Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
              {" "}
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
                products?.map((product) => (
                  <div
                    className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
                    key={product.productId}
                  >
                    <div className="flex flex-col items-center">
                      img
                      <h3 className="text-lg text-gray-900 font-semibold">
                        {product.name}{" "}
                      </h3>
                      <p className="text-gray-800">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="text-sm text-gray-600 mt-1">
                        {product.stockQuantity >= 90000 ? (
                          <div>Stock: {product.stockQuantity}</div>
                        ) : (
                          <div>
                            <div className="text-red-500 font-bold ml-8">
                              Stock: {product.stockQuantity}
                            </div>
                            <div className="flex items-center">
                              <AlertCircle
                                className="w-6 h-6 mr-2"
                                stroke="red"
                              />
                              <span className="bg-red-500 text-xs text-white py-1 px-2 rounded font-bold">
                                Inventory is low.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {product.rating && (
                        <div className="flex items-center-mt-2">
                          <Rating defaultValue={product.rating || 0} readOnly />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default Products;
