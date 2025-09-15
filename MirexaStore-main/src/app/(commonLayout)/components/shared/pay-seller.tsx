"use client";

import { Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";

type Order = {
  _id: string;
  paymentMethod: string;
  adminBkashStatus?: string;
  transactionId?: string;
};

interface PaymentCellProps {
  order: Order;
  refetch: () => void;
}

const PaymentCell = ({ order, refetch }: PaymentCellProps) => {
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleCopy = async (text: string, orderId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    toast
      .promise(
        axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/checkout/pay-seller/${orderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        {
          loading: "Marking as paid...",
          success: "Marked as paid to seller!",
          error: "Failed to mark as paid.",
        }
      )
      .then(() => refetch());
  };

  const showMarkPaidBtn =
    user?.role === "admin" &&
    order?.paymentMethod === "adminBkash" &&
    order?.adminBkashStatus !== "paidToSeller";

  return (
    <td className="py-3 px-4 text-center">
      {["bkash", "adminBkash"].includes(order.paymentMethod) ? (
        <div className="flex flex-col items-center space-y-1">
          <span
            className={`font-semibold ${
              order.paymentMethod === "adminBkash"
                ? "text-purple-600"
                : "text-pink-600"
            }`}
          >
            {order.paymentMethod === "adminBkash" ? "Bkash (Admin)" : "Bkash"}
          </span>

          {order.paymentMethod === "adminBkash" && (
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
              Paid to Admin
            </span>
          )}

          <div className="flex items-center gap-1">
            <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
              {order.transactionId || "N/A"}
            </span>
            {order.transactionId && (
              <div className="relative">
                <button
                  onClick={() => handleCopy(order.transactionId!, order._id)}
                  className="text-pink-600 hover:text-pink-800 transition"
                  aria-label="Copy Transaction ID"
                >
                  <Copy className="w-4 h-4" strokeWidth={2} />
                </button>

                <AnimatePresence>
                  {copiedOrderId === order._id && (
                    <motion.div
                      key="tooltip"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow z-10 whitespace-nowrap"
                    >
                      কপি হয়েছে!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {showMarkPaidBtn && (
            <button
              onClick={() => handleMarkAsPaid(order._id)}
              className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1 font-semibold hover:bg-green-200 transition"
            >
              Mark as Paid to Seller
            </button>
          )}
        </div>
      ) : (
        <span className="text-gray-800 font-medium">Cash on Delivery</span>
      )}
    </td>
  );
};

export default PaymentCell;
