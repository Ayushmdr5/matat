import api from "../lib/axios";
import type { ApiResponse } from "../types/general";
import type { Order } from "../types/order";

export const fetchOrders = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  productId?: number;
}): Promise<ApiResponse<Order[]>> => {
  const response = await api.get("/orders", { params });
  return response?.data;
};

export const fetchOrderDetail = async (
  orderId: number
): Promise<ApiResponse<Order>> => {
  const response = await api.get(`/orders/${orderId}`);
  return response?.data;
};
