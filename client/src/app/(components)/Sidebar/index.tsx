"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarOpen } from "@/state";
import React, { useState, useRef, useEffect } from "react";
import {
  Archive,
  BarChart2,
  Clipboard,
  DollarSign,
  Layout,
  Menu,
  Sliders,
  Truck,
  User,
} from "react-feather";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.global.isSidebarOpen);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    dispatch(setIsSidebarOpen(!isSidebarOpen));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX) return;
    const touchEndX = e.touches[0].clientX;

    if (isSidebarOpen && touchEndX > touchStartX + 50) {
      //slide out when swiping right -->
      toggleSidebar();
    } else if (!isSidebarOpen && touchStartX - touchEndX > 50) {
      //slide in when swiping left <__
      toggleSidebar();
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed flex flex-col ${
        isSidebarOpen ? "w-0 md:w-16" : "w-72 md:w-64"
      } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/*LOGO*/}
      <div
        className={`flex justify-between gap-3 md:justify-normal items-center pt-8 ${
          isSidebarOpen ? "px-5" : "px-8"
        }`}
      >
        <Image
          src="https://s3-inventorym.s3.eu-central-1.amazonaws.com/logo.png"
          alt="inventory-logo"
          width={35}
          height={30}
          className="rounded-s h-full object-fill"
        />
        <h1
          className={`${
            isSidebarOpen ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          INVENTORY
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-violet-200 transition duration-900 ease-in-out"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
      {/*LINKS*/}
      <div className="flex-grow mt-8">
        <Link href="/dashboard">
          <div
            className={`cursor-pointer flex items-center ${
              isSidebarOpen ? "justify-center py-4" : "justify-start px-8 py-4"
            } hover:text-violet-500 hover:bg-violet-100 gap-3 transition-colors ${
              pathname === "/dashboard" ||
              (pathname === "/" && "/dashboard" === "/dashboard")
                ? "bg-violet-200 text-white"
                : ""
            }`}
          >
            <Layout className="w-6 h-6 !text-gray-700" />
            <span
              className={`${
                isSidebarOpen ? "hidden" : "block"
              } font-medium text-gray-700`}
            >
              Dashboard
            </span>
          </div>
        </Link>

        <Link href="/analytics">
          <div
            className={`cursor-pointer flex items-center ${
              isSidebarOpen ? "justify-center py-4" : "justify-start px-8 py-4"
            } hover:text-violet-500 hover:bg-violet-100 gap-3 transition-colors ${
              pathname === "/analytics" ? "bg-violet-200 text-white" : ""
            }`}
          >
            <BarChart2 className="w-6 h-6 !text-gray-700" />
            <span
              className={`${
                isSidebarOpen ? "hidden" : "block"
              } font-medium text-gray-700`}
            >
              Reports/Analytics
            </span>
          </div>
        </Link>

        <Link href="/inventory">
          <div
            className={`cursor-pointer flex items-center ${
              isSidebarOpen ? "justify-center py-4" : "justify-start px-8 py-4"
            } hover:text-violet-500 hover:bg-violet-100 gap-3 transition-colors ${
              pathname === "/inventory" ? "bg-violet-200 text-white" : ""
            }`}
          >
            <Archive className="w-6 h-6 !text-gray-700" />
            <span
              className={`${
                isSidebarOpen ? "hidden" : "block"
              } font-medium text-gray-700`}
            >
              Inventory
            </span>
          </div>
        </Link>

        <Link href="/products">
          <div
            className={`cursor-pointer flex items-center ${
              isSidebarOpen ? "justify-center py-4" : "justify-start px-8 py-4"
            } hover:text-violet-500 hover:bg-violet-100 gap-3 transition-colors ${
              pathname === "/products" ? "bg-violet-200 text-white" : ""
            }`}
          >
            <Clipboard className="w-6 h-6 !text-gray-700" />
            <span
              className={`${
                isSidebarOpen ? "hidden" : "block"
              } font-medium text-gray-700`}
            >
              Products
            </span>
          </div>
        </Link>

        <Link href="/suppliers">
          <div
            className={`cursor-pointer flex items-center ${
              isSidebarOpen ? "justify-center py-4" : "justify-start px-8 py-4"
            } hover:text-violet-500 hover:bg-violet-100 gap-3 transition-colors ${
              pathname === "/suppliers" ? "bg-violet-200 text-white" : ""
            }`}
          >
            <Truck className="w-6 h-6 !text-gray-700" />
            <span
              className={`${
                isSidebarOpen ? "hidden" : "block"
              } font-medium text-gray-700`}
            >
              Suppliers
            </span>
          </div>
        </Link>

        <Link href="/users">
          <div
            className={`cursor-pointer flex items-center ${
              isSidebarOpen ? "justify-center py-4" : "justify-start px-8 py-4"
            } hover:text-violet-500 hover:bg-violet-100 gap-3 transition-colors ${
              pathname === "/users" ? "bg-violet-200 text-white" : ""
            }`}
          >
            <User className="w-6 h-6 !text-gray-700" />
            <span
              className={`${
                isSidebarOpen ? "hidden" : "block"
              } font-medium text-gray-700`}
            >
              Users
            </span>
          </div>
        </Link>

        <Link href="/settings">
          <div
            className={`cursor-pointer flex items-center ${
              isSidebarOpen ? "justify-center py-4" : "justify-start px-8 py-4"
            } hover:text-violet-500 hover:bg-violet-100 gap-3 transition-colors ${
              pathname === "/settings" ? "bg-violet-200 text-white" : ""
            }`}
          >
            <Sliders className="w-6 h-6 !text-gray-700" />
            <span
              className={`${
                isSidebarOpen ? "hidden" : "block"
              } font-medium text-gray-700`}
            >
              Settings
            </span>
          </div>
        </Link>
      </div>
      <div>
        <p className="text-center text-xs text-gray-500">
          &copy; 2024 Inventory
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
