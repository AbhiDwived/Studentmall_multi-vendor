"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "axios";
import Loading from "@/app/loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WithAuth from "@/app/lib/utils/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import { useAppSelector } from "@/app/lib/redux/hook";
import SellerOrderSkeleton from "../components/skeletons/SellerOrderSkeleton";

interface ShippingDetails {
  fullName: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface Order {
  adminBkashStatus: string;
  transactionId: string;
  paymentMethod: string;
  id: string;
  shippingDetails: ShippingDetails;
  orderDate: string;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Canceled";
}

const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const router = useRouter();

  const auth = useAppSelector((state) => state.auth);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    if (userRole !== "seller") {
      setError("Access denied. sellers only.");
      setLoading(false);
      return;
    }

    fetchOrders();
  }, []);

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

      const allOrders = response.data.data;
      const userEmail = auth?.user?.email;

      const sellerOrders = allOrders.filter((order: any) =>
        order.items.some((item: any) => item.sellerEmail === userEmail)
      );

      setOrders(sellerOrders);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      let newStatus = "";

      if (currentStatus === "Pending") {
        newStatus = "Processing";
      } else if (currentStatus === "Processing") {
        newStatus = "Shipped";
      } else if (currentStatus === "Shipped") {
        newStatus = "Delivered";
      }

      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    toast.info(
      <div>
        <p className="font-semibold">
          Are you sure you want to cancel this order?
        </p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={async () => {
              try {
                const loadingToastId = toast.loading("Cancelling order...");

                if (!token) return;

                await Axios.delete(
                  `${process.env.NEXT_PUBLIC_API_URL}/checkout/${orderId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                toast.update(loadingToastId, {
                  render: "✅ Order canceled successfully!",
                  type: "success",
                  isLoading: false,
                  autoClose: 10000,
                });

                fetchOrders();
              } catch (err) {
                toast.error("❌ Failed to cancel order. Please try again.");
              }

              toast.dismiss();
            }}
          >
            Yes
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // ✅✅ NEW FUNCTION: Courier Request
  const courierRequest = async (orderId: string) => {
    let loadingToastId: string | number | undefined;

    try {
      // Check if the user is logged in
      if (!token || !auth?.user?.email) {
        toast.error("❌ You must be logged in to request a courier.");
        return;
      }

      loadingToastId = toast.loading("Requesting Courier...");

      // 1. Fetch Order details
      const { data: orderRes } = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = orderRes?.data;
      if (!order) {
        throw new Error(
          "Order details not found. Please check the order ID and try again."
        );
      }

      // 2. Fetch seller Profile
      const { data: sellerRes } = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${auth.user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const seller = sellerRes?.data;
      if (!seller || !seller.brand) {
        throw new Error(
          "seller profile not found or incomplete. Please check the profile details."
        );
      }

      // 3. Build Courier Payload
      const courierPayload = {
        orderId: order.id,
        customer: {
          fullName: order.shippingDetails.fullName,
          phone: order.shippingDetails.phone,
          email: order.shippingDetails.email,
          address: order.shippingDetails.address,
          city: order.shippingDetails.city,
          district: order.shippingDetails.district,
          country: order.shippingDetails.country,
          deliveryNote: order.shippingDetails.deliveryNote || "",
        },
        seller: {
          name: seller.brand.name || "",
          email: seller.userEmail || "",
          phone: seller.brand.phone || "",
          location: seller.brand.location || "",
          whatsapp: seller.brand.whatsapp || "",
          socialLinks: {
            facebook: seller.brand.socialLinks?.facebook || "",
            instagram: seller.brand.socialLinks?.instagram || "",
          },
        },
        codAmount: order.totalPrice,
        orderItems: order.items.map((item: any) => ({
          productName: item?.name || "Unknown Product", // Default to "Unknown Product" if name is missing
          quantity: item?.quantity || 1,
          price: item?.price || 0,
          color: item?.color || "Not specified",
          size: item?.size || "Not specified",
          productImage: Array.isArray(item.productImage)
            ? item.productImage
            : [item.productImage || "No image available"], // always array
        })),
      };

      console.log("Courier Payload:", JSON.stringify(courierPayload, null, 2));

      // 4. Send Courier Request
      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/courier/request`,
        courierPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (loadingToastId) {
        toast.update(loadingToastId, {
          render: "✅ Courier Requested Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      console.error("API Error:", err?.response?.data || err);

      // Handle MongoDB duplicate key error
      let errorMessage = "❌ Something went wrong. Please try again later.";

      if (err?.response?.data?.code === 11000) {
        errorMessage =
          "⚠️ This order has already been processed for a courier. Please check the status or contact support for more details.";
      } else if (err?.response?.data?.message) {
        errorMessage = err?.response?.data?.message;
      }

      // Provide a more user-friendly error message in the toast
      if (loadingToastId) {
        toast.update(loadingToastId, {
          render: `${errorMessage}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.error(`${errorMessage}`);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesQuery = order.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  if (loading) return <SellerOrderSkeleton></SellerOrderSkeleton>;
  if (error)
    return (
      <div className="text-center text-red-500">
        {error} <br />
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-900">
        Seller Order Management
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          aria-label="Search by Order ID"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          aria-label="Filter by Status"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Order ID",
                "Customer",
                "Date",
                "Total",
                "Status",
                "Payment Method",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-500 italic"
                >
                  কোনো অর্ডার পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Order ID */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-indigo-600">
                    #{order.id.slice(-6)}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    {order.shippingDetails.fullName}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-center">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 text-center font-semibold">
                    ৳{order.totalPrice.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block py-1 px-3 rounded-full text-xs font-semibold ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Shipped"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4 text-center">
                    {["bkash", "adminBkash"].includes(order.paymentMethod) ? (
                      <div className="flex flex-col items-center space-y-1">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            order.paymentMethod === "adminBkash"
                              ? "bg-purple-200 text-purple-900"
                              : "bg-pink-200 text-pink-900"
                          }`}
                        >
                          {order.paymentMethod === "adminBkash"
                            ? "Bkash (Admin)"
                            : "Bkash"}
                        </span>

                        {order.paymentMethod === "adminBkash" && (
                          <div className="flex space-x-1 text-[10px] text-purple-800">
                            <span className="bg-purple-300 px-2 py-0.5 rounded-full font-medium">
                              Paid to Admin
                            </span>
                            {order.adminBkashStatus === "paidToSeller" && (
                              <span className="flex items-center gap-1 bg-green-300 px-2 py-0.5 rounded-full font-medium text-green-900">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Paid to Seller
                              </span>
                            )}
                          </div>
                        )}

                        {/* Only show transactionId & copy button if paymentMethod is "bkash" */}
                        {order.paymentMethod === "bkash" && (
                          <div className="flex items-center space-x-2 mt-1">
                            <code className="bg-gray-100 text-gray-800 font-mono text-sm px-3 py-1 rounded select-all break-words max-w-[150px]">
                              {order.transactionId || "N/A"}
                            </code>

                            {order.transactionId && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    order.transactionId
                                  );
                                  setCopiedOrderId(order.id);
                                  setTimeout(
                                    () => setCopiedOrderId(null),
                                    2000
                                  );
                                }}
                                title="কপি করুন"
                                className="text-xs bg-pink-600 hover:bg-pink-700 text-white rounded px-3 py-1 transition"
                              >
                                কপি
                              </button>
                            )}
                          </div>
                        )}

                        {copiedOrderId === order.id && (
                          <div className="relative">
                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow whitespace-nowrap pointer-events-none">
                              কপি হয়েছে!
                            </div>
                          </div>
                        )}

                        {order.paymentMethod === "bkash" &&
                          order.adminBkashStatus === "paidToSeller" && (
                            <span className="flex items-center gap-1 text-[10px] font-medium bg-green-200 text-green-900 rounded-full px-3 py-1 mt-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Paid to Seller
                            </span>
                          )}
                      </div>
                    ) : (
                      <span className="text-gray-700 font-medium">COD</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-6 text-center space-x-2">
                    {order.status !== "Delivered" &&
                      order.status !== "Canceled" && (
                        <>
                          {/* Update Status Buttons */}
                          {order.status === "Pending" && (
                            <button
                              className="text-xs bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                              onClick={() =>
                                updateOrderStatus(order.id, "Pending")
                              }
                            >
                              Processing
                            </button>
                          )}
                          {order.status === "Processing" && (
                            <>
                              <button
                                className="text-xs bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600"
                                onClick={() =>
                                  updateOrderStatus(order.id, "Processing")
                                }
                              >
                                Shipped
                              </button>
                              {/* Courier Request Button */}
                              <button
                                className="text-xs bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600"
                                onClick={() => courierRequest(order.id)}
                              >
                                Courier Req
                              </button>
                            </>
                          )}
                          {order.status === "Shipped" && (
                            <button
                              className="text-xs bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                              onClick={() =>
                                updateOrderStatus(order.id, "Shipped")
                              }
                            >
                              Delivered
                            </button>
                          )}
                        </>
                      )}

                    {order.status !== "Delivered" && (
                      <button
                        className="text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        onClick={() => deleteOrder(order.id)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="text-xs bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                      onClick={() => router.push(`orders/${order.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <SellerOrders />
    </WithAuth>
  );
}
