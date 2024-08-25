"use client";

import { useGetProductsQuery } from "@/state/api";
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AlertCircle } from "react-feather";
import { Rating } from "@mui/material";

const columns: GridColDef[] = [
  { field: "productId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Product Name", width: 200 },
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
      <div className="flex items-center">
        {params.row.stockQuantity}
        {params.row.stockQuantity < 300000 && (
          <div className="relative group">
            <AlertCircle className="text-red-500 w-4 h-4 ml-2" />
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block text-xs bg-red-500 text-white py-1 px-2 rounded">
              Inventory is low
            </div>
          </div>
        )}
      </div>
    ),
  },
];

const Inventory = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();
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
            <Header name="Inventory" />
            <DataGrid
              rows={products}
              columns={columns}
              getRowId={(row) => row.productId}
              checkboxSelection
              className="bg-white shadow rounded-lg border border-gray-00 mt-5 !text-gray-700"
            />
          </div>
        </>
      )}

      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default Inventory;
