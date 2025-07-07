import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../services/orderService";
import OrderTable from "../components/OrderTable";
import Pagination from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import OrderDetailModal from "../components/OrderDetailModal";
import type { SortOrder } from "../types/general";
import NavButton from "../components/NavButton";

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_created");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [status, setStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const [searchParams, setSearchParams] = useSearchParams();
  const productIdParam = searchParams.get("productId");
  const productNameParam = searchParams.get("productName");

  const productId = productIdParam ? Number(productIdParam) : null;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "orders",
      page,
      limit,
      debouncedSearch,
      sortBy,
      sortOrder,
      status,
      productId,
    ],
    queryFn: () =>
      fetchOrders({
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
        status,
        productId: productId || undefined,
      }),
  });

  const orders = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10 };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">🛒 Orders</h1>
        <NavButton to="/products">View Products</NavButton>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="🔍 Search by ID, Number, Billing/Shipping or Product Name..."
              className="border mr-2 border-gray-300 p-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[500px]"
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 p-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="on-hold">On-hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
              <option value="trash">Trash</option>
            </select>
          </div>
          {productId && (
            <div className="p-2 bg-blue-100 text-blue-800 rounded inline-flex items-center gap-2 max-w-max">
              Filtering orders for product:{" "}
              <strong>{productNameParam || productId}</strong>
              <button
                onClick={() => {
                  // Remove productId and productName from URL params, keep others intact
                  const params = new URLSearchParams(searchParams);
                  params.delete("productId");
                  params.delete("productName");
                  setSearchParams(params);
                  setPage(1);
                }}
                className="ml-4 px-2 py-1 text-sm text-blue-600 underline hover:text-blue-800"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-md mb-6">
          Failed to load orders. {(error as any)?.message || ""}
        </div>
      )}

      {!isError && (
        <>
          <div className="bg-white border rounded-md shadow-md overflow-x-auto">
            <OrderTable
              orders={orders}
              sortBy={sortBy}
              sortOrder={sortOrder}
              loading={isLoading}
              onSortChange={(sb, so) => {
                setSortBy(sb);
                setSortOrder(so);
                setPage(1);
              }}
              onViewOrder={(id) => setSelectedOrder(id)}
              page={page}
              limit={limit}
            />
          </div>

          <div className="mt-6">
            <Pagination
              page={page}
              limit={limit}
              total={pagination.total}
              onPageChange={(p) => setPage(p)}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </div>
        </>
      )}

      {selectedOrder && (
        <OrderDetailModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
