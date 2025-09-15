"use client";
import { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiHeart,
  FiLogOut,
  FiPackage,
  FiMenu,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [orders, setOrders] = useState(5);
  const [wishlist, setWishlist] = useState(3);
  const [totalSpend, setTotalSpend] = useState(500);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar is open by default

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-0 z-10 bg-gray-800 bg-opacity-50 md:hidden transition-transform duration-300`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-6 transition-transform duration-300 md:translate-x-0 md:w-64 md:block`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">User Panel</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-800"
          >
            <FiMenu className="text-3xl" />
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <a
                href="#"
                className="text-gray-800 hover:text-orange-500 block py-2 px-4 rounded-lg"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-800 hover:text-orange-500 block py-2 px-4 rounded-lg"
              >
                Orders
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-800 hover:text-orange-500 block py-2 px-4 rounded-lg"
              >
                Wishlist
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 block py-2 px-4 rounded-lg w-full text-left"
              >
                <FiLogOut className="inline mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          User Dashboard
        </h1>
        {user && (
          <h2 className="text-lg text-gray-600 mb-4">Welcome, {user.name}!</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FiPackage className="text-3xl text-orange-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold">Total Orders</h3>
              <p className="text-gray-600">{orders}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FiShoppingCart className="text-3xl text-orange-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold">Total Spend</h3>
              <p className="text-gray-600">${totalSpend}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FiHeart className="text-3xl text-orange-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold">Wishlist Items</h3>
              <p className="text-gray-600">{wishlist}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            View Orders
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Manage Wishlist
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserDashboard;
