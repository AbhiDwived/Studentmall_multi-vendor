"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import axios from "axios";
import Loading from "@/app/loading";
import SellerProfileForm from "./SellerProfileForm";

// Icons with consistent color
import {
  FaStore,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUserShield,
  FaPhoneAlt,
  FaEnvelope,
  FaBuilding,
  FaClipboardList,
} from "react-icons/fa";

const iconClass = "text-[#F6550C] inline-block mr-2";

interface SellerRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  additionalInfo?: string;
  status: "pending" | "approved" | "rejected";
  productType: string;
}

const SellerRequestPage = () => {
  const userInfo = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: userInfo?.user?.name || "",
    email: userInfo?.user?.email || "",
    phone: userInfo?.user?.phone || "",
    company: "",
    message: "",
    productType: "general",
  });

  const [existingRequest, setExistingRequest] = useState<SellerRequest | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!userInfo?.token) router.push("/login");
  }, [userInfo?.token, router]);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!userInfo?.user?._id) return setFetching(false);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller-request/my-requests`,
          { headers: { Authorization: `Bearer ${userInfo?.token}` } }
        );
        if (res.data?.data) setExistingRequest(res.data.data[0]);
      } catch (error) {
        console.error("Error fetching seller request:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchRequest();
  }, [userInfo?.token, userInfo?.user?._id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller-request/create`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          additionalInfo: formData.message,
          productType: formData.productType,
        },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      setExistingRequest(res.data.data);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStatusMessage = () => {
    if (!existingRequest) return null;

    switch (existingRequest.status) {
      case "pending":
        return (
          <div className="text-center text-yellow-600 font-medium flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin text-[#F6550C]" />
            Your request is currently <strong>pending</strong>. We’ll contact
            you shortly.
          </div>
        );
      case "approved":
        return (
          <>
            <div className="text-center text-green-700 font-semibold space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
                <FaCheckCircle className="text-[#F6550C]" />
                🎉 Congratulations, {userInfo?.user?.name}!
              </h2>
              <p>
                You are now an approved <strong>seller</strong> 🛍️
              </p>
              <p>We’ll share resources, tools, and updates soon.</p>
              <p className="text-orange-600 font-semibold">
                ⚠ Please <strong>log out and log back in</strong> to apply your
                new seller permissions securely.
              </p>

              <p className="text-sm text-red-500 italic">
                This helps us keep your account secure and up to date.
              </p>
            </div>
            <SellerProfileForm />
          </>
        );
      case "rejected":
        return (
          <div className="text-center text-red-600 font-medium flex items-center justify-center gap-2">
            <FaTimesCircle className="text-[#F6550C]" />
            Sorry, your request was <strong>rejected</strong>. Please contact
            support if you have any concerns.
          </div>
        );
    }
  };

  if (fetching) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F6550C] mb-6 text-center flex items-center justify-center gap-2">
          <FaStore className="text-[#F6550C]" />
          Become a Seller
        </h1>

        {existingRequest ? (
          renderStatusMessage()
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <p className="text-red-500 font-medium text-center">{errorMsg}</p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                <FaUserShield className={iconClass} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <FaEnvelope className={iconClass} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <FaPhoneAlt className={iconClass} />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6550C]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <FaBuilding className={iconClass} />
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6550C]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <FaClipboardList className={iconClass} />
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6550C]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <FaClipboardList className={iconClass} />
                Product Type
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6550C]"
              >
                <option value="general">General</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home-appliances">Home Appliances</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F6550C] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Submit Request
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerRequestPage;
