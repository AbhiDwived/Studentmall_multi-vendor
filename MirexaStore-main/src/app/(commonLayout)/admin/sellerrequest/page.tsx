"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingCard from "../../components/ui/LoadingCard";
import Loading from "@/app/loading";

// Define types
interface sellerRequest {
  _id: string;
  productType: string;
  phone?: string;
  additionalInfo: string;
  status: "pending" | "approved" | "rejected";
  user: {
    name: string;
    email: string;
  };
}

const AdminSellerRequests: React.FC = () => {
  const [requests, setRequests] = useState<sellerRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<sellerRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get<{ data: sellerRequest[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/seller-request/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sortedRequests = response.data.data.sort((a, b) => {
          const statusOrder: Record<sellerRequest["status"], number> = {
            pending: 0,
            approved: 1,
            rejected: 2,
          };
          return statusOrder[a.status] - statusOrder[b.status];
        });

        setRequests(sortedRequests);
        setFilteredRequests(sortedRequests);
      } catch (error) {
        console.error("Error fetching seller requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRequests();
    } else {
      console.error("No token found");
      setLoading(false);
    }
  }, [token]);

  // Filter logic
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = requests.filter(
      (req) =>
        req.status.toLowerCase().includes(term) ||
        req.user?.email?.toLowerCase().includes(term) ||
        req.user?.name?.toLowerCase().includes(term)
    );
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const handleApprove = async (requestId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/seller-request/approve/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "approved" } : req
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/seller-request/reject/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "rejected" } : req
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (loading)
    return (
      <div>
        <Loading></Loading>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage seller Requests</h1>

      <input
        type="text"
        placeholder="Search by email, name or status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full px-4 py-2 border rounded-md shadow-sm"
      />

      {filteredRequests.length === 0 ? (
        <p>No seller requests found.</p>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request._id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{request.productType}</h2>
              <p className="text-gray-700">Phone: {request.phone}</p>
              <p className="text-gray-700">
                Additional Info: {request.additionalInfo}
              </p>
              <p className="text-gray-700">
                <strong>User:</strong> {request.user?.name} (
                {request.user?.email})
              </p>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : request.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status}
                </span>
              </div>
              {request.status === "pending" && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSellerRequests;
