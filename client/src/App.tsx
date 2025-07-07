import { Route, Routes } from "react-router-dom";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OrdersPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
