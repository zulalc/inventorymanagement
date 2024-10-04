"use client";
import { useGetProductsQuery, useGetSuppliersQuery } from "@/state/api";
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AlertCircle, XCircle } from "react-feather";
import { Rating, useMediaQuery } from "@mui/material";

const Inventory = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery();

  const {
    data: suppliers,
    isLoading: suppliersLoading,
    isError: suppliersError,
  } = useGetSuppliersQuery();

  const supplierMap = suppliers?.reduce((map, supplier) => {
    map[supplier.supplierId] = supplier.name;
    return map;
  }, {} as Record<string, string>);

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product Name", width: 200 },

    {
      field: "supplierId",
      headerName: "Supplier",
      width: 200,
      valueGetter: (value, row) => supplierMap?.[row.supplierId] || "Unknown",
    },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      type: "number",
      valueGetter: (value, row) => `$${row.price}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 170,
      type: "number",
      valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
      renderCell: (params) => (
        <div className="flex items-center">
          <Rating defaultValue={params.row.rating || 0} readOnly />
          {params.row.rating}
        </div>
      ),
    },
    {
      field: "stockQuantity",
      headerName: "Stock Quantity",
      width: 170,
      type: "number",
      renderCell: (params) => (
        <div className="flex items-center text-sm text-gray-600 mt-1">
          {params.row.stockQuantity === 0 ? (
            <div>
              <div className="flex items-center justify-center">
                <XCircle className="w-6 h-6" stroke="red" />
                <div className="text-red-600 font-bold ml-2">Out of Stock</div>
              </div>
            </div>
          ) : params.row.stockQuantity >= 90000 ? (
            <div className="text-green-500 font-bold ml-8">
              {params.row.stockQuantity}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center">
                <AlertCircle className="w-6 h-6" stroke="#FFA500" />
                <div className="text-orange-400 font-bold ml-2">
                  {params.row.stockQuantity}
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <hr />
      {productsLoading || suppliersLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
          <span className="ml-2 text-violet-500">Loading...</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <Header name="Inventory" />

            {isMobile ? (
              <div>
                {products?.map((row) => (
                  <div
                    key={row.productId}
                    className="p-4 bg-white rounded-md shadow mb-4"
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-semibold">ID:</span>
                        <span className="text-xs">{row.productId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Name:</span>
                        <span>{row.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Supplier:</span>
                        <span>
                          {supplierMap?.[row.supplierId] || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Price:</span>
                        <span>${row.price}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold">Stock Quantity:</span>
                        <span>{row.stockQuantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Rating:</span>
                        <Rating defaultValue={row.rating || 0} readOnly />
                        {row.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DataGrid
                rows={products}
                columns={columns}
                getRowId={(row) => row.productId}
                checkboxSelection
                className="bg-white shadow rounded-lg border border-gray-00 mt-5 !text-gray-700"
              />
            )}
          </div>
        </>
      )}

      {productsError || suppliersError ? (
        <div className="m-5">Failed to fetch data</div>
      ) : null}
    </div>
  );
};

export default Inventory;
