"use client";

import { useGetUsersQuery } from "@/state/api";
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { Search } from "react-feather";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 150 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
];

const Users = () => {
  const [searchWord, setSearchWord] = useState("");
  const { data: users, isLoading, isError } = useGetUsersQuery(searchWord);
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
                  placeholder="Search users"
                  className="w-full py-2 px-4 rounded bg-white focus:outline-violet-400"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                />
              </div>
            </div>
            <Header name="Users" />
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.userId}
              checkboxSelection
              className="bg-white shadow rounded-lg border border-gray-00 mt-5 !text-gray-700"
              sx={{
                "& .Mui-checked": {
                  color: "#8b5cf6 !important",
                },
                "& .MuiCheckbox-indeterminate .MuiSvgIcon-root": {
                  color: "#8b5cf6",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "#8b5cf6",
                },
              }}
            />
          </div>
        </>
      )}

      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default Users;
