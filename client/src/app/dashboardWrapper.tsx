"use client"; //provide the store to dashboard layout

import React, { useEffect } from "react";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "./(components)/Sidebar";
import StoreProvider, { useAppDispatch, useAppSelector } from "./redux";
import AuthProvider from "./authProvider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.global.isSidebarOpen);

  return (
    <div
      className={`"light flex bg-gray-50 text-gray-900 w-full min-h-screen "
          : ""
      }`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarOpen ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </StoreProvider>
  );
};
export default DashboardWrapper;
