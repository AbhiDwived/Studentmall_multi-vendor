"use client";

import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import Image from "next/image";
import WithAuth from "@/app/lib/utils/withAuth";
import { RootState } from "@/app/lib/redux/store";
import { useAppSelector } from "@/app/lib/redux/hook";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  id: string;
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
  id: string;
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

  const invoiceRef = useRef<HTMLDivElement>(null);
  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is not available.");
      setLoading(false);
      return;
    }
    fetchOrderDetails(orderId);
  }, [orderId]);

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

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;

    const style = document.createElement("style");
    style.innerHTML = `
      * {
        background-color: #ffffff !important;
        color: #000000 !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${order?.id.slice(-6)}.pdf`);
    } catch (err) {
      console.error("Invoice generation failed:", err);
      setError("Invoice download failed. Please try again.");
    } finally {
      document.head.removeChild(style);
    }
  };

  if (loading) return <Loading />;
  if (error)
    return <div className="text-center text-red-500 mt-6">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
        <button
          onClick={handleDownloadInvoice}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Download PDF
        </button>
      </div>

      {order && (
        <div
          ref={invoiceRef}
          className="bg-white p-8 shadow-xl rounded-md text-gray-800 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">CampusNeeds</h2>
              <p className="text-sm">www.CampusNeeds.com</p>
              <p className="text-sm">support@CampusNeeds.com</p>
            </div>
            <div className="text-sm text-right space-y-1">
              <p>
                <strong>Invoice ID:</strong> #{order.id.slice(-6)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping To:</h3>
              <p>{order.shippingDetails.fullName}</p>
              {order.shippingDetails.email && (
                <p>{order.shippingDetails.email}</p>
              )}
              {order.shippingDetails.phone && (
                <p>{order.shippingDetails.phone}</p>
              )}
              {order.shippingDetails.address && (
                <p>{order.shippingDetails.address}</p>
              )}
              <p>
                {[
                  order.shippingDetails.city,
                  order.shippingDetails.district,
                  order.shippingDetails.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="text-sm text-right md:text-left">
              <h3 className="text-lg font-semibold mb-2">Payment Summary:</h3>
              <p>Subtotal: ৳{order.totalAmount.toFixed(2)}</p>
              <p>Shipping: ৳{order.shippingCost.toFixed(2)}</p>
              <p className="font-bold text-lg">
                Total: ৳{order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Order Items</h3>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">
                    {item.productImage?.[0] ? (
                      <Image
                        src={item.productImage[0]}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">৳{item.price.toFixed(2)}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {order.shippingDetails.deliveryNote && (
            <div className="mt-6">
              <h4 className="font-semibold">Delivery Note:</h4>
              <p className="text-sm text-gray-700">
                {order.shippingDetails.deliveryNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <OrderDetails />
    </WithAuth>
  );
}
