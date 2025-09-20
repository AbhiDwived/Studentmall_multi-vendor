/* eslint-disable @next/next/no-img-element */
"use client";

import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect, ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import { redirect, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import ReviewsSection from "./review";
import FloatingIcons from "../components/ui/FloatingIcons";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/app/loading";
import { HiPlus, HiMinus } from "react-icons/hi";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
import SellerProfileCard from "../components/ui/SellerProfileCard";
import ProductDetailsSkeleton from "../components/skeleton/ProductDetailsSkeleton";

interface ProductDetailsProps {
  product: {
    type: string;
    affiliateLink: string | undefined;
    data: {
      features: boolean;
      affiliateLink: string | undefined;
      type: string;
      sellerNumber: number;
      warranty: ReactNode;
      weight: React.JSX.Element;
      longDescription: React.JSX.Element;
      sellerName: any;
      sellerEmail: any;
      _id: string;
      name: string;
      description: string;
      price: number;
      stockQuantity: number;
      category: string;
      productImages: string[];
      discountPrice?: number | undefined;
      brand: string;
      tags: string[];
      variants: Variant[];
    };
  };
  relatedProducts: {
    data: {
      _id: string;
      name: string;
      price: number;
      productImages: string[];
    }[];
  };
}

type Variant = {
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
  images?: string[];
};

export interface ReviewReply {
  _id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
}

interface Review {
  updatedAt: string;
  createdAt: string;
  _id: string;
  userName?: string;
  userId: {
    _id: string;
    name: string;
  };
  timestamp: string;
  rating: number;
  comment: string;
  likes: string[];
  replies: {
    _id: string;
    userId: string;
    comment: string;
    userName: string;
    timestamp: string;
    isEditing: boolean;
  }[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const router = useRouter();
  const [cartQuantity, setCartQuantity] = useState(1);
  const [stockQuantity, setStockQuantity] = useState(
    product.data.stockQuantity
  );
  const [sellerProfile, setsellerProfile] = useState<any | null>(null);
  const [sellerRating, setsellerRating] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product.data.productImages[0]
  );

  const [showFullDescription, setShowFullDescription] = useState(false);

  const rawDesc = product?.data?.longDescription;
  const longDesc = typeof rawDesc === "string" ? rawDesc : "";
  const isLong = longDesc.length > 300;
  const displayDesc =
    isLong && !showFullDescription ? longDesc.slice(0, 300) + "..." : longDesc;

  const [reviews, setReviews] = useState<Review[]>([]);

  // variant part
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [variantPrice, setVariantPrice] = useState<number | null>(null);
  const [variantStock, setVariantStock] = useState<number | null>(null);

  const handleVariantChange = (type: string, value: string) => {
    const updatedVariant = {
      ...selectedVariant,
      [type]: value,
    };

    setSelectedVariant(updatedVariant);

    // Find matched variant (color-only, size-only, or both)
    const matchedVariant = product.data.variants.find((variant) => {
      const matchColor = updatedVariant.color
        ? variant.color === updatedVariant.color
        : true;

      const matchSize = updatedVariant.size
        ? variant.size === updatedVariant.size
        : true;

      return matchColor && matchSize;
    });

    if (matchedVariant) {
      setVariantPrice(matchedVariant.price ?? null);
      setVariantStock(matchedVariant.stock ?? null);
    } else {
      setVariantPrice(null);
      setVariantStock(null);
    }
  };

  useEffect(() => {
    const fetchsellerData = async () => {
      if (!product.data.sellerEmail) return;

      try {
        // Step 1: Get profile & rating
        const [profileRes, ratingRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${product.data.sellerEmail}`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/seller/rating/${product.data.sellerEmail}`
          ),
        ]);

        const profile = profileRes.data.data;
        setsellerProfile(profile);
        setsellerRating(ratingRes.data.data);

        const sellerId = profile._id;

        // Step 2: Get followers count
        const followersRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/followers/${sellerId}`
        );
        setFollowersCount(followersRes.data.followers); // always show this ✅

        // Step 3: Conditionally check isFollowing if user is logged in
        const token = localStorage.getItem("accessToken");
        if (token) {
          const isFollowingRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/seller/is-following?sellerId=${sellerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsFollowing(isFollowingRes.data.isFollowing);
        } else {
          setIsFollowing(false); // fallback for unauthenticated user
        }
      } catch (error) {
        console.error("Failed to fetch seller data:", error);
      }
    };

    fetchsellerData();
  }, [product.data.sellerEmail]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("accessToken");

    // If user is not logged in, redirect to login page
    if (!token) {
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath
      )}`;
      return;
    }

    try {
      const url = isFollowing ? "unfollow" : "follow";
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/${url}`,
        { sellerId: sellerProfile._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Follow action failed:", error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/${product.data._id}`
        );
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    fetchReviews();
  }, [product.data._id]);

  const handleAddToCart = () => {
    if (isLoading) return;
    setIsLoading(true);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please log in to add items to the cart.");
      setIsLoading(false);

      const currentPath = window.location.pathname + window.location.search;
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }, 1500);

      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user._id;
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      setIsLoading(false);
      return;
    }

    // ✅ Check if color and size are selected if they exist
    if (product.data.variants) {
      if (
        product.data.variants.some((variant) => variant.color) &&
        !selectedVariant?.color
      ) {
        toast.error("Please select color.");
        setIsLoading(false);
        return;
      }

      if (
        product.data.variants.some((variant) => variant.size) &&
        !selectedVariant?.size
      ) {
        toast.error("Please select size.");
        setIsLoading(false);
        return;
      }
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // চেক করো একই product+user+variant আগেই আছে কিনা
    const existingCartItem = cart.find(
      (item: any) =>
        item.productId === product.data._id &&
        item.userId === userId &&
        item.color === (selectedVariant?.color ?? "") &&
        item.size === (selectedVariant?.size ?? "")
    );

    // price & stock: variant থেকে নাও যদি না থাকে তাহলে product এর ডিফল্ট
    const totalPrice =
      variantPrice ?? product.data.discountPrice ?? product.data.price;
    const stockQuantityToUse = variantStock ?? product.data.stockQuantity;

    if (existingCartItem) {
      toast.error(
        "This product with selected variant is already in your cart."
      );
      setIsLoading(false);
      return;
    }

    const cartItem = {
      userId,
      productId: product.data._id,
      quantity: cartQuantity,
      name: product.data.name,
      price: totalPrice,
      sellerEmail: product?.data?.sellerEmail,
      sellerName: product?.data?.sellerName,
      stockQuantity: stockQuantityToUse,
      productImages: product.data.productImages,
      color: selectedVariant?.color ?? "",
      size: selectedVariant?.size ?? "",
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
    setStockQuantity((prevStock) => prevStock - cartQuantity);
    toast.success("Added to cart!");
    setIsLoading(false);
  };

  const handleBuyNow = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please log in to proceed to checkout.");
      const currentPath = window.location.pathname + window.location.search;
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }, 1500);
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user._id;

    // Variant validation
    if (product.data.variants) {
      if (
        product.data.variants.some((variant) => variant.color) &&
        (!selectedVariant?.color || selectedVariant.color.trim() === "")
      ) {
        toast.error("Please select color.");
        return;
      }

      if (
        product.data.variants.some((variant) => variant.size) &&
        (!selectedVariant?.size || selectedVariant.size.trim() === "")
      ) {
        toast.error("Please select size.");
        return;
      }
    }

    // Price & stock: selectedVariant থেকে নাও, না থাকলে product data থেকে
    const priceToUse =
      variantPrice ?? product.data.discountPrice ?? product.data.price;
    const stockToUse = variantStock ?? product.data.stockQuantity;

    const cartItem = {
      userId,
      productId: product.data._id,
      quantity: cartQuantity,
      name: product.data.name,
      price: priceToUse,
      sellerEmail: product?.data?.sellerEmail,
      sellerName: product?.data?.sellerName,
      stockQuantity: stockToUse,
      productImages: product.data.productImages,
      color: selectedVariant?.color ?? "",
      size: selectedVariant?.size ?? "",
    };

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingCartItem = cart.find(
      (item: any) =>
        item.productId === product.data._id &&
        item.userId === userId &&
        item.color === (selectedVariant?.color ?? "") &&
        item.size === (selectedVariant?.size ?? "")
    );

    if (!existingCartItem) {
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      setStockQuantity((prevStock) => prevStock - cartQuantity);
      toast.success("Added to cart!");
    }

    router.push("/cart/checkout");
  };

  const getUserAndToken = () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!storedUser || !token) {
      toast.error("Please log in first.");
      const currentPath = window.location.pathname + window.location.search;
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }, 1500);
      return null;
    }

    return { user: JSON.parse(storedUser), token };
  };

  const handleLikeReview = async (reviewId: string) => {
    const auth = getUserAndToken();
    if (!auth) return;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/like/${reviewId}`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      toast.success(
        "✨ Your feedback has been recorded! Thanks for engaging! 💖"
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, likes: data.data.likes }
            : review
        )
      );
    } catch (error) {
      toast.error("Error toggling like for the review.");
    }
  };

  const handleReplyReview = async (reviewId: string, replyComment: string) => {
    const auth = getUserAndToken();
    if (!auth) return;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/reply/${reviewId}`,
        { reply: replyComment, userName: auth.user.name },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Replied to the review!");

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                replies: [
                  ...review.replies,
                  {
                    _id: data.newReply?._id,
                    userId: auth.user._id,
                    userName: auth.user.name,
                    comment: replyComment,
                    timestamp: new Date().toISOString(),
                    isEditing: false,
                  },
                ],
              }
            : review
        )
      );
    } catch (error) {
      toast.error("Error replying to the review.");
    }
  };

  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    const auth = getUserAndToken();
    if (!auth) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/delete-reply/${reviewId}/${replyId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      toast.success("Reply deleted successfully!");
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                replies: review.replies.filter((r) => r._id !== replyId),
              }
            : review
        )
      );
    } catch (error) {
      toast.error(
        "Error deleting the reply. Please refresh the page and try again."
      );
    }
  };

  const onUpdateReply = (
    reviewId: string,
    replyId: string,
    updatedComment: string
  ) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === reviewId
          ? {
              ...review,
              replies: review.replies.map((reply) =>
                reply._id === replyId
                  ? { ...reply, comment: updatedComment }
                  : reply
              ),
            }
          : review
      )
    );
  };

  return (
    <>
      {isLoading ? (
        <ProductDetailsSkeleton></ProductDetailsSkeleton>
      ) : (
        <main>
          <div className="product-details pt-5 flex flex-col gap-8 px-4 sm:px-8 lg:px-16">
            <Toaster
              position="top-center"
              gutter={10}
              containerStyle={{
                top: "70px",
                zIndex: 9999,
              }}
              reverseOrder={false}
            />

            <h1 className="text-3xl pt-2 font-semibold">{product.data.name}</h1>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Images Gallery */}
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="w-full mb-4 max-w-[600px]">
                    <div className="relative w-full h-80 overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={selectedImage}
                        alt={product.data.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain transition-all duration-300"
                        unoptimized={true}
                      />
                    </div>
                  </div>
                  {/* Thumbnails for the Gallery */}
                  <div className="flex gap-4 overflow-x-auto">
                    {product.data.productImages.map((image, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={index}
                        src={image}
                        alt={product.data.name}
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition-all duration-300 ${
                          selectedImage === image
                            ? "border-orange-600"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full md:w-1/2">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-semibold text-orange-600 transition-all duration-300 ease-in-out">
                      ₹{" "}
                      {variantPrice !== null
                        ? variantPrice
                        : product.data.discountPrice ?? product.data.price}
                    </span>

                    {/* মূল দাম দেখাও যদি discount price থাকে */}
                    {variantPrice === null && product.data.discountPrice && (
                      <span className="text-lg text-gray-500 line-through transition-all duration-300 ease-in-out">
                        ₹ {product.data.price}
                      </span>
                    )}

                    <span className="text-sm text-gray-500 font-medium">
                      {variantStock !== null
                        ? variantStock > 0
                          ? `${variantStock} in stock`
                          : "Out of stock"
                        : product.data.stockQuantity > 0
                        ? `${product.data.stockQuantity} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  <div className="text-base text-gray-700 whitespace-pre-line">
                    {product.data.description}
                  </div>

                  {/* Brand and Tags */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {product.data.brand && product.data.brand.trim() !== "" && (
                      <span>Brand: {product.data.brand}</span>
                    )}

                    {product.data.tags &&
                      product.data.tags.some((tag) => tag.trim() !== "") && (
                        <span>
                          Tags:{" "}
                          {product.data.tags
                            .filter((tag) => tag.trim() !== "")
                            .join(", ")}
                        </span>
                      )}
                  </div>

                  {/* Variants */}
                  {product.data.variants &&
                  (product.data.variants.some((v) => v.color) ||
                    product.data.variants.some((v) => v.size)) ? (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2">
                        Select Variants
                      </h4>
                      <div className="grid grid-cols-2 gap-6">
                        {/* Color Options */}
                        {product.data.variants.some(
                          (variant) => variant.color
                        ) && (
                          <div>
                            <h5 className="font-semibold">Color</h5>
                            <div className="flex flex-wrap gap-2">
                              {product.data.variants
                                .filter(
                                  (variant, index, self) =>
                                    index ===
                                    self.findIndex(
                                      (t) => t.color === variant.color
                                    )
                                )
                                .map(
                                  (variant, index) =>
                                    variant.color && (
                                      <label
                                        key={index}
                                        className={`cursor-pointer w-10 h-10 border rounded-full transition-all duration-300 ease-in-out transform ${
                                          selectedVariant?.color ===
                                          variant.color
                                            ? "border-orange-600 ring-2 ring-orange-500 scale-110"
                                            : "border-gray-300 hover:ring-2 hover:ring-orange-200"
                                        }`}
                                        style={{
                                          backgroundColor: variant.color,
                                        }}
                                        onClick={() => {
                                          if (
                                            typeof variant.color === "string" &&
                                            variant.color.trim() !== ""
                                          ) {
                                            handleVariantChange(
                                              "color",
                                              variant.color
                                            );
                                          }
                                        }}
                                      />
                                    )
                                )}
                            </div>
                          </div>
                        )}

                        {/* Size Options */}
                        {product.data.variants.some(
                          (variant) => variant.size
                        ) && (
                          <div>
                            <h5 className="font-semibold">Size</h5>
                            <div className="flex flex-wrap gap-2">
                              {product.data.variants
                                .filter(
                                  (variant, index, self) =>
                                    index ===
                                    self.findIndex(
                                      (t) => t.size === variant.size
                                    )
                                )
                                .map(
                                  (variant, index) =>
                                    variant.size && (
                                      <label
                                        key={index}
                                        className={`cursor-pointer px-4 py-2 border rounded-lg transition-all duration-300 ease-in-out ${
                                          selectedVariant?.size === variant.size
                                            ? "bg-orange-600 text-white border-orange-600 scale-110"
                                            : "border-gray-300 hover:bg-orange-100"
                                        }`}
                                        onClick={() => {
                                          if (
                                            typeof variant.size === "string" &&
                                            variant.size.trim() !== ""
                                          ) {
                                            handleVariantChange(
                                              "size",
                                              variant.size
                                            );
                                          }
                                        }}
                                      >
                                        {variant.size}
                                      </label>
                                    )
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-6 text-gray-500 italic">
                      This product comes as-is, with no selectable options. Just
                      add it to your cart and enjoy your purchase!
                    </p>
                  )}
                  {product?.data?.type === "affiliate" && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm mb-4">
                      <strong>Disclaimer:</strong> This product contains
                      affiliate links. We may earn a small commission if you
                      make a purchase through our link — at no extra cost to
                      you.
                    </div>
                  )}
                  {/* Add to Cart & Buy Now Buttons */}
                  <div className="mt-6 flex flex-col gap-4">
                    {product.data.type === "affiliate" ? (
                      <a
                        href={product.data.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-green-600 text-white text-center font-semibold rounded-md transition-all duration-300 hover:bg-green-700"
                      >
                        Buy Now
                      </a>
                    ) : (
                      <>
                        <button
                          onClick={handleAddToCart}
                          disabled={isLoading || stockQuantity <= 0}
                          className={`w-full py-3 bg-orange-600 text-white font-semibold rounded-md transition-all duration-300 ${
                            isLoading || stockQuantity <= 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-orange-700"
                          }`}
                        >
                          {isLoading ? "Adding..." : "Add to Cart"}
                        </button>
                        <button
                          onClick={handleBuyNow}
                          disabled={isLoading || stockQuantity <= 0}
                          className={`w-full py-3 bg-green-600 text-white font-semibold rounded-md transition-all duration-300 ${
                            isLoading || stockQuantity <= 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-green-700"
                          }`}
                        >
                          {isLoading ? "Processing..." : "Buy Now"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* seller profile */}

            {sellerProfile && (
              <SellerProfileCard
                sellerProfile={sellerProfile}
                sellerRating={sellerRating}
                isFollowing={isFollowing}
                followersCount={followersCount}
                handleFollowToggle={handleFollowToggle}
              />
            )}

            {/* Additional Information */}
            {(longDesc ||
              product?.data?.warranty ||
              product?.data?.weight ||
              (Array.isArray(product.data.features) &&
                product.data.features.length > 0)) && (
              <div className="mt-8 text-gray-700 bg-white p-4 border border-gray-200 rounded-lg shadow-md">
                {longDesc && (
                  <section className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      📄 Product Details
                    </h4>
                    <p className="text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {displayDesc}
                    </p>
                    {isLong && (
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
                      >
                        {showFullDescription ? "See less ▲" : "See more ▼"}
                      </button>
                    )}
                  </section>
                )}

                {product?.data?.warranty && (
                  <section className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      🛠 Warranty
                    </h4>
                    <p className="text-base text-gray-600">
                      {product.data.warranty}
                    </p>
                  </section>
                )}

                {product?.data?.weight && (
                  <section className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      ⚖️ Weight
                    </h4>
                    <p className="text-base text-gray-600">
                      {product.data.weight} kg
                    </p>
                  </section>
                )}

                {Array.isArray(product.data.features) &&
                  product.data.features.length > 0 && (
                    <section className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        🔍 Key Features
                      </h4>
                      <ul className="list-none space-y-2">
                        {product.data.features.map(
                          (feature: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start text-base text-gray-600"
                            >
                              <span className="mr-2 mt-1 text-green-500">
                                ✅
                              </span>
                              <span>{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </section>
                  )}
              </div>
            )}
          </div>

          <div className="pt-10">
            <ReviewsSection
              reviews={reviews}
              setReviews={setReviews}
              onLikeReview={handleLikeReview}
              onReplyReview={handleReplyReview}
              onDeleteReply={handleDeleteReply}
              onUpdateReply={onUpdateReply}
            />
          </div>
        </main>
      )}

      <FloatingIcons
        sellerNumber={sellerProfile?.brand?.whatsapp}
        phone={sellerProfile?.brand?.phone}
      />
    </>
  );
};

export default ProductDetails;
