import { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "../(components)/Header";

type SupplierFormData = {
  name: string;
  contactInfo: string;
  status: "active" | "inactive";
};

type CreateSupplierProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: SupplierFormData) => void;
};

const CreateSupplier = ({ isOpen, onClose, onCreate }: CreateSupplierProps) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contactInfo: "",
    status: "active",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "status" ? (value as "active" | "inactive") : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="supplierName"
            className="block text-sm font-medium text-gray-700"
          >
            Supplier Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label
            htmlFor="productPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Info
          </label>
          <input
            type="text"
            name="contactInfo"
            placeholder="Contact Information"
            onChange={handleChange}
            value={formData.contactInfo}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSupplier;
