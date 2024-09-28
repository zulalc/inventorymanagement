import React, { useState } from "react";

type UpdateSupplierData = {
  id: string;
  name: string;
  contactInfo: string;
  status: string;
};

type UpdateSupplierProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (formData: UpdateSupplierData) => void;
  supplier: UpdateSupplierData;
};

const UpdateSupplier = ({
  isOpen,
  onClose,
  onUpdate,
  supplier,
}: UpdateSupplierProps) => {
  const [formData, setFormData] = useState<UpdateSupplierData>(supplier);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Supplier</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contact Information</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSupplier;
