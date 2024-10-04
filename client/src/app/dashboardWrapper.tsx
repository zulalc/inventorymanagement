"use client"; //provide the store to dashboard layout

import React, { useEffect } from "react";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "./(components)/Sidebar";
import StoreProvider, { useAppDispatch, useAppSelector } from "./redux";
import { usePathname } from "next/navigation";
import { setToken } from "@/state/authSlice";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.global.isSidebarOpen);
  const pathname = usePathname();
  const isLoginPage = pathname === "/";
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return (
    <div
      className={`${
        !isLoginPage && isAuthenticated
          ? "light flex bg-gray-50 text-gray-900 w-full min-h-screen "
          : ""
      }`}
    >
      {!isLoginPage && isAuthenticated && <Sidebar />}
      <main
        className={`${
          !isLoginPage && isAuthenticated
            ? `flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
                isSidebarOpen ? "md:pl-24" : "md:pl-72"
              }`
            : ""
        }`}
      >
        {!isLoginPage && isAuthenticated && <Navbar />}
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};
export default DashboardWrapper;
