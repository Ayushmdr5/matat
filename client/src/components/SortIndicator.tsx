import React from "react";

interface SortIndicatorProps {
  active: boolean;
  order: "asc" | "desc";
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ active, order }) => {
  if (active) {
    return (
      <span className="inline-block ml-1 text-blue-600 font-bold">
        {order === "asc" ? "↑" : "↓"}
      </span>
    );
  }
  // dash when inactive but sortable
  return <span className="inline-block ml-1 text-gray-700">-</span>;
};

export default SortIndicator;
