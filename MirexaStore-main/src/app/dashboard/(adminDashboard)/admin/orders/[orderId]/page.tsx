"use client";

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "next/navigation"; // ✅ Fix applied
import Loading from "@/app/loading";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import WithAuth from "@/app/lib/utils/withAuth";
import { RootState } from "@/app/lib/redux/store";
import { useAppSelector } from "@/app/lib/redux/hook";
import InvoiceSkeleton from "@/app/dashboard/(sellerDashboard)/seller/components/skeletons/InvoiceSkeleton";

interface ShippingDetails {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  country?: string;
  deliveryNote?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  productImages: string[];
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  sellerEmail: string;
  sellerName: string;
  productImage: string[];
  name: string;
  product?: Product | null;
}

interface Order {
  _id: string;
  shippingDetails: ShippingDetails;
  orderDate: string;
  grandTotal: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Canceled";
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  totalPrice: number;
  deliveryNote: string;
  discountApplied: number;
  isFirstOrderDiscountUsed: boolean;
}

const OrderDetails: React.FC = () => {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is not available.");
      setLoading(false);
      return;
    }
    fetchOrderDetails(orderId);
  }, [orderId]);

  const token = useAppSelector((state: RootState) => state.auth.token);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await Axios.get(
        `https://api.mirexastore.com/api/checkout/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderData: Order = response.data.data;

      const updatedItems = await Promise.all(
        orderData.items.map(async (item) => {
          try {
            const productRes = await Axios.get(
              `https://api.mirexastore.com/api/product/${item.productId}`
            );
            return { ...item, product: productRes.data.data };
          } catch {
            return { ...item, product: null };
          }
        })
      );

      setOrder({ ...orderData, items: updatedItems });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch order details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <InvoiceSkeleton></InvoiceSkeleton>;

  if (error)
    return <div className="text-center text-red-500 mt-6">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Order Details
      </h1>

      {order && (
        <div>
          {/* Shipping Details Section */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Shipping Details
            </h2>
            <div className="space-y-3 text-lg text-gray-700">
              <p>
                <strong>Name:</strong> {order.shippingDetails.fullName}
              </p>
              {order.shippingDetails.email && (
                <p>
                  <strong>Email:</strong> {order.shippingDetails.email}
                </p>
              )}
              {order.shippingDetails.phone && (
                <p>
                  <strong>Phone:</strong> {order.shippingDetails.phone}
                </p>
              )}
              {order.shippingDetails.address && (
                <p>
                  <strong>Address:</strong> {order.shippingDetails.address}
                </p>
              )}
              {order.shippingDetails.city && (
                <p>
                  <strong>City:</strong> {order.shippingDetails.city}
                </p>
              )}
              {order.shippingDetails.district && (
                <p>
                  <strong>District:</strong> {order.shippingDetails.district}
                </p>
              )}
              {order.shippingDetails.country && (
                <p>
                  <strong>Country:</strong> {order.shippingDetails.country}
                </p>
              )}
              {order.shippingDetails.deliveryNote && (
                <p>
                  <strong>Delivery Note:</strong>{" "}
                  {order.shippingDetails.deliveryNote}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="mb-6 border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Order Summary
              </h2>
              <p>
                <strong>Order ID:</strong> {order._id.slice(-6)}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center md:items-end mt-4 md:mt-0 space-y-2">
              <p className="text-lg text-gray-600">
                <strong>Price:</strong> ৳{order.totalAmount.toFixed(2)}
              </p>
              <p className="text-lg text-gray-600">
                <strong>Shipping Cost:</strong> ৳{order.shippingCost.toFixed(2)}
              </p>
              <p className="text-xl font-bold text-gray-900">
                <strong>Total Amount:</strong> ৳{order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Ordered Items Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Items Ordered
            </h2>
            <ul className="space-y-4">
              {order.items.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  {/* Product Image */}
                  {item.productImage?.[0] ? (
                    <Image
                      src={item.productImage[0]}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="object-cover rounded-md mr-4"
                      unoptimized
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md mr-4">
                      No Image
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex flex-col justify-between space-y-2">
                    <h3 className="font-semibold text-lg text-gray-700">
                      {item.name || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Price:</strong> ৳{item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <OrderDetails />
    </WithAuth>
  );
}
