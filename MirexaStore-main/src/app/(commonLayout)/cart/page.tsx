"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
// Declare dataLayer type globally
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}
type CartItem = {
  userId: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  stockQuantity?: number;
  productImages: string[];
  color?: string;
  size?: string;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [quantityUpdated, setQuantityUpdated] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponError, setCouponError] = useState<string>("");
  const [couponSuccess, setCouponSuccess] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);

  const router = useRouter();

  const totalPriceBeforeDiscount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalPrice = discountApplied
    ? totalPriceBeforeDiscount * 0.9
    : totalPriceBeforeDiscount;

  const handleCheckoutRedirect = () => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "BDT",
          value: totalPrice,
          items: cartItems.map((item) => ({
            item_id: item.productId,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      });
    }

    router.push("/cart/checkout");
  };

  const handleApplyCoupon = () => {
    const validCoupon = "DISCOUNT10";

    if (couponCode.trim() === "") {
      setCouponError("Please enter a coupon code.");
      setCouponSuccess("");
      return;
    }

    if (couponCode === validCoupon && !discountApplied) {
      setCouponError("");
      setCouponSuccess("Coupon applied successfully! 10% discount.");
      setDiscountApplied(true);
    } else if (discountApplied) {
      setCouponError("Coupon already applied.");
      setCouponSuccess("");
    } else {
      setCouponError("Invalid coupon code.");
      setCouponSuccess("");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      toast.error("Authentication token or user data missing. Please log in.");
      return;
    }

    try {
      const parsedUserData = JSON.parse(userData);
      const userIdFromStorage: string = parsedUserData._id;
      setUserId(userIdFromStorage);
      fetchCartData(userIdFromStorage);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Invalid user data. Please log in again.");
    }
  }, []);

  const fetchCartData = useCallback(async (userId: string) => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const parsedCart: CartItem[] = JSON.parse(cartData);
      const userCart = parsedCart.filter((item) => item.userId === userId);
      setCartItems(userCart);
    }
  }, []);

  const handleQuantityChange = useCallback((id: string, delta: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.productId === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );

      setTimeout(() => {
        localStorage.setItem("cart", JSON.stringify(updatedItems));
      }, 0);

      setQuantityUpdated(true);
      return updatedItems;
    });
  }, []);

  const handleRemoveItem = useCallback(
    (id: string) => {
      const updatedCart = cartItems.filter((item) => item.productId !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      toast.success("Item removed from cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    },
    [cartItems]
  );

  const showConfirmationModal = (id: string) => {
    setShowConfirmation(id);
  };

  const handleConfirmation = (id: string, confirm: boolean) => {
    if (confirm) {
      handleRemoveItem(id);
    }
    setShowConfirmation(null);
  };

  useEffect(() => {
    if (quantityUpdated) {
      toast.success("Quantity updated successfully!");
      setQuantityUpdated(false);
    }
  }, [quantityUpdated]);

  useEffect(() => {
    if (cartItems.length > 0) {
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "view_cart",
          ecommerce: {
            currency: "BDT",
            value: totalPrice,
            items: cartItems.map((item) => ({
              item_id: item.productId,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        });
      }
    }
  }, [cartItems, totalPrice]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{ top: "70px", zIndex: 9999 }}
      />

      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          🛒 Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Image
              src="https://i.ibb.co.com/whX10JvN/download-removebg-preview.png"
              alt="Empty Cart"
              width={192}
              height={192}
              className="opacity-80"
              unoptimized
            />
            <h2 className="text-2xl font-semibold text-gray-700 mt-4">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-gray-500 mt-2">
              {"Looks like you haven't added anything yet."}
            </p>
            <a
              href="/product"
              className="mt-6 px-6 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#c2490b] transition duration-300"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="relative flex items-center bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                >
                  <button
                    className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-700"
                    onClick={() => showConfirmationModal(item.productId)}
                  >
                    &times;
                  </button>

                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                    {item.productImages?.length > 0 ? (
                      <Image
                        src={item.productImages[0]}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      Price:{" "}
                      <span className="font-semibold">
                        ৳{item.price.toFixed(2)}
                      </span>
                    </p>
                    {item.color && (
                      <p className="text-sm text-gray-500">
                        Color: <span className="capitalize">{item.color}</span>
                      </p>
                    )}
                    {item.size && (
                      <p className="text-sm text-gray-500">
                        Size: <span className="uppercase">{item.size}</span>
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-3">
                      <button
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        onClick={() => handleQuantityChange(item.productId, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-20">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Order Summary
              </h3>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Have a coupon code?
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-r-lg hover:bg-orange-600 transition"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-green-600 text-sm mt-2">{couponSuccess}</p>
                )}
              </div>

              {/* Total */}
              <div className="text-lg text-gray-700 mb-6 flex justify-between">
                <span>Total:</span>
                <span className="font-semibold text-orange-600">
                  ৳{totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutRedirect}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Remove this item from cart?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleConfirmation(showConfirmation, true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => handleConfirmation(showConfirmation, false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
