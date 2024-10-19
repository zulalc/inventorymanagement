"use client"; //cannot pass on click on any server component on next.js -- click and event handler needs use client

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarOpen } from "@/state";
import { clearToken } from "@/state/authSlice";
import { signOut } from "aws-amplify/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Bell, LogOut, Menu, Search, Settings, Sun } from "react-feather";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSidebarOpen = useAppSelector((state) => state.global.isSidebarOpen);
  const toggleSidebar = () => {
    dispatch(setIsSidebarOpen(!isSidebarOpen));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <div className="flex justify-between items-center w-full mb-7 ">
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-violet-200	transition duration-900 ease-in-out"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative">
          <input
            className="pr-4 py-2 pl-8 w-50 md:w-80 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-violet-400"
            type="search"
            placeholder="Search"
          />
          <div className="absolute inset-y-0 left-0 py-2 pl-2 flex item-center pointer-events-none">
            {/* absolute for beginning on the left side & inset y for left*/}
            <Search className="text-gray-500" size={18} />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <div className="relative">
            <Bell
              className="cursor-pointer text-gray-500 hover:text-violet-600 transition duration-800 ease-in-out"
              size={20}
            />
          </div>
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-2" />
          <div className="flex items-center gap-3 cursor-pointer">
            <Image
              src="https://s3-inventorym.s3.eu-central-1.amazonaws.com/profile.png"
              alt="Profile"
              width={30}
              height={30}
              className="rounded-s h-full object-cover"
            />
            <span className="font-bold">Zülal</span>
          </div>
        </div>
        <Link href="/settings">
          <Settings
            className="text-gray-500 cursor-pointer hover:text-violet-600  transition duration-800 ease-in-out"
            size={20}
          />
        </Link>

        <div className="relative">
          <button onClick={handleSignOut}>
            <LogOut
              className="cursor-pointer text-gray-500 hover:text-red-600 transition duration-800 ease-in-out"
              size={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
