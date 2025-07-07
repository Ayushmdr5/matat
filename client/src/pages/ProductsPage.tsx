import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/productService";
import { useDebounce } from "../hooks/useDebounce";
import type { SortOrder } from "../types/general";
import NavButton from "../components/NavButton";
import Pagination from "../components/Pagination";
import SortIndicator from "../components/SortIndicator";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", debouncedSearch, sortBy, sortOrder, page, limit],
    queryFn: () =>
      fetchProducts({
        search: debouncedSearch,
        sortBy,
        sortOrder,
        page,
        limit,
      }),
  });

  const products = data?.data || [];
  const pagination = data?.pagination || { total: 0, page, limit };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1); // reset page on sort
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🛍️ Products</h1>
        <NavButton to="/">View Orders</NavButton>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page on search
          }}
          placeholder="🔍 Search by name or SKU"
          className="border border-gray-300 p-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[400px]"
        />
      </div>

      {isError ? (
        <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
          Failed to load products.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-md shadow-md bg-white">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-700 font-medium">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>Image</th>
                  <th
                    className={` cursor-pointer select-none ${
                      sortBy === "name"
                        ? "bg-blue-100 font-semibold text-blue-700"
                        : "hover:text-blue-600"
                    }`}
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    <SortIndicator
                      active={sortBy === "name"}
                      order={sortOrder}
                    />
                  </th>
                  <th>SKU</th>
                  <th
                    className={` cursor-pointer select-none ${
                      sortBy === "price"
                        ? "bg-blue-100 font-semibold text-blue-700"
                        : "hover:text-blue-600"
                    }`}
                    onClick={() => handleSort("price")}
                  >
                    Price{" "}
                    <SortIndicator
                      active={sortBy === "price"}
                      order={sortOrder}
                    />
                  </th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t hover:bg-gray-50 transition [&>td]:px-4 [&>td]:py-3"
                    >
                      <td>
                        {product.images?.[0]?.src ? (
                          <img
                            src={product.images[0].src}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover border"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td className="text-gray-600">{product.sku}</td>
                      <td className="font-medium text-gray-800">
                        ${product.price}
                      </td>
                      <td>
                        <Link
                          to={`/?productId=${
                            product.id
                          }&productName=${encodeURIComponent(product.name)}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {product.orderCount || 0}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            limit={limit}
            total={pagination.total}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </>
      )}
    </div>
  );
};

export default ProductsPage;
