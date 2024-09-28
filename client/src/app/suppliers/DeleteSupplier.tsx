import React from "react";
import Header from "../(components)/Header";

type DeleteSupplierProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (supplierId: string) => void;
  supplierId: string;
  supplierName: string;
  warning: string | null;
};

const DeleteSupplier = ({
  isOpen,
  onClose,
  onDelete,
  supplierId,
  supplierName,
  warning,
}: DeleteSupplierProps) => {
  const handleDelete = () => {
    onDelete(supplierId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Delete Supplier" />
        <div className="mt-5">
          <p className="text-sm text-gray-700">
            Are you sure you want to deactivate the supplier{" "}
            <strong className="font-semibold">{supplierName}</strong>?
          </p>

          {warning && (
            <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Warning:</strong>
              This supplier has the following products:
              <strong>{warning}</strong>
            </div>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-150"
            >
              Deactivate
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSupplier;
