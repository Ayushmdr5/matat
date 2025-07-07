import api from "../lib/axios";
import type { ApiResponse } from "../types/general";
import type { Product } from "../types/product";

export const fetchProducts = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ApiResponse<Product[]>> => {
  const response = await api.get("/products", { params });
  return response?.data;
};
