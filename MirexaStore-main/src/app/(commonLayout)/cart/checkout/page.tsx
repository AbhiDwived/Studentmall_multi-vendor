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
  innerSlug?: string;
  innerSubSlug?: string;
};

type FormDataType = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  district: string;
  deliveryNote: string;
  country: string;
  [key: string]: string;
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
  reviews: any[];
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
  deletedBy: null | string;
  isDeleted: boolean;
  createdAt: {
    $date: string;
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
  const [shippingCost, setShippingCost] = useState(0);
  const [singleShipping, setSingleShipping] = useState(0);
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Mumbai",
    state: "",
    district: "",
    deliveryNote: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [transactionId, setTransactionId] = useState("");
  const [sellerUpiId, setSellerUpiId] = useState("");
  const [finalUpiId, setFinalUpiId] = useState("example@upi");
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMultipleSellers, setIsMultipleSellers] = useState(false);
  const [fetchedProducts, setFetchedProducts] = React.useState<ProductType[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  console.log(fetchedProducts);
  const router = useRouter();

  // Fetch Indian states from API
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
          headers: {
            'X-CSCAPI-KEY': 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
          }
        });
        const data = await response.json();
        setStates(data.map((state: any) => state.name));
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates(["Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "West Bengal", "Uttar Pradesh", "Haryana", "Punjab", "Madhya Pradesh", "Bihar", "Odisha", "Kerala", "Assam", "Delhi"]);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch districts based on selected state
  useEffect(() => {
    if (!formData.state) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const statesResponse = await fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
          headers: {
            'X-CSCAPI-KEY': 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
          }
        });
        const statesData = await statesResponse.json();
        const selectedState = statesData.find((state: any) => state.name === formData.state);
        
        if (selectedState) {
          const citiesResponse = await fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${selectedState.iso2}/cities`, {
            headers: {
              'X-CSCAPI-KEY': 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
            }
          });
          const citiesData = await citiesResponse.json();
          setDistricts(citiesData.map((city: any) => city.name));
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        const fallbackDistricts: Record<string, string[]> = {
          "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
          "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
          "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
          "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
          "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"]
        };
        setDistricts(fallbackDistricts[formData.state] || []);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.state]);

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
        city: "Mumbai",
        state: "",
        district: "",
        deliveryNote: "",
        country: "India",
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

    if (["upi", "adminUpi"].includes(paymentMethod) && !transactionId) {
      toast.error("Please enter your UPI Transaction ID.");
      return;
    }

    setLoading(true);

    try {
      const itemsGroupedBySeller: Record<string, CartItem[]> = {};
      cartItems.forEach((item) => {
        if (!itemsGroupedBySeller[item.sellerEmail]) {
          itemsGroupedBySeller[item.sellerEmail] = [];
        }
        itemsGroupedBySeller[item.sellerEmail].push(item);
      });

      const sellerEmails = Object.keys(itemsGroupedBySeller);

      const orderPromises = sellerEmails.map(async (sellerEmail) => {
        const items = itemsGroupedBySeller[sellerEmail];

        const totalAmount = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

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
          items: items.map((item) => {
            console.log('🛒 Checkout item data:', {
              name: item.name,
              innerSlug: item.innerSlug,
              innerSubSlug: item.innerSubSlug,
              hasInnerSlug: !!item.innerSlug,
              hasInnerSubSlug: !!item.innerSubSlug
            });
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              sellerEmail: item.sellerEmail,
              sellerName: item.sellerName,
              color: item.color || "",
              size: item.size || "",
              name: item.name || "",
              productImage: item.productImages || [],
              innerSlug: item.innerSlug || "",
              innerSubSlug: item.innerSubSlug || "",
            };
          }),
          totalAmount,
          totalPrice: totalAmount,
          shippingCost: shipping,
          grandTotal,
          status: "Processing",
          orderDate: new Date().toISOString(),
          shippingDetails: formData,
          deliveryNote: formData.deliveryNote,
          paymentMethod,
          transactionId: ["upi", "adminUpi"].includes(paymentMethod)
            ? transactionId
            : null,
        };

        console.log("📦 Final Order:", orderData);
        console.log("📦 Order Items Detail:", orderData.items.map(item => ({
          name: item.name,
          innerSlug: item.innerSlug,
          innerSubSlug: item.innerSubSlug,
          hasVariants: !!(item.innerSlug || item.innerSubSlug)
        })));

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

      if (typeof window !== "undefined" && window.gtag) {
        const cartTotal = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

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

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      const productIds = [...new Set(cartItems.map((item) => item.productId))];

      const productsData = await Promise.all(
        productIds.map(
          (id) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/details/${id}`)
              .then((res) => res.json())
              .then((data) => data?.data)
        )
      );

      setFetchedProducts(productsData.filter(Boolean));
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

      totalShipping += baseShipping;
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

    const upiId = isMultipleSellers
      ? "admin@upi"
      : sellerUpiId || "example@upi";

    setFinalUpiId(upiId);
    setIsMultipleSellers(isMultipleSellers);
  }, [cartItems, sellerUpiId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUpiId);
    setCopied(true);

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
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
            Checkout
          </h1>

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
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                <User className="inline-block w-6 h-6 mr-2 text-blue-500" />
                Shipping Information
              </h2>
              <div className="space-y-5">
                {[
                  {
                    id: "fullName",
                    label: "Full Name",
                    icon: <User className="w-5 h-5 text-gray-500" />,
                  },
                  {
                    id: "phone",
                    label: "Phone",
                    icon: <Phone className="w-5 h-5 text-gray-500" />,
                  },
                  {
                    id: "email",
                    label: "Email",
                    type: "email",
                    icon: <Mail className="w-5 h-5 text-gray-500" />,
                  },
                  {
                    id: "address",
                    label: "Address",
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
                
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    State
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => {
                        const selectedState = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          state: selectedState,
                          district: "",
                        }));
                      }}
                      className="w-full px-3 py-3 focus:outline-none bg-transparent"
                      disabled={loadingStates}
                    >
                      <option value="">{loadingStates ? "Loading states..." : "Select a state"}</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!formData.state && (
                    <p className="text-xs text-red-500 mt-1">
                      State is required.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    District
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
                      disabled={!formData.state || loadingDistricts}
                      className="w-full px-3 py-3 focus:outline-none bg-transparent"
                    >
                      <option value="">{loadingDistricts ? "Loading districts..." : "Select a district"}</option>
                      {districts.map(
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

                <div>
                  <label
                    htmlFor="deliveryNote"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Delivery Note
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

            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                <ShoppingCart className="inline-block w-6 h-6 mr-2 text-green-600" />
                Order Summary
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
                          className="rounded-lg object-contain border border-gray-200"
                          unoptimized
                          onError={async (e) => {
                            const target = e.target as HTMLImageElement;
                            const otherImages = item.productImages?.slice(1) || [];
                            const nextImage = otherImages.find(img => img !== target.src);
                            if (nextImage && target.src !== nextImage) {
                              target.src = nextImage;
                            } else {
                              try {
                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${item.productId}`);
                                if (response.ok) {
                                  const productData = await response.json();
                                  const originalImages = productData.data?.productImages || [];
                                  if (originalImages.length > 0) {
                                    target.src = originalImages[0];
                                    return;
                                  }
                                }
                              } catch (error) {
                                // Silent fail
                              }
                            }
                          }}
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {item.name}
                            {(item.innerSlug || item.innerSubSlug) && (
                              <span className="text-sm text-gray-500 font-normal">
                                ({[item.innerSlug, item.innerSubSlug].filter(Boolean).join(', ')})
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {item.color && (
                              <div className="flex items-center gap-2">
                                <span>Color:</span>
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.color }}
                                  title={item.color}
                                ></div>
                              </div>
                            )}
                            {item.size && (
                              <div>
                                Size: <span className="uppercase">{item.size}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-gray-700">
                          {item.quantity} x ₹{item.price}
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
                    No items in the cart.
                  </p>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Payment Method
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
                    Cash on Delivery
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={
                        paymentMethod === "upi" ||
                        paymentMethod === "adminUpi"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          isMultipleSellers ? "adminUpi" : "upi"
                        )
                      }
                      className="accent-blue-600"
                    />
                    UPI / Card Payment
                  </label>
                </div>

                {(paymentMethod === "upi" ||
                  paymentMethod === "adminUpi") && (
                  <div className="mt-4 bg-pink-50 border border-pink-200 p-4 rounded-md shadow-sm">
                    <p className="text-sm text-gray-800 mb-2 leading-6">
                      📲 Please pay total{" "}
                      <span className="font-semibold text-pink-600">
                        ₹{(totalAmount + shippingCost).toFixed(2)}
                      </span>{" "}
                      using UPI or Card payment below.
                    </p>

                    <div className="flex items-center gap-4 mt-2 relative w-full max-w-md flex-nowrap overflow-x-auto">
                      <p className="text-base font-semibold text-pink-700 whitespace-nowrap">
                        UPI ID:{" "}
                        <span className="tracking-wide">
                          {finalUpiId}
                        </span>
                      </p>

                      <button
                        onClick={handleCopy}
                        className={`text-[10px] bg-pink-600 text-white px-3 py-1.5 rounded-md hover:bg-pink-700 transition whitespace-nowrap flex-shrink-0`}
                        title={copied ? "Copied!" : "Click to copy"}
                      >
                        {copied ? "✓ Copied" : "Copy"}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-3 leading-5">
                      📝 After completing payment, enter your{" "}
                      <span className="font-medium">Transaction ID</span> below.
                      <br />✅ You may keep a screenshot until order confirmation.
                    </p>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your UPI Transaction ID:
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter UPI Transaction ID"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-pink-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{(totalAmount + shippingCost).toFixed(2)}</span>
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
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
