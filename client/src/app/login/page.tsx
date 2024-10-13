"use client";

import { setToken } from "@/state/authSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const BASE_URL = process.env.BASE_URL;
  const PORT = process.env.PORT;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      console.log("Response:", response);

      console.log("Data:", data);
      if (!response.ok) {
        console.error("Login failed:", data.message);
        alert(`Login failed: ${data.message}`);
        return;
      }

      const token = data.token;
      console.log("Received token:", token);

      if (!token) {
        console.error("Token is undefined");
        alert("Login failed: No token received");
        return;
      }

      localStorage.setItem("token", data.token);
      dispatch(setToken(data.token));

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login failed:", err.message);
        alert(`Login failed: ${err.message}`);
      } else {
        console.error("An unexpected error occurred");
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-violet-300">
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        <Image
          src="https://s3-inventorym.s3.eu-central-1.amazonaws.com/logo.png"
          alt="inventory-logo"
          width={50}
          height={50}
          className="rounded-md object-cover"
        />
        <h1 className="text-xl font-bold text-white">Inventory Management</h1>
      </div>
      <div className="max-w-md w-full bg-white p-9 rounded-lg shadow-xl mt-16">
        <h2 className="text-2xl font-extrabold text-center text-violet-700 mb-8">
          Admin Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label
              className="block text-gray-800 mb-2 font-medium"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-200"
              required
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-gray-800 mb-2 font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-lg hover:bg-violet-700 transition duration-200 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
