import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayouts";
import HomePage from "../pages/Homepage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/LoginPage";


//路由表
const router = createHashRouter([
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
export default router;