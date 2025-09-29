"use client";
import WithAuth from "@/lib/utils/withAuth";
import Loading from "@/app/loading";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define Seller type
type Seller = {
  userEmail: string;
  brand: { name: string; slug: string };
  validTill: string; // ISO date string
};

function formatCountdown(diffMs: number) {
  if (diffMs <= 0) return "Expired";

  const seconds = Math.floor(diffMs / 1000) % 60;
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function SellerValidTill() {
  const token = useSelector((state: any) => state.auth.token);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extraDaysMap, setExtraDaysMap] = useState<Record<string, number | "">>(
    {}
  );
  const [now, setNow] = useState(Date.now());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchSellers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/all-sellers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch sellers");
        const data = await res.json();

        const normalizedSellers = data.data.map((seller: any) => ({
          ...seller,
          validTill: seller.validTill?.$date || seller.validTill,
        }));

        setSellers(normalizedSellers);
      } catch (err: any) {
        setError(err.message || "Error fetching sellers");
        toast.error(err.message || "Error fetching sellers", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
          style: { backgroundColor: "#F6550C", color: "white" },
        });
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchSellers();
  }, [token]);

  async function handleUpdateValidity(email: string) {
    const extraDays = extraDaysMap[email];

    if (extraDays === "" || extraDays === undefined || extraDays === 0) {
      toast.warn("Please enter a valid number of days.", {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
        style: { backgroundColor: "#F6550C", color: "white" },
      });
      return;
    }

    setUpdatingEmail(email);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/extend-validity/${email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ extraDays }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update validity");
      }

      const updatedSeller = await res.json();
      const newValidTill =
        updatedSeller.validTill?.$date || updatedSeller.validTill;

      setSellers((prev) =>
        prev.map((seller) =>
          seller.userEmail === email
            ? { ...seller, validTill: newValidTill }
            : seller
        )
      );

      toast.success(
        `${extraDays > 0 ? "Extended" : "Reduced"} validity by ${Math.abs(
          extraDays
        )} day(s) for ${email}`,
        {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
          style: { backgroundColor: "#F6550C", color: "white" },
        }
      );

      setExtraDaysMap((prev) => ({ ...prev, [email]: "" }));
    } catch (err: any) {
      setError(err.message || "Update error");
      toast.error(err.message || "Update error", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        style: { backgroundColor: "#F6550C", color: "white" },
      });
    } finally {
      setUpdatingEmail(null);
    }
  }

  if (loading) return <Loading />;

  const filteredSellers = sellers.filter(({ brand, userEmail }) => {
    const term = searchTerm.toLowerCase();
    return (
      brand.name.toLowerCase().includes(term) ||
      userEmail.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer
        theme="colored"
        toastStyle={{ backgroundColor: "#F6550C", color: "white" }}
      />

      <h1 className="text-center text-3xl font-bold text-gray-900 mb-6">
        Seller Validity Management
      </h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by brand or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F6550C] focus:border-[#F6550C]"
        />
      </div>

      {filteredSellers.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No sellers found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Valid Till
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Time Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Adjust Validity (days)
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredSellers.map(({ userEmail, brand, validTill }) => {
                const expiryTime = new Date(validTill).getTime();
                const diffMs = expiryTime - now;
                const isExpired = diffMs <= 0;

                return (
                  <tr
                    key={userEmail}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {brand.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700 break-words max-w-xs">
                      {userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(validTill).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        isExpired ? "text-red-600" : "text-[#F6550C]"
                      }`}
                    >
                      {formatCountdown(diffMs)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min={-365}
                        max={3650}
                        value={extraDaysMap[userEmail] ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExtraDaysMap((prev) => ({
                            ...prev,
                            [userEmail]: val === "" ? "" : Number(val),
                          }));
                        }}
                        disabled={updatingEmail === userEmail}
                        placeholder="e.g. 30 or -15"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F6550C] focus:border-[#F6550C]"
                      />
                      <p className="text-xs text-gray-400 mt-1 select-none">
                        Negative to reduce days
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleUpdateValidity(userEmail)}
                        disabled={
                          updatingEmail === userEmail ||
                          extraDaysMap[userEmail] === "" ||
                          extraDaysMap[userEmail] === 0 ||
                          extraDaysMap[userEmail] === undefined
                        }
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6550C] ${
                          updatingEmail === userEmail
                            ? "bg-[#F6550C]/50 cursor-not-allowed"
                            : "bg-[#F6550C] hover:bg-[#cc4909]"
                        }`}
                      >
                        {updatingEmail === userEmail ? "Updating..." : "Update"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <SellerValidTill />
    </WithAuth>
  );
}
