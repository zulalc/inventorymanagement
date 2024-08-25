import { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "../(components)/Header";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

type CreateProductProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const CreateProduct = ({ isOpen, onClose, onCreate }: CreateProductProps) => {
  const [formData, setFormData] = useState({
    productId: v4(),
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? value === ""
            ? 0
            : parseFloat(value)
          : value,
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
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
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
            Price
          </label>
          <input
            type="number"
            name="price"
            min="0"
            placeholder="price"
            onChange={handleChange}
            value={formData.price}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label
            htmlFor="stockQuantity"
            className="block text-sm font-medium text-gray-700"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            min="0"
            placeholder="stockQuantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700"
          >
            Rating
          </label>
          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

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

export default CreateProduct;
