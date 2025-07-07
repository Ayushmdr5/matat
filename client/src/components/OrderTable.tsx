import React from "react";
import type { TableOrder } from "../types/order";
import type { SortOrder } from "../types/general";
import SortIndicator from "./SortIndicator";

interface OrderTableProps {
  orders: TableOrder[];
  sortBy: string;
  sortOrder: SortOrder;
  loading: boolean;
  onSortChange: (sortBy: string, sortOrder: SortOrder) => void;
  onViewOrder: (id: number) => void;
  page: number;
  limit: number;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  sortBy,
  sortOrder,
  loading,
  onSortChange,
  onViewOrder,
  page,
  limit,
}) => {
  const handleSort = (column: string) => {
    if (sortBy === column) {
      onSortChange(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(column, "asc");
    }
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full border text-sm text-left">
        <thead className="bg-gray-100">
          <tr className="[&>th]:px-4 [&>th]:py-3">
            <th>S.N.</th>

            <th
              className={` cursor-pointer select-none ${
                sortBy === "id"
                  ? "bg-blue-100 font-semibold text-blue-700"
                  : "hover:text-blue-600"
              }`}
              title="Sort by ID"
            >
              ID
            </th>

            <th>Billing Name</th>
            <th>Shipping Name</th>
            <th>Products</th>

            <th
              className={`cursor-pointer select-none ${
                sortBy === "status"
                  ? "bg-blue-100 font-semibold text-blue-700"
                  : "hover:text-blue-600"
              }`}
              title="Sort by Status"
            >
              Status
            </th>

            <th
              className={`cursor-pointer select-none ${
                sortBy === "total"
                  ? "bg-blue-100 font-semibold text-blue-700"
                  : "hover:text-blue-600"
              }`}
              onClick={() => handleSort("total")}
              title="Sort by Total"
            >
              Total{" "}
              <SortIndicator active={sortBy === "total"} order={sortOrder} />
            </th>

            <th
              className={`cursor-pointer select-none ${
                sortBy === "date_created"
                  ? "bg-blue-100 font-semibold text-blue-700"
                  : "hover:text-blue-600"
              }`}
              onClick={() => handleSort("date_created")}
              title="Sort by Date"
            >
              Date{" "}
              <SortIndicator
                active={sortBy === "date_created"}
                order={sortOrder}
              />
            </th>

            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center py-44 text-gray-500">
                Loading orders...
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 [&>td]:px-4 [&>td]:py-3"
              >
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{order.id}</td>
                <td>
                  {order.billing?.first_name} {order.billing?.last_name}
                </td>
                <td>
                  {order.shipping?.first_name} {order.shipping?.last_name}
                </td>
                <td>
                  {order.line_items && order.line_items.length > 0
                    ? order.line_items
                        .map((item: any) => item.name?.trim())
                        .filter((name) => name)
                        .join(", ") || "Unnamed Product"
                    : "No Products"}
                </td>
                <td className="capitalize">{order.status}</td>
                <td>${Number(order.total).toFixed(2)}</td>
                <td>{new Date(order.date_created).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => onViewOrder(order.id)}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
