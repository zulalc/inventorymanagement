import React from "react";
import Header from "../(components)/Header";

type DeleteProductProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (productId: string) => void;
  productId: string;
  productName: string;
};

const DeleteProduct = ({
  isOpen,
  onClose,
  onDelete,
  productId,
  productName,
}: DeleteProductProps) => {
  const handleDelete = () => {
    onDelete(productId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Delete Product" />
        <div className="mt-5">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete the product{" "}
            <strong>{productName}</strong>?
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
