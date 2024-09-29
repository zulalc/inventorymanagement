"use client";
import React, { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  PlusCircle,
  Search,
  Trash,
  XCircle,
} from "react-feather";
import { Rating } from "@mui/material";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetSuppliersQuery,
} from "@/state/api";
import Header from "../(components)/Header";
import CreateProduct from "@/app/products/CreateProduct";
import DeleteProduct from "@/app/products/DeleteProduct";
import UpdateProduct from "@/app/products/UpdateProduct";
import Image from "next/image";

type ProductFormData = {
  name: string;
  price: number;
  supplierId: string;
  stockQuantity: number;
  rating?: number;
  status: "active" | "inactive";
};

type ProductEditData = {
  id: string;
  name: string;
  price: number;
  supplierId: string;
  stockQuantity: number;
  rating?: number;
  status: string;
};

const Products = () => {
  const [searchWord, setSearchWord] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    name: string;
  } | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductEditData | null>(null);
  const [filter, setFilter] = useState<
    "all" | "outOfStock" | "lowInventory" | "inactive"
  >("all");

  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: suppliers } = useGetSuppliersQuery();

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchWord);

  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const openDeleteModal = (productId: string, productName: string) => {
    setSelectedProduct({ productId, name: productName });
    setIsDeleteOpen(true);
  };

  const openEditModal = (product: ProductEditData) => {
    setEditProduct(product);
    setIsEditOpen(true);
  };

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      console.log(`Product ${productId} deleted successfully.`);
    } catch (error: any) {
      console.error(
        "Failed to delete the product:",
        error?.data || error.message || error
      );
    }
  };

  const handleUpdateProduct = async (
    productId: string,
    productData: ProductEditData
  ) => {
    try {
      await updateProduct({
        productId,
        productData: {
          productId,
          name: productData.name,
          price: productData.price,
          stockQuantity: productData.stockQuantity,
          rating: productData.rating,
          supplierId: productData.supplierId,
          status: productData.status,
        },
      }).unwrap();
      console.log("Product updated successfully");
    } catch (error: any) {
      console.error(
        "Failed to update the product:",
        error?.data || error.message || error
      );
    }
  };

  const handleSupplierChange = (supplierId: string) => {
    setSelectedSuppliers((prevSelected) =>
      prevSelected.includes(supplierId)
        ? prevSelected.filter((id) => id !== supplierId)
        : [...prevSelected, supplierId]
    );
  };

  const filteredProducts = products?.filter((product) => {
    let matchesFilter = true;

    if (filter === "outOfStock") matchesFilter = product.stockQuantity === 0;

    if (filter === "lowInventory")
      matchesFilter =
        product.stockQuantity > 0 && product.stockQuantity < 30000;

    if (filter === "inactive") matchesFilter = product.status === "inactive";

    if (selectedSuppliers.length > 0) {
      matchesFilter =
        matchesFilter && selectedSuppliers.includes(product.supplierId);
    }
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
                  placeholder="Search products"
                  className="w-full py-2 px-4 rounded bg-white focus:outline-violet-400"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <Header name="Products" />
            </div>

            <div className="flex justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  Filter by Supplier
                  <button
                    className="ml-2"
                    onClick={() => setIsFilterOpen((prev) => !prev)}
                  >
                    {isFilterOpen ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </h3>
                {isFilterOpen && (
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
                    {suppliers?.map((supplier) => (
                      <label
                        key={supplier.supplierId}
                        className="flex items-center mr-4 mb-2"
                      >
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedSuppliers.includes(
                            supplier.supplierId
                          )}
                          onChange={() =>
                            handleSupplierChange(supplier.supplierId)
                          }
                        />
                        {supplier.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <button
                  className="flex items-center bg-violet-500 hover:bg-violet-700 text-gray-200 font-bold py-2 px-4 rounded"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <PlusCircle className="w-5 h-5 mr-3 !text-gray-200" /> Create
                  Product
                </button>
              </div>
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
                  filter === "lowInventory"
                    ? "bg-violet-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setFilter("lowInventory")}
              >
                Low Inventory
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  filter === "outOfStock"
                    ? "bg-violet-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setFilter("outOfStock")}
              >
                Out of Stock
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
              {filteredProducts?.map((product) => {
                const supplier = suppliers?.find(
                  (s) => s.supplierId === product.supplierId
                );

                return (
                  <div
                    className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
                    key={product.productId}
                  >
                    <div className="flex flex-col items-center">
                      {/* Image placeholder */}

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
                        {product.name}
                      </h3>

                      <h2 className="text-m text-gray-600 font-semibold">
                        {supplier
                          ? supplier.name
                          : `Supplier not found (ID: ${product.supplierId})`}
                      </h2>
                      <p
                        className={`text-gray-800 font-bold ${
                          product.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Status:{" "}
                        {product.status === "active" ? "Active" : "Inactive"}
                      </p>

                      <p className="text-gray-800">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="text-sm text-gray-600 mt-1">
                        {product.stockQuantity === 0 ? (
                          <div className="text-red-600 font-bold ml-8">
                            <div className="flex items-center justify-center">
                              <XCircle className="w-6 h-6" stroke="red" />
                              <span className="text-s py-1 px-2 rounded font-bold">
                                Out of Stock!
                              </span>
                            </div>
                          </div>
                        ) : product.stockQuantity >= 90000 ? (
                          <div className="text-green-500 font-bold ml-8">
                            Stock: {product.stockQuantity}
                          </div>
                        ) : (
                          <div>
                            <div className="text-orange-400 font-bold ml-8">
                              Stock: {product.stockQuantity}
                            </div>
                            <div className="flex items-center">
                              <AlertCircle
                                className="w-6 h-6 mr-2"
                                stroke="#FFA500"
                              />
                              <span className="text-s text-orange-400 py-1 px-2 rounded font-bold">
                                Low inventory!
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {product.rating !== undefined && (
                        <div className="flex items-center mt-2 mb-4">
                          <Rating
                            name={`rating-${product.productId}`}
                            value={product.rating || 0}
                            readOnly
                          />
                          <span className="ml-2 text-gray-700">
                            {product.rating || "No rating"}
                          </span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                          onClick={() =>
                            openEditModal({
                              id: product.productId,
                              name: product.name,
                              price: product.price,
                              supplierId: product.supplierId,
                              stockQuantity: product.stockQuantity,
                              status: product.status,
                              rating: product.rating,
                            })
                          }
                        >
                          <Edit className="w-5 h-5 mr-2" /> Update
                        </button>

                        <button
                          className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                          onClick={() =>
                            openDeleteModal(product.productId, product.name)
                          }
                        >
                          <Trash className="w-5 h-5 mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <CreateProduct
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              onCreate={handleCreateProduct}
            />
          </div>
        </>
      )}

      {selectedProduct && (
        <DeleteProduct
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onDelete={handleDeleteProduct}
          productId={selectedProduct.productId}
          productName={selectedProduct.name}
        />
      )}

      {isEditOpen && editProduct && (
        <UpdateProduct
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onUpdate={(updatedProductData) =>
            handleUpdateProduct(editProduct.id, updatedProductData)
          }
          product={editProduct}
        />
      )}

      {isError && <div className="m-5">Failed to fetch data</div>}
    </div>
  );
};

export default Products;
