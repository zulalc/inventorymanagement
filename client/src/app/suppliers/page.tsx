"use client";
import React, { useEffect, useState } from "react";
import { Edit, PlusCircle, Search, Slash } from "react-feather";
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateSupplierMutation,
  useGetProductsBySupplierQuery,
  useGetSuppliersQuery,
} from "@/state/api";
import Header from "../(components)/Header";
import CreateSupplier from "@/app/suppliers/CreateSupplier";
import DeleteSupplier from "@/app/suppliers/DeleteSupplier";
import UpdateSupplier from "@/app/suppliers/UpdateSupplier";
import Image from "next/image";

type SupplierFormData = {
  name: string;
  contactInfo: string;
  status: "active" | "inactive";
};

type SupplierEditData = {
  id: string;
  name: string;
  contactInfo: string;
  status: string;
};

const Suppliers = () => {
  const [searchWord, setSearchWord] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<{
    supplierId: string;
    name: string;
    warning: string | null;
  } | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<SupplierEditData | null>(
    null
  );
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: suppliers,
    isLoading,
    isError,
  } = useGetSuppliersQuery(searchWord);

  // get products if supplier is chosen for delete
  const { data: products } = useGetProductsBySupplierQuery(
    selectedSupplierId!,
    {
      skip: !selectedSupplierId, // dont get if supplier is not selected
    }
  );

  const [createSupplier] = useCreateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();

  useEffect(() => {
    //selectedID changes => update warning msg w products
    if (selectedSupplierId && products) {
      if (products.length > 0) {
        const productNames = products.map((product) => product.name).join(", ");
        const warningMessage = `${productNames}`;
        setSelectedSupplier((prev) => ({
          ...prev!, //update only warning, keep other properties (previous)
          warning: warningMessage,
        }));
      } else {
        setSelectedSupplier((prev) => ({
          ...prev!,
          warning: null,
        }));
      }
    }
  }, [selectedSupplierId, products]); //run whenever these changes

  const openDeleteModal = (supplierId: string, supplierName: string) => {
    setSelectedSupplierId(supplierId);
    setSelectedSupplier({ supplierId, name: supplierName, warning: null });
    setIsDeleteOpen(true);
  };

  const openEditModal = (supplier: SupplierEditData) => {
    setEditSupplier(supplier);
    setIsEditOpen(true);
  };

  const handleCreateSupplier = async (supplierData: SupplierFormData) => {
    await createSupplier(supplierData);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    try {
      await deleteSupplier(supplierId).unwrap();
      console.log(`Supplier ${supplierId} is deactivated successfully.`);
    } catch (error: any) {
      console.error(
        "Failed to delete the supplier :",
        error?.data || error.message || error
      );
    }
  };

  const handleUpdateSupplier = async (
    supplierId: string,
    supplierData: SupplierEditData
  ) => {
    try {
      await updateSupplier({
        supplierId,
        supplierData: {
          supplierId,
          name: supplierData.name,
          contactInfo: supplierData.contactInfo,
          status: supplierData.status,
        },
      }).unwrap();
      console.log("Supplier updated succesfully");
    } catch (error: any) {
      console.error(
        "Failed to update the supplier: ",
        error?.data || error.message || error
      );
    }
  };

  const filteredSuppliers = suppliers?.filter((supplier) => {
    let matchesFilter = true;
    if (filter === "inactive") matchesFilter = supplier.status === "inactive";

    return matchesFilter;
  });

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
                  placeholder="Search suppliers"
                  className="w-full py-2 px-4 rounded bg-white focus:outline-violet-400"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <Header name="Suppliers" />
              <button
                className="flex items-center bg-violet-500 hover:bg-violet-700 text-gray-200 font-bold py-2 px-4 rounded"
                onClick={() => setIsCreateOpen(true)}
              >
                <PlusCircle className="w-5 h-5 mr-3 !text-gray-200" /> Create
                Supplier
              </button>
            </div>

            <div className="mb-6 flex space-x-4">
              <button
                className={`py-2 px-4 rounded ${
                  filter === "all"
                    ? "bg-violet-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>

              <button
                className={`py-2 px-4 rounded ${
                  filter === "inactive"
                    ? "bg-violet-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("inactive")}
              >
                Inactive
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
              {filteredSuppliers?.map((supplier) => (
                <div
                  className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
                  key={supplier.supplierId}
                >
                  <div className="flex flex-col items-center">
                    {/* Placeholder for supplier image */}
                    <Image
                      src={`https://s3-inventorym.s3.eu-central-1.amazonaws.com/product${
                        Math.floor(Math.random() * 3) + 1
                      }.jpg`}
                      alt="Products"
                      width={150}
                      height={150}
                      className="mb-3 rounded-2xl w-36 h-36"
                    />
                    <h3 className="text-lg text-gray-900 font-semibold">
                      {supplier.name}
                    </h3>
                    <p
                      className={`text-gray-800 font-bold ${
                        supplier.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Status:{" "}
                      {supplier.status === "active" ? "Active" : "Inactive"}
                    </p>
                    <p className="text-lg text-gray-900 ">
                      {supplier.contactInfo}
                    </p>

                    <div className="flex flex-col space-y-1">
                      <button
                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          openEditModal({
                            id: supplier.supplierId,
                            name: supplier.name,
                            contactInfo: supplier.contactInfo,
                            status: supplier.status,
                          })
                        }
                      >
                        <Edit className="w-5 h-5 mr-2" /> Update
                      </button>

                      {supplier.status === "active" && (
                        <button
                          className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                          onClick={() =>
                            openDeleteModal(supplier.supplierId, supplier.name)
                          }
                        >
                          <Slash className="w-5 h-5 mr-2" /> Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CreateSupplier
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              onCreate={handleCreateSupplier}
            />
          </div>
        </>
      )}

      {selectedSupplier && (
        <DeleteSupplier
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedSupplier(null);
          }}
          onDelete={handleDeleteSupplier}
          supplierId={selectedSupplier.supplierId}
          supplierName={selectedSupplier.name}
          warning={selectedSupplier.warning}
        />
      )}

      {isEditOpen && editSupplier && (
        <UpdateSupplier
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onUpdate={(updatedSupplierData) =>
            handleUpdateSupplier(editSupplier.id, updatedSupplierData)
          }
          supplier={editSupplier}
        />
      )}

      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default Suppliers;
