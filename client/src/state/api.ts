import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
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
  expenseSummarId: string;
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

export interface DashboardData {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
  users: User[];
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  tagTypes: ["DashboardData", "Products", "Users", "Expenses"], //re fetch
  endpoints: (build) => ({
    getDashboardData: build.query<DashboardData, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardData"],
    }),
    getDashboardTimelyData: build.query<DashboardData, string>({
      //get request always void
      query: (time) => `/dashboard?time=${time}`,
      providesTags: ["DashboardData"],
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
      { productId: string; productData: Partial<Product> }
    >({
      query: ({ productId, productData }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Products"],
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
} = api;
