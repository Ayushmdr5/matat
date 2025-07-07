import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderDetail } from "../services/orderService";

interface OrderDetailModalProps {
  orderId: number;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  onClose,
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => fetchOrderDetail(orderId),
    enabled: !!orderId,
  });

  const order = data?.data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2
          id="modal-title"
          className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2"
        >
          Order #{orderId}
        </h2>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">
            Failed to fetch order detail. {(error as any)?.message}
          </p>
        ) : !order ? (
          <p className="text-center text-gray-500">Order data not found.</p>
        ) : (
          <div className="space-y-8 text-gray-800">
            <section>
              <h3 className="font-semibold text-lg text-gray-700 mb-1">
                Status
              </h3>
              <p className="capitalize bg-blue-100 inline-block px-3 py-1 rounded-full font-medium text-blue-800 w-max">
                {order.status}
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-3 border-b pb-1">
                  Billing Info
                </h3>
                <dl className="space-y-2 text-gray-600">
                  <div>
                    <dt className="font-medium">Name</dt>
                    <dd>
                      {order.billing?.first_name} {order.billing?.last_name}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Email</dt>
                    <dd>{order.billing?.email}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Phone</dt>
                    <dd>{order.billing?.phone}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Address</dt>
                    <dd>
                      {order.billing?.address_1}, {order.billing?.city}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-3 border-b pb-1">
                  Shipping Info
                </h3>
                <dl className="space-y-2 text-gray-600">
                  <div>
                    <dt className="font-medium">Name</dt>
                    <dd>
                      {order.shipping?.first_name} {order.shipping?.last_name}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Phone</dt>
                    <dd>{order.shipping?.phone}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Address</dt>
                    <dd>
                      {order.shipping?.address_1}, {order.shipping?.city}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-700 mb-3 border-b pb-1">
                Line Items
              </h3>
              {order.line_items?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {order.line_items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 py-3">
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={item.name || "Product Image"}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {item.name?.trim() || "Unnamed Product"}
                        </span>
                        <span className="text-gray-600">
                          Quantity: {item.quantity}
                        </span>
                        <span className="text-gray-600">
                          Price: ${item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No items</p>
              )}
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-700 mb-1">
                Total
              </h3>
              <p className="text-xl font-bold">
                ${Number(order.total).toFixed(2)}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;
