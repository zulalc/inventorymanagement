import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  supplierId: string;
  stockQuantity: number;
  status: string;
  totalQuantitySold?: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  supplierId: string;
  status: string;
  stockQuantity: number;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummaryId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  expenseSummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

type Supplier = {
  supplierId: string;
  name: string;
  contactInfo: string;
  status: string;
};

export interface NewSupplier {
  name: string;
  contactInfo: string;
  status: string;
}

export interface DashboardData {
  popularProducts: Product[];
  productDetails: Product[];
  lowStockProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
  users: User[];
}

export interface AnalyticsData {
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  tagTypes: [
    "DashboardData",
    "AnalyticsData",
    "Products",
    "Users",
    "Expenses",
    "Suppliers",
  ], //re fetch
  endpoints: (build) => ({
    getDashboardData: build.query<DashboardData, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardData"],
    }),
    getDashboardTimelyData: build.query<DashboardData, string>({
      query: (time) => `/dashboard?time=${time}`,
      providesTags: ["DashboardData"],
    }),
    getAnalyticsData: build.query<AnalyticsData, void>({
      query: () => "/analytics",
      providesTags: ["AnalyticsData"],
    }),

    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),

    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"], //automatically sends another api request and get new list of products
    }),

    deleteProduct: build.mutation<void, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: build.mutation<
      void,
      { productId: string; productData: Product }
    >({
      query: ({ productId, productData }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Products", "Suppliers"],
    }),

    getUsers: build.query<User[], string | void>({
      query: (search) => ({
        url: "/users",
        params: search ? { search } : {},
      }),
      providesTags: ["Users"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),

    getSuppliers: build.query<Supplier[], string | void>({
      query: (search) => ({
        url: "/suppliers",
        params: search ? { search } : {},
      }),
      providesTags: ["Suppliers"],
    }),

    getProductsBySupplier: build.query<Product[], string>({
      query: (supplierId) => `/suppliers/${supplierId}/products`,
      providesTags: ["Products"],
    }),

    createSupplier: build.mutation<Supplier, NewSupplier>({
      query: (newSupplier) => ({
        url: "/suppliers",
        method: "POST",
        body: newSupplier,
      }),
      invalidatesTags: ["Suppliers"],
    }),

    deleteSupplier: build.mutation<void, string>({
      query: (supplierId) => ({
        url: `/suppliers/${supplierId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Suppliers", "Products"],
    }),

    updateSupplier: build.mutation<
      void,
      { supplierId: string; supplierData: Supplier }
    >({
      query: ({ supplierId, supplierData }) => ({
        url: `/suppliers/${supplierId}`,
        method: "PUT",
        body: supplierData,
      }),
      invalidatesTags: ["Suppliers"],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetDashboardTimelyDataQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useGetExpensesByCategoryQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetAnalyticsDataQuery,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateSupplierMutation,
  useGetProductsBySupplierQuery,
} = api;
