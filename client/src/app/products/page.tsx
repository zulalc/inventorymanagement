"use client";
import React, { useState } from "react";
import { AlertCircle, Edit, PlusCircle, Search, Trash } from "react-feather";
import { Rating } from "@mui/material";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/state/api";
import Header from "../(components)/Header";
import CreateProduct from "@/app/products/CreateProduct";
import DeleteProduct from "@/app/products/DeleteProduct";
import UpdateProduct from "@/app/products/UpdateProduct";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number;
};

type ProductEditData = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number;
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
    console.log("Updating Product with ID:", productId);
    console.log("Data:", productData);
    try {
      const { id, ...partialProductData } = productData;
      await updateProduct({
        productId,
        productData: partialProductData,
      }).unwrap();
      console.log("Product updated successfully");
    } catch (error: any) {
      console.error(
        "Failed to update the product:",
        error?.data || error.message || error
      );
    }
  };

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
                onClick={() => setIsCreateOpen(true)}
              >
                <PlusCircle className="w-5 h-5 mr-3 !text-gray-200" /> Create
                Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
              {products?.map((product) => (
                <div
                  className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
                  key={product.productId}
                >
                  <div className="flex flex-col items-center">
                    img
                    <h3 className="text-lg text-gray-900 font-semibold">
                      {product.name}{" "}
                    </h3>
                    <p className="text-gray-800">${product.price.toFixed(2)}</p>
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
                            <span className=" text-xs text-red-500 py-1 px-2 rounded font-bold">
                              Inventory is low.
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
                            stockQuantity: product.stockQuantity,
                            rating: product.rating,
                          })
                        }
                      >
                        <Edit className="w-5 h-5 mr-2" /> Update Product
                      </button>
                      <button
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          openDeleteModal(product.productId, product.name)
                        }
                      >
                        <Trash className="w-5 h-5 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
