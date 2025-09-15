"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  CreditCard,
  Clock,
  Loader2,
  Wallet,
  XCircle,
  Flame,
  Star,
} from "lucide-react";
import { useSelector } from "react-redux";
import Loading from "@/app/loading";
import WithAuth from "@/app/lib/utils/withAuth";
import clsx from "clsx";
import CountUp from "@/app/(commonLayout)/components/reactbit/CountUp/CountUp";
import SubscriptionSkeleton from "../components/skeletons/subscriptionSkeleton";

interface Plan {
  features: any;
  description: ReactNode;
  badgeColor: any;
  hot: any;
  popular: any;
  _id: string;
  title: string;
  days: number;
  price: number;
}

interface Request {
  updatedAt: string | number | Date;
  _id: string;
  planTitle: string;
  status: "pending" | "approved" | "rejected";
  paymentMethod: string;
  transactionId: string;
}

const SubscriptionSeller = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const [copiedId, setCopiedId] = useState<null | string | number>(null);
  const [isPlansLoading, setIsPlansLoading] = useState(false);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);

  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);
  const email = useSelector((state: any) => state.auth.user?.email);
  const handleCopy = (text: string, id: string | number): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // 2 সেকেন্ড পরে রিমুভ
    });
  };

  useEffect(() => {
    setIsPlansLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/subscription/plans`)
      .then((res) => {
        setPlans(res.data.data);
      })
      .catch((err) => console.error("Plans fetch error", err))
      .finally(() => setIsPlansLoading(false));
  }, []);

  useEffect(() => {
    if (!token) return;
    setIsRequestsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/subscription/my-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRequests(res.data.data);
      })
      .catch((err) => console.error("Requests fetch error", err))
      .finally(() => setIsRequestsLoading(false));
  }, [token]);

  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${email}`
        );
        const validTill = new Date(res.data.data.validTill);
        const now = new Date();

        const diffTime = validTill.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffTime <= 0) {
          setIsExpired(true);
          setDaysLeft(0);
        } else {
          setIsExpired(false);
          setDaysLeft(diffDays);
          startCountdown(validTill);
        }
      } catch (error) {
        console.error("Error fetching seller profile", error);
      }
    };

    fetchProfile();
  }, [email]);

  const startCountdown = (targetDate: Date) => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        setCountdown("Expired");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      await toast.promise(
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/subscription/request`,
          {
            planId: selectedPlan._id,
            planTitle: selectedPlan.title,
            price: selectedPlan.price,
            paymentMethod,
            transactionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        {
          loading: <Loading></Loading>,
          success: "Request submitted!",
          error: (err: any) =>
            err?.response?.data?.message || "Something went wrong",
        }
      );

      setPaymentMethod("");
      setTransactionId("");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/my-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data.data);
    } catch (error) {}
  };
  if (isPlansLoading || isRequestsLoading) {
    return <SubscriptionSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <Toaster position="top-center" />

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
        Manage Your Subscription
      </h1>

      {daysLeft !== null && (
        <div className="text-center mb-10">
          <div
            className={`inline-block px-8 py-5 rounded-2xl border shadow-sm transition-all bg-white ${
              isExpired ? "border-red-200" : "border-green-200"
            }`}
          >
            {isExpired ? (
              <div className="flex items-center justify-center text-red-600 gap-2">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold text-base">
                  Your subscription has expired!
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-green-600 text-base font-medium flex items-center justify-center gap-1">
                  <CheckCircle className="w-5 h-5" />
                  Active Subscription
                </p>
                <p className="text-gray-800 font-semibold text-lg">
                  <CountUp to={daysLeft} duration={1.2} className="inline" />{" "}
                  day{daysLeft !== 1 ? "s" : ""} remaining
                </p>

                <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Live Countdown:{" "}
                  <span className="font-medium">{countdown}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plans Section */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
        Choose a Subscription Plan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan?._id === plan._id;

          return (
            <div
              key={plan._id}
              onClick={() => setSelectedPlan(plan)}
              className={clsx(
                "group relative p-6 rounded-2xl border cursor-pointer transition-all duration-200 ease-in-out bg-white shadow-sm hover:shadow-lg",
                isSelected
                  ? "border-[#F6550C] bg-orange-50 shadow-md"
                  : "border-gray-200"
              )}
            >
              {/* Checkmark Icon */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-[#F6550C] text-white rounded-full p-1 shadow">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}

              <div className="flex flex-col items-start space-y-3">
                {/* Badge */}
                {(plan.popular || plan.hot) && (
                  <span
                    className={clsx(
                      "px-3 py-1 text-sm rounded-full font-semibold text-white inline-flex items-center gap-1",
                      {
                        "bg-blue-600": plan.badgeColor === "blue",
                        "bg-orange-600": plan.badgeColor === "orange",
                        "bg-red-600": plan.badgeColor === "red",
                        "bg-green-600": plan.badgeColor === "green",
                        "bg-gray-600":
                          !plan.badgeColor || plan.badgeColor === "gray",
                      }
                    )}
                  >
                    {plan.hot ? (
                      <>
                        <Flame className="w-4 h-4" /> Hot
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" /> Popular
                      </>
                    )}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#F6550C] transition">
                  {plan.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600">{plan.description}</p>

                {/* Features */}
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mt-2">
                  {plan.features?.map(
                    (
                      feature:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined,
                      idx: Key | null | undefined
                    ) => (
                      <li key={idx}>{feature}</li>
                    )
                  )}
                </ul>

                {/* Duration */}
                <p className="text-gray-600 mt-3">
                  📅 Duration: <strong>{plan.days} days</strong>
                </p>

                {/* Price */}
                <p className="text-2xl font-bold text-gray-900">
                  ৳{plan.price.toFixed(2)}
                </p>
              </div>

              {/* Select Button */}
              <div className="mt-6">
                <button
                  className={clsx(
                    "w-full text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200",
                    isSelected
                      ? "bg-[#F6550C] text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                >
                  {isSelected ? "Selected" : "Choose Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="mt-12 max-w-2xl mx-auto bg-white border rounded-2xl p-6 shadow space-y-6">
          <Toaster position="top-center" reverseOrder={false} />
          <h2 className="text-xl font-semibold text-gray-800">
            Subscribe to{" "}
            <span className="text-[#F6550C]">{selectedPlan.title}</span>
          </h2>

          {/* Instructions */}
          <div className="bg-orange-50 border-l-4 border-[#F6550C] p-4 text-sm text-gray-800 rounded-md space-y-2">
            <p>
              অনুগ্রহ করে নিচের যেকোনো একটি নাম্বারে টাকা পাঠান এবং নিচে
              Transaction ID প্রদান করুন।
            </p>
            <ul className="list-disc list-inside font-medium text-gray-700 space-y-1">
              {[
                { label: "Bkash (Personal)", number: "01405671742" },
                { label: "Nagad (Personal)", number: "01831283283" },
                { label: "Rocket (Personal)", number: "01831283283" },
              ].map(({ label, number }) => (
                <li
                  key={`${label}-${number}`}
                  className="flex items-center gap-2"
                >
                  📱 {label}: <strong>{number}</strong>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(number);
                      toast.success(`Copied ${number} to clipboard!`);
                    }}
                    className="ml-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs text-gray-700 transition"
                    type="button"
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
            <p>
              💡 <strong>নির্দেশনা:</strong> টাকা পাঠানোর পর{" "}
              <u>Transaction ID</u> টি অবশ্যই দিন এবং একটি স্ক্রিনশট সংরক্ষণ করে
              রাখুন। যতক্ষণ না পর্যন্ত আপনার রিকুয়েস্ট এপ্রুভ হয়, ততক্ষণ
              স্ক্রিনশট টি সংরক্ষণ করুন।
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F6550C]"
                required
              >
                <option value="">Select payment method</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
              </select>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F6550C]"
                placeholder="Enter your transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                সঠিক Transaction ID প্রদান করুন, ভুল ID দিলে যাচাই করা সম্ভব হবে
                না।
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#F6550C] hover:bg-orange-600 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2 transition"
            >
              <CreditCard className="w-5 h-5" />
              Submit Request
            </button>
          </form>
        </div>
      )}

      <div className="mt-20 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Subscription Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-gray-500 text-center">
            No previous requests found.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const updatedAt = new Date(req.updatedAt).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );

              const statusColor =
                req.status === "approved"
                  ? "bg-green-100 text-green-600"
                  : req.status === "pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600";

              return (
                <div
                  key={req._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* Left Section */}
                  <div className="w-full md:w-auto space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {req.planTitle}
                    </h3>

                    <p className="text-sm text-gray-600 flex flex-wrap items-center gap-2">
                      <span>
                        পেমেন্ট মেথড:{" "}
                        <span className="font-medium text-gray-700">
                          {req.paymentMethod.toUpperCase()}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        ট্রাঞ্জেকশন:{" "}
                        <span className="font-mono text-gray-900">
                          {req.transactionId}
                        </span>
                        <button
                          onClick={() => handleCopy(req.transactionId, req._id)}
                          className="ml-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs text-gray-700 transition"
                          title="Copy Transaction ID"
                        >
                          {copiedId === req._id ? "Copied!" : "Copy"}
                        </button>
                      </span>
                    </p>

                    {req.status === "approved" && (
                      <p className="text-xs text-gray-500 mt-1">
                        ✅ অনুমোদিত:{" "}
                        <span className="font-medium text-gray-700">
                          {updatedAt}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-sm font-medium px-4 py-1 rounded-full ${statusColor}`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <SubscriptionSeller />
    </WithAuth>
  );
}
