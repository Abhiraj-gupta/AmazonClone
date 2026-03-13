import { Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import AmazonChatBot from "./components/AmazonChatBot";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import CustomerService from "./pages/CustomerService";
import TodaysDeals from "./pages/TodaysDeals";
import NewReleases from "./pages/NewReleases";
import Sell from "./pages/Sell";

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
      <ToastProvider>
        <AmazonChatBot />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/deals" element={<TodaysDeals />} />
            <Route path="/new-releases" element={<NewReleases />} />
            <Route path="/sell" element={<Sell />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
