"use client";

import WithAuth from "@/app/lib/utils/withAuth";
import { useEffect, useState } from "react";
import Axios from "axios";
import { FaDollarSign, FaBox, FaChartLine, FaUsers } from "react-icons/fa";
import { useAppSelector } from "@/app/lib/redux/hook";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import Loading from "@/app/loading";
import SkeletonCard from "../../components/SkeletonCard";
import Skeleton from "react-loading-skeleton";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const AdminAnalytics = () => {
  const auth = useAppSelector((state: { auth: any }) => state.auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [uniqueSellers, setUniqueSellers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // Track total users
  const [totalsellers, setTotalsellers] = useState(0); // Track total sellers
  const [sellerSalesMap, setSellerSalesMap] = useState<any>({});
  const [sellerStatusMap, setSellerStatusMap] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", bannerImage: "" });

  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // You can change this to any value for pagination

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const [ordersResponse, usersResponse] = await Promise.all([
          Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const allOrders = ordersResponse.data.data;
        const allUsers = usersResponse.data.data;

        const sellerMap: any = {};
        const sellerStatus: any = {}; // Track status for each seller
        let totalAmount = 0;
        let totalItemCount = 0;
        let totalUniqueSellers = new Set<string>();

        // Track sellers by their email
        const sellerEmails = new Set<string>();

        allOrders.forEach((order: any) => {
          order.items.forEach((item: any) => {
            const sellerEmail = item.sellerEmail;
            if (sellerEmail) {
              sellerEmails.add(sellerEmail); // Collect sellers

              totalAmount += item.price * item.quantity;
              totalItemCount += item.quantity;
              totalUniqueSellers.add(sellerEmail);

              const sellerKey = sellerEmail;
              if (!sellerMap[sellerKey]) sellerMap[sellerKey] = 0;
              sellerMap[sellerKey] += item.price * item.quantity;

              // Update seller order status counts
              if (!sellerStatus[sellerKey]) {
                sellerStatus[sellerKey] = {
                  delivered: 0,
                  Processing: 0,
                  Shipped: 0,
                };
              }

              if (order.status === "Delivered") {
                sellerStatus[sellerKey].delivered += item.quantity;
              } else if (order.status === "Processing") {
                sellerStatus[sellerKey].Processing += item.quantity;
              } else if (order.status === "Shipped") {
                sellerStatus[sellerKey].Shipped += item.quantity;
              }
            }
          });
        });

        // Count total users and sellers
        setTotalUsers(allUsers.length);

        // Filter users with role "seller" and set total sellers
        const sellers = allUsers.filter(
          (user: { role: string }) => user.role === "seller"
        );
        setTotalsellers(sellers.length);

        setOrders(allOrders);
        setUsers(allUsers);
        setTotalSales(totalAmount);
        setTotalOrders(allOrders.length);
        setTotalProductsSold(totalItemCount);
        setUniqueSellers(totalUniqueSellers.size);
        setSellerSalesMap(sellerMap);
        setSellerStatusMap(sellerStatus);
        
        // Fetch categories
        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data || []);

        const sellerLabels = Object.keys(sellerMap);
        const sellerData = Object.values(sellerMap);

        setChartData({
          labels: sellerLabels,
          datasets: [
            {
              label: "Sales by Seller (₹)",
              data: sellerData,
              backgroundColor: "#F97316",
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    if (auth?.user?.role === "admin") {
      fetchOrdersAndUsers();
    } else {
      setError("You are not authorized to view this page.");
    }
  }, [auth?.user?.role]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Admin Analytics Dashboard
        </h1>

        {/* Skeleton for summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>

        {/* Skeleton for charts and tables */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
          <div className="mb-4">
            <Skeleton style={{ height: 32, width: 200 }} />
          </div>
          <Skeleton style={{ height: 200 }} />
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
          <div className="mb-4">
            <Skeleton style={{ height: 32, width: 250 }} />
          </div>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} style={{ height: 24 }} className="mb-2" />
          ))}
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
          <div className="mb-4">
            <Skeleton style={{ height: 32, width: 250 }} />
          </div>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} style={{ height: 24 }} className="mb-2" />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination Handler
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      alert("Name and slug are required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      });
      
      if (response.ok) {
        alert("Category created successfully!");
        setNewCategory({ name: "", slug: "", bannerImage: "" });
        setShowCategoryForm(false);
        // Refresh categories
        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      alert("Failed to create category");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Category deleted successfully!");
      // Refresh categories
      const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.data || []);
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Admin Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card
          icon={<FaDollarSign />}
          title="Total Sales"
          value={`₹ ${totalSales}`}
          color="text-blue-600"
        />
        <Card
          icon={<FaBox />}
          title="Total Orders"
          value={totalOrders.toString()}
          color="text-green-600"
        />
        <Card
          icon={<FaChartLine />}
          title="Products Sold"
          value={totalProductsSold.toString()}
          color="text-yellow-600"
        />
        <Card
          icon={<FaUsers />}
          title="Total Users"
          value={totalUsers.toString()}
          color="text-red-600"
        />
        <Card
          icon={<FaUsers />}
          title="Total sellers"
          value={totalsellers.toString()}
          color="text-teal-600"
        />
      </div>

      {/* Sales Chart */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          📈 Sales by Seller
        </h2>
        <Bar data={chartData} />
      </div>

      {/* seller Users Table */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          👤 seller Information
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers
                .filter((user) => user.role === "seller") // Only show sellers
                .map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    <td className="px-4 py-2">{user.address}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastUser >= users.length}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          👤 Users Information
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers
                .filter((user) => user.role === "user") // Only show sellers
                .map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    <td className="px-4 py-2">{user.address}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastUser >= users.length}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* Seller Product Status */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          📦 Product Status by Seller
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Products Sold</th>
                <th className="px-4 py-2">Delivered</th>
                <th className="px-4 py-2">Processing</th>
                <th className="px-4 py-2">Shipped</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sellerSalesMap).map((sellerEmail, index) => {
                const soldProducts = sellerSalesMap[sellerEmail];
                const { delivered, Processing, Shipped } =
                  sellerStatusMap[sellerEmail];

                return (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{sellerEmail}</td>
                    <td className="px-4 py-2">{soldProducts}</td>
                    <td className="px-4 py-2">{delivered}</td>
                    <td className="px-4 py-2">{Processing}</td>
                    <td className="px-4 py-2">{Shipped}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Card = ({
  icon,
  title,
  value,
  color,
}: {
  icon: JSX.Element;
  title: string;
  value: string;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
    <div className="flex items-center mb-3 text-xl font-semibold text-gray-700 gap-3">
      <span className={`text-2xl ${color}`}>{icon}</span>
      <h2>{title}</h2>
    </div>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <AdminAnalytics />
    </WithAuth>
  );
}
