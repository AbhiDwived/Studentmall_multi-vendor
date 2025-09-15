"use client";

import { useEffect, useState } from "react";
import Axios from "axios";
import {
  FaDollarSign,
  FaBox,
  FaCalendarDay,
  FaHourglassHalf,
  FaShippingFast,
  FaTruck,
} from "react-icons/fa";
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

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const UserAnalytics = () => {
  const auth = useAppSelector((state: { auth: any }) => state.auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalSpend, setTotalSpend] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [statusCount, setStatusCount] = useState({
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
  });

  const [filter, setFilter] = useState("monthly");
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userEmail = auth?.user?.email;
        const allOrders = response.data.data;
        const relevantOrders = allOrders.filter(
          (order: any) => order?.shippingDetails?.email === userEmail
        );

        const today = new Date().toDateString();
        let spend = 0,
          todayCount = 0;
        const statusMap: any = { Processing: 0, Shipped: 0, Delivered: 0 };
        const dailyMap: any = {};
        const weeklyMap: any = {};
        const monthlyMap: any = {};

        relevantOrders.forEach((order: any) => {
          const date = new Date(order.createdAt);
          const orderDay = date.toDateString();
          const week = new Date(
            date.setDate(date.getDate() - date.getDay())
          ).toLocaleDateString();
          const month = date.toLocaleString("default", { month: "short" });

          spend += order.grandTotal;
          if (orderDay === today) todayCount++;

          if (statusMap[order.status] !== undefined) {
            statusMap[order.status]++;
          }

          if (!dailyMap[orderDay]) dailyMap[orderDay] = order.grandTotal;
          else dailyMap[orderDay] += order.grandTotal;

          if (!weeklyMap[week]) weeklyMap[week] = order.grandTotal;
          else weeklyMap[week] += order.grandTotal;

          if (!monthlyMap[month]) monthlyMap[month] = order.grandTotal;
          else monthlyMap[month] += order.grandTotal;
        });

        const selectedMap =
          filter === "daily"
            ? dailyMap
            : filter === "weekly"
            ? weeklyMap
            : monthlyMap;

        const sortedKeys = Object.keys(selectedMap).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        setChartData({
          labels: sortedKeys,
          datasets: [
            {
              label: "Total Spend (৳)",
              data: sortedKeys.map((k) => selectedMap[k]),
              backgroundColor: "#10b981",
            },
          ],
        });

        setStatusCount(statusMap);
        setTotalSpend(spend);
        setTotalOrders(relevantOrders.length);
        setTodayOrders(todayCount);
        setOrders(relevantOrders);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth?.user?.email, filter]);

  if (loading)
    return (
      <div className="text-center mt-10">
        <Loading />
      </div>
    );
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        User Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card
          icon={<FaDollarSign />}
          title="Total Spend"
          value={`৳ ${totalSpend}`}
          color="text-blue-600"
        />
        <Card
          icon={<FaBox />}
          title="Total Orders"
          value={totalOrders.toString()}
          color="text-green-600"
        />
        <Card
          icon={<FaCalendarDay />}
          title="Today's Orders"
          value={todayOrders.toString()}
          color="text-purple-600"
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-center">
        <Card
          icon={<FaHourglassHalf />}
          title="Processing"
          value={statusCount.Processing.toString()}
          color="text-orange-500"
        />
        <Card
          icon={<FaShippingFast />}
          title="Shipped"
          value={statusCount.Shipped.toString()}
          color="text-yellow-500"
        />
        <Card
          icon={<FaTruck />}
          title="Delivered"
          value={statusCount.Delivered.toString()}
          color="text-green-500"
        />
      </div>

      {/* Sales Chart */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Spending History ({filter})
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm text-gray-600"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <Bar data={chartData} />
      </div>

      {/* Recent Orders */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          📦 Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{order._id.slice(-6)}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">৳ {order.grandTotal}</td>
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
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

export default UserAnalytics;
