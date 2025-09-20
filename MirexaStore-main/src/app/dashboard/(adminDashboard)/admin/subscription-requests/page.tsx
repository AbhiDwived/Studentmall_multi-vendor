"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import WithAuth from "@/app/lib/utils/withAuth";
import Loading from "@/app/loading";
import SubscriptionRequestsSkeleton from "../components/skeleton/SubscriptionRequestsSkeleton";

interface SubscriptionRequest {
  _id: string;
  sellerEmail: string;
  sellerName: string;
  planTitle: string;
  price: number;
  paymentMethod: string;
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

function SubscriptionRequestsPage() {
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const token = useSelector((state: any) => state.auth.token);

  const fetchRequests = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(res.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/${action}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Request ${action}d successfully`);

      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to ${action} request`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage Subscription Requests
      </h1>

      <button
        onClick={fetchRequests}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Refresh
      </button>

      {loading ? (
        <SubscriptionRequestsSkeleton></SubscriptionRequestsSkeleton>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500">
          No pending subscription requests.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {req.planTitle} —{" "}
                    <span className="text-orange-600 font-bold">
                      ₹{req.price}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Seller:</span>{" "}
                    {req.sellerName} ({req.sellerEmail})
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Payment:</span>{" "}
                    {req.paymentMethod.toUpperCase()} — TXN:{" "}
                    <span className="font-mono">{req.transactionId}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested on: {formatDate(req.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAction(req._id, "approve")}
                    disabled={!!actionLoading}
                    className={`flex items-center border border-green-500 text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-md text-sm ${
                      actionLoading === req._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    disabled={!!actionLoading}
                    className={`flex items-center border border-red-500 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm ${
                      actionLoading === req._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export default protected page component wrapping SubscriptionRequestsPage with WithAuth
export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <SubscriptionRequestsPage />
    </WithAuth>
  );
}
