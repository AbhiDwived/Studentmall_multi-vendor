"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import FloatingIcons from "../../components/ui/FloatingIcons";
import Loading from "@/app/loading";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Landmark,
  StickyNote,
  ShoppingCart,
} from "lucide-react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type CartItem = {
  deliveryCharges: any;
  defaultDeliveryCharge: any;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sellerEmail: string;
  sellerName: string;
  color?: string;
  size?: string;
  productImage?: string[];
  productImages: string[];
};

type FormDataType = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  deliveryNote: string;
  country: string;
};

type UserType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

type ObjectId = {
  $oid: string;
};

type Variant = {
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  _id: ObjectId;
};

type DeliveryCharge = {
  division: string;
  district: string;
  charge: number;
  _id: ObjectId;
};

type ProductType = {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  longDescription: string;
  materials: string;
  careInstructions: string;
  specifications: string;
  additionalInfo: string;
  slug: string;
  type: string;
  discountPrice: number;
  brand: string;
  tags: string[];
  variants: Variant[];
  productImages: string[];
  videoUrl: string;
  deliveryCharges: DeliveryCharge[];
  defaultDeliveryCharge: number;
  reviews: any[]; // যদি রিভিউ এর টাইপ জানো, সেটা এখানে দিয়ে দাও
  rating: number;
  totalReviews: number;
  status: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  sellerName: string;
  sellerEmail: string;
  sellerNumber: number;
  features: string[];
  weight: number;
  warranty: string;
  deletedBy: null | string; // এখানে null বা string হতে পারে
  isDeleted: boolean;
  createdAt: {
    $date: string; // ISO string
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
};

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0); // Default shipping for Dhaka
  const [singleShipping, setSingleShipping] = useState(0);
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Dhaka",
    district: "",
    deliveryNote: "",
    country: "Bangladesh",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod"); // default is COD
  const [transactionId, setTransactionId] = useState("");
  const [sellerBkashNumber, setSellerBkashNumber] = useState(""); // You can fetch this from seller data
  const [finalBkashNumber, setFinalBkashNumber] = useState("017XXXXXXXX");
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMultipleSellers, setIsMultipleSellers] = useState(false);
  const [fetchedProducts, setFetchedProducts] = React.useState<ProductType[]>(
    []
  );
  console.log(fetchedProducts);
  const router = useRouter();
  type FormDataType = {
    [key: string]: any;
  };
  const divisionDistrictMap: Record<string, string[]> = {
    Dhaka: [
      "Dhaka",
      "Gazipur",
      "Kishoreganj",
      "Manikganj",
      "Munshiganj",
      "Narayanganj",
      "Narsingdi",
      "Rajbari",
      "Shariatpur",
      "Tangail",
      "Faridpur",
      "Gopalganj",
      "Madaripur",
    ],
    Chattogram: [
      "Chattogram",
      "Cox's Bazar",
      "Bandarban",
      "Khagrachari",
      "Rangamati",
      "Brahmanbaria",
      "Cumilla",
      "Chandpur",
      "Feni",
      "Lakshmipur",
      "Noakhali",
    ],
    Khulna: [
      "Khulna",
      "Bagerhat",
      "Satkhira",
      "Jessore",
      "Jhenaidah",
      "Magura",
      "Meherpur",
      "Narail",
      "Chuadanga",
      "Kushtia",
    ],
    Rajshahi: [
      "Rajshahi",
      "Chapai Nawabganj",
      "Naogaon",
      "Natore",
      "Pabna",
      "Joypurhat",
      "Bogura",
      "Sirajganj",
    ],
    Barisal: [
      "Barisal",
      "Barguna",
      "Bhola",
      "Jhalokati",
      "Patuakhali",
      "Pirojpur",
    ],
    Sylhet: ["Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"],
    Rangpur: [
      "Rangpur",
      "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Thakurgaon",
    ],
    Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const items: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    setCartItems(items);
    calculateTotal(items);

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);

    if (storedUser) {
      setFormData({
        fullName: storedUser.name,
        phone: storedUser.phone,
        email: storedUser.email,
        address: storedUser.address,
        city: "Dhaka",
        district: "",
        deliveryNote: "",
        country: "Bangladesh",
      });

      checkFirstOrder(storedUser._id);
    }
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const checkFirstOrder = async (userId: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/check-first-order/${userId}`
      );
      setIsFirstOrder(response.data.isFirstOrder);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error checking first order:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }

      toast.error(
        "There was an error checking the first order. Please try again later."
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart.");
  };

  const handleOrder = async () => {
    const userToken = localStorage.getItem("accessToken");

    if (!userToken) {
      toast.error("You need to be logged in to place an order.");
      router.push("/login");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (["bkash", "adminBkash"].includes(paymentMethod) && !transactionId) {
      toast.error("অনুগ্রহ করে আপনার বিকাশ Transaction ID লিখুন।");
      return;
    }

    setLoading(true);

    try {
      // Group cart items by sellerEmail
      const itemsGroupedBySeller: Record<string, CartItem[]> = {};
      cartItems.forEach((item) => {
        if (!itemsGroupedBySeller[item.sellerEmail]) {
          itemsGroupedBySeller[item.sellerEmail] = [];
        }
        itemsGroupedBySeller[item.sellerEmail].push(item);
      });

      const sellerEmails = Object.keys(itemsGroupedBySeller);

      // Create an order per seller
      const orderPromises = sellerEmails.map(async (sellerEmail) => {
        const items = itemsGroupedBySeller[sellerEmail];

        // Calculate total amount for this seller
        const totalAmount = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        // Calculate shipping once per seller based on first product and delivery charges
        let shipping = 0;
        const firstItem = items[0];
        const product = fetchedProducts.find((p) => {
          const productId =
            typeof p._id === "object" && "$oid" in p._id ? p._id.$oid : p._id;
          return productId === firstItem.productId;
        });

        if (product) {
          const matchedCharge = product.deliveryCharges?.find(
            (dc) =>
              dc.division?.toLowerCase() === formData.division.toLowerCase() &&
              dc.district?.toLowerCase() === formData.district.toLowerCase()
          );

          shipping =
            matchedCharge?.charge ?? product.defaultDeliveryCharge ?? 0;
        }

        const grandTotal = totalAmount + shipping;

        const orderData = {
          userId: user?._id,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            sellerEmail: item.sellerEmail,
            sellerName: item.sellerName,
            color: item.color || "",
            size: item.size || "",
            name: item.name || "",
            productImage: item.productImages || [],
          })),
          totalAmount,
          totalPrice: totalAmount,
          shippingCost: shipping,
          grandTotal,
          status: "Processing",
          orderDate: new Date().toISOString(),
          shippingDetails: formData,
          deliveryNote: formData.deliveryNote,
          paymentMethod,
          transactionId: ["bkash", "adminBkash"].includes(paymentMethod)
            ? transactionId
            : null,
        };

        console.log("📦 Final Order:", orderData);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        return response.data;
      });

      await Promise.all(orderPromises);

      // GA4 purchase event tracking
      if (typeof window !== "undefined" && window.gtag) {
        const cartTotal = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        // Calculate total shipping across unique sellers
        const uniqueSellers = new Set(
          cartItems.map((item) => item.sellerEmail)
        );
        let totalShipping = 0;

        uniqueSellers.forEach((sellerEmail) => {
          const sellerItems = cartItems.filter(
            (item) => item.sellerEmail === sellerEmail
          );

          const firstItem = sellerItems[0];
          const product = fetchedProducts.find((p) => {
            const productId =
              typeof p._id === "object" && "$oid" in p._id ? p._id.$oid : p._id;
            return productId === firstItem.productId;
          });

          if (product) {
            const matchedCharge = product.deliveryCharges?.find(
              (dc) =>
                dc.division?.toLowerCase() ===
                  formData.division.toLowerCase() &&
                dc.district?.toLowerCase() === formData.district.toLowerCase()
            );

            totalShipping +=
              matchedCharge?.charge ?? product.defaultDeliveryCharge ?? 0;
          }
        });

        window.gtag("event", "purchase", {
          transaction_id: Date.now().toString(),
          value: cartTotal + totalShipping,
          currency: "BDT",
          shipping: totalShipping,
          items: cartItems.map((item) => ({
            item_id: item.productId,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
            item_brand: item.sellerName,
          })),
        });
      }

      toast.success("✅ All orders placed successfully!");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      router.push("/order-history");
    } catch (error) {
      console.error("❌ Order placement failed:", error);
      toast.error("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedCity = e.target.value;
  //   setFormData({ ...formData, city: selectedCity });
  // };

  // const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedCity = e.target.value;
  //   setFormData((prev) => ({ ...prev, city: selectedCity }));
  // };

  // const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedDistrict = e.target.value;
  //   setFormData((prev) => ({ ...prev, district: selectedDistrict }));
  // };

  // Backend theke product fetch
  useEffect(() => {
    async function fetchProducts() {
      const productIds = [...new Set(cartItems.map((item) => item.productId))];

      const productsData = await Promise.all(
        productIds.map(
          (id) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/details/${id}`)
              .then((res) => res.json())
              .then((data) => data?.data) // because response has { success, message, data }
        )
      );

      setFetchedProducts(productsData.filter(Boolean)); // remove any undefined/null
    }

    if (cartItems.length > 0) {
      fetchProducts();
    } else {
      setFetchedProducts([]);
    }
  }, [cartItems]);

  // Shipping cost calculation
  useEffect(() => {
    if (
      !formData.division ||
      !formData.district ||
      fetchedProducts.length === 0
    )
      return;

    console.log("🔍 Starting shipping cost calculation...");
    let totalShipping = 0;

    // Calculate shipping once per unique seller (based on first product)
    const uniqueSellers = new Set(cartItems.map((item) => item.sellerEmail));

    uniqueSellers.forEach((sellerEmail) => {
      const sellerItems = cartItems.filter(
        (item) => item.sellerEmail === sellerEmail
      );

      const firstItem = sellerItems[0];
      const matchedProduct = fetchedProducts.find((p) => {
        const productId =
          typeof p._id === "object" && "$oid" in p._id ? p._id.$oid : p._id;
        return productId === firstItem.productId;
      });

      if (!matchedProduct) {
        console.warn(`⚠️ Product not found for seller: ${sellerEmail}`);
        return;
      }

      const matchedCharge = matchedProduct.deliveryCharges?.find(
        (dc) =>
          dc.division?.toLowerCase() === formData.division.toLowerCase() &&
          dc.district?.toLowerCase() === formData.district.toLowerCase()
      );

      const baseShipping =
        matchedCharge?.charge ?? matchedProduct.defaultDeliveryCharge ?? 0;

      totalShipping += baseShipping; // Only one charge per seller
    });

    const averageShipping =
      uniqueSellers.size > 0 ? totalShipping / uniqueSellers.size : 0;

    console.log("✅ Total Shipping Cost:", totalShipping);
    console.log("✅ Average Per Seller:", averageShipping);

    setSingleShipping(averageShipping);
    setShippingCost(totalShipping);
  }, [fetchedProducts, formData.division, formData.district, cartItems]);

  useEffect(() => {
    const uniqueSellers = new Set(cartItems.map((item) => item.sellerEmail));
    const isMultipleSellers = uniqueSellers.size > 1;

    const number = isMultipleSellers
      ? "01405671742"
      : sellerBkashNumber || "017XXXXXXXX";

    setFinalBkashNumber(number);

    // ✅ Admin Bkash হলে আলাদা ভাবে চিহ্নিত করা
    // if (isMultipleSellers) {
    //   setPaymentMethod("adminBkash");
    // }
    setIsMultipleSellers(isMultipleSellers);
  }, [cartItems, sellerBkashNumber]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalBkashNumber);
    setCopied(true);

    // Hide the tooltip after 1.5 seconds
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{ top: "70px", zIndex: 9999 }}
        reverseOrder={false}
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          <>
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
              Checkout
            </h1>

            {/* First Order Discount Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-200 text-blue-900 p-6 rounded-lg mb-8 text-center shadow-md">
              <p className="text-2xl font-bold">
                🎁 Enjoy 10% Off on Your First Purchase!
              </p>
              <p className="text-sm mt-2">
                Unlock your exclusive discount by subscribing to our newsletter.
                This special offer is only available to first-time customers.
              </p>
              <p className="text-sm mt-1 font-medium text-blue-800">
                Sign up today and start saving!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Info Form */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                  <User className="inline-block w-6 h-6 mr-2 text-blue-500" />
                  Shipping Information / শিপিং তথ্য
                </h2>
                <div className="space-y-5">
                  {/* Input Fields except District */}
                  {[
                    {
                      id: "fullName",
                      label: "Full Name / পুরো নাম",
                      icon: <User className="w-5 h-5 text-gray-500" />,
                    },
                    {
                      id: "phone",
                      label: "Phone / ফোন",
                      icon: <Phone className="w-5 h-5 text-gray-500" />,
                    },
                    {
                      id: "email",
                      label: "Email / ইমেইল",
                      type: "email",
                      icon: <Mail className="w-5 h-5 text-gray-500" />,
                    },
                    {
                      id: "address",
                      label: "Address / ঠিকানা",
                      icon: <MapPin className="w-5 h-5 text-gray-500" />,
                    },
                  ].map(({ id, label, type = "text", icon }) => (
                    <div key={id}>
                      <label
                        htmlFor={id}
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        {label}
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3">
                        {icon}
                        <input
                          id={id}
                          type={type}
                          value={formData[id]}
                          onChange={(e) =>
                            setFormData({ ...formData, [id]: e.target.value })
                          }
                          className="w-full px-3 py-3 focus:outline-none"
                        />
                      </div>
                      {!formData[id] && (
                        <p className="text-xs text-red-500 mt-1">
                          {label} is required.
                        </p>
                      )}
                    </div>
                  ))}
                  {/* বিভাগ */}
                  <div>
                    <label
                      htmlFor="division"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Division / বিভাগ
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <select
                        id="division"
                        value={formData.division}
                        onChange={(e) => {
                          const selectedDivision = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            division: selectedDivision,
                            district: "", // just reset district when division changes
                          }));
                        }}
                        className="w-full px-3 py-3 focus:outline-none bg-transparent"
                      >
                        <option value="">Select a division</option>
                        {Object.keys(divisionDistrictMap).map((division) => (
                          <option key={division} value={division}>
                            {division}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!formData.division && (
                      <p className="text-xs text-red-500 mt-1">
                        Division is required.
                      </p>
                    )}
                  </div>

                  {/* District Field */}
                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      District / জেলা
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <select
                        id="district"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            district: e.target.value,
                          }))
                        }
                        disabled={!formData.division}
                        className="w-full px-3 py-3 focus:outline-none bg-transparent"
                      >
                        <option value="">Select a district</option>
                        {(divisionDistrictMap[formData.division] || []).map(
                          (district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    {!formData.district && (
                      <p className="text-xs text-red-500 mt-1">
                        District is required.
                      </p>
                    )}
                  </div>

                  {/* Delivery Note */}
                  <div>
                    <label
                      htmlFor="deliveryNote"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Delivery Note / ডেলিভারি নির্দেশনা
                    </label>
                    <div className="flex items-start border border-gray-300 rounded-md shadow-sm px-3">
                      <StickyNote className="w-5 h-5 text-gray-500 mt-3" />
                      <textarea
                        id="deliveryNote"
                        rows={4}
                        value={formData.deliveryNote}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deliveryNote: e.target.value,
                          })
                        }
                        className="w-full px-3 py-3 focus:outline-none"
                        placeholder="Any specific instructions about delivery..."
                      />
                    </div>
                    {!formData.deliveryNote && (
                      <p className="text-xs text-red-500 mt-1">
                        Delivery note is required.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                  <ShoppingCart className="inline-block w-6 h-6 mr-2 text-green-600" />
                  Order Summary / অর্ডার সারাংশ
                </h2>

                <div className="space-y-5">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.productImages[0]}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover border border-gray-200"
                            unoptimized
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Color:{" "}
                              <span className="capitalize">{item.color}</span> |
                              Size:{" "}
                              <span className="uppercase">{item.size}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-gray-700">
                            {item.quantity} x ৳{item.price}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No items in the cart. / কার্টে কোনো পণ্য নেই।
                    </p>
                  )}
                </div>
                {/* Payment Method Selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Payment Method / পেমেন্ট পদ্ধতি
                  </h3>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-blue-600"
                      />
                      Cash on Delivery / ক্যাশ অন ডেলিভারি
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={
                          paymentMethod === "bkash" ||
                          paymentMethod === "adminBkash"
                        }
                        onChange={() =>
                          setPaymentMethod(
                            isMultipleSellers ? "adminBkash" : "bkash"
                          )
                        }
                        className="accent-blue-600"
                      />
                      Bkash Payment / বিকাশ পেমেন্ট
                    </label>
                  </div>

                  {/* Show Bkash Payment Instructions */}
                  {(paymentMethod === "bkash" ||
                    paymentMethod === "adminBkash") && (
                    <div className="mt-4 bg-pink-50 border border-pink-200 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-800 mb-2 leading-6">
                        📲 অনুগ্রহ করে মোট{" "}
                        <span className="font-semibold text-pink-600">
                          ৳{(totalAmount + shippingCost).toFixed(2)}
                        </span>{" "}
                        নিচের বিকাশ নম্বরে{" "}
                        <span className="font-medium">Send Money</span> করুন।
                      </p>

                      {/* Bkash Number + Copy Button */}
                      <div className="flex items-center gap-4 mt-2 relative w-full max-w-md flex-nowrap overflow-x-auto">
                        <p className="text-base font-semibold text-pink-700 whitespace-nowrap">
                          বিকাশ নম্বর:{" "}
                          <span className="tracking-wide">
                            {finalBkashNumber}
                          </span>
                        </p>

                        <button
                          onClick={handleCopy}
                          className={`text-[10px] bg-pink-600 text-white px-3 py-1.5 rounded-md hover:bg-pink-700 transition whitespace-nowrap flex-shrink-0`}
                          title={copied ? "কপি হয়েছে!" : "ক্লিক করে কপি করুন"}
                        >
                          {copied ? "✓ কপি হয়েছে" : "কপি করুন"}
                        </button>
                      </div>

                      {/* Instruction Text */}
                      <p className="text-sm text-gray-600 mt-3 leading-5">
                        📝 পেমেন্ট সম্পন্ন হলে নিচের ঘরে আপনার{" "}
                        <span className="font-medium">Transaction ID</span> দিন।
                        <br />✅ অর্ডার কনফার্ম হওয়ার আগ পর্যন্ত চাইলে একটি
                        স্ক্রিনশট রেখে দিতে পারেন।
                      </p>

                      {/* Transaction ID Input */}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          আপনার বিকাশ Transaction ID:
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Transaction ID লিখুন"
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-pink-300"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Shipping / শিপিং</span>
                    <span>{shippingCost}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total / মোট</span>
                    <span>৳{(totalAmount + shippingCost).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (
                      !formData.fullName ||
                      !formData.phone ||
                      !formData.email ||
                      !formData.address ||
                      !formData.city ||
                      !formData.district ||
                      !formData.deliveryNote
                    ) {
                      toast.error("Please fill out all required fields.");
                      return;
                    }
                    handleOrder();
                  }}
                  className="mt-6 w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order / অর্ডার করুন"}
                </button>
              </div>
            </div>
          </>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
