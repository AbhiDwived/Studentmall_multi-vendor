"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { Pagination } from "@heroui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface Reply {
  _id: string;
  userId: string;
  comment: string;
  userName: string;
  timestamp: string;
  isEditing: boolean;
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
  replies: Reply[];
  media?: MediaItem[];
}

interface ReviewsSectionProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  onLikeReview: (reviewId: string) => void;
  onReplyReview: (reviewId: string, replyComment: string) => void;
  onDeleteReply: (reviewId: string, replyId: string) => void;
  onUpdateReply: (
    reviewId: string,
    replyId: string,
    updatedReply: string
  ) => void;
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  setReviews,
  onLikeReview,
  onReplyReview,
  onDeleteReply,
  onUpdateReply,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [replyInput, setReplyInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{
    _id: string;
    name: string;
  } | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: string;
    url: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user._id) {
        setLoggedInUser(user);
      }
    }
  }, []);

  const calculateRatingDistribution = () => {
    const ratingCounts: Record<1 | 2 | 3 | 4 | 5, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    reviews.forEach((review) => {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      ratingCounts[rating]++;
    });
    return ratingCounts;
  };

  const ratings = calculateRatingDistribution();
  const totalReviews = reviews.length;
  const totalComments = reviews.reduce(
    (acc, review) => acc + review.replies.length,
    0
  );
  const averageRating = totalReviews
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
    : 0;

  const handleSendReply = (reviewId: string) => {
    if (replyInput.trim()) {
      onReplyReview(reviewId, replyInput);
      setReplyInput("");
      setReplyingTo(null);
    } else {
      toast.warn("Please enter a reply before sending.");
    }
  };

  const handleDeleteReply = (reviewId: string, replyId: string) => {
    onDeleteReply(reviewId, replyId);
    const updatedReviews = reviews.map((review) => {
      if (review._id === reviewId) {
        return {
          ...review,
          replies: review.replies.filter((reply) => reply._id !== replyId),
        };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  const handleEditReply = async (
    reviewId: string,
    replyId: string,
    newComment: string
  ) => {
    if (!reviewId || !replyId) {
      toast.error("Review ID or Reply ID is missing!");
      return;
    }

    try {
      await axios.put(`/api/reviews/edit-reply/${reviewId}/${replyId}`, {
        updatedComment: newComment,
      });

      const updatedReviews = reviews.map((review) => {
        if (review._id === reviewId) {
          return {
            ...review,
            replies: review.replies.map((reply) =>
              reply._id === replyId ? { ...reply, comment: newComment } : reply
            ),
          };
        }
        return review;
      });

      setReviews(updatedReviews);
      toast.success("Reply updated successfully!");
    } catch (err) {
      const error = err as AxiosError<any>;
      console.error(error.response?.data || error.message);
      toast.error("Failed to update reply.");
    }
  };

  return (
    <div className="mt-10 w-full px-4 sm:px-6 lg:px-10">
      {/* Summary Header */}
      <div className="py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Customer Reviews
        </h2>
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <p className="text-5xl font-bold text-yellow-400">
                {averageRating.toFixed(1)}
              </p>
              <p className="text-xl text-gray-700 mt-2">out of 5</p>
              <div className="flex justify-center mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`w-6 h-6 ${
                      index < Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.367 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.65 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-2">
                {totalReviews} Reviews | {totalComments} Comments
              </p>
            </div>

            <div className="hidden md:block border-r border-gray-200"></div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings[star as 1 | 2 | 3 | 4 | 5];
                const percent = totalReviews ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center space-x-3">
                    <span className="w-6 text-sm font-medium">{star}★</span>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm text-gray-700">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {currentReviews.map((review) => (
        <div
          key={review._id}
          className="w-full bg-white border rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white">
                {review.userName?.[0] || "?"}
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {review.userId.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">
                  {review.createdAt ? formatDate(review.updatedAt) : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index < review.rating ? "text-yellow-500" : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            {/* <div className="flex items-center">
              {review.rating === 5 ? (
                <div className="w-24 h-8">
                  <DotLottieReact
                    src="https://lottie.host/82df4844-2e40-4b13-825e-9bc4ad5c8f23/Fpgi7xYGW3.lottie"
                    loop
                    autoplay
                  />
                </div>
              ) : (
                Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))
              )}
            </div> */}
          </div>

          <p className="mt-3">{review.comment}</p>

          {/* Media */}
          {review.media && review.media.length > 0 && (
            <>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {review.media.map((item, index) =>
                  item.type === "image" ? (
                    <div
                      key={index}
                      className="relative w-full h-32 cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => setSelectedMedia(item)}
                    >
                      <Image
                        src={item.url}
                        alt={`review-media-${index}`}
                        layout="fill"
                        objectFit="cover"
                        className="hover:brightness-95 transition"
                      />
                    </div>
                  ) : (
                    <video
                      key={index}
                      onClick={(e) => {
                        const video = e.currentTarget;
                        if (video.paused) {
                          video.play();
                          setIsPlaying(true);
                        } else {
                          video.pause();
                          setIsPlaying(false);
                        }
                      }}
                      controls
                      className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    >
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )
                )}
              </div>

              {/* Modal */}
              <Dialog
                open={!!selectedMedia}
                onClose={() => setSelectedMedia(null)}
                className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-70"
              >
                <Dialog.Panel className="max-w-4xl w-full p-4 relative">
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="absolute top-4 right-4 text-white text-2xl"
                  >
                    &times;
                  </button>
                  {selectedMedia?.type === "image" && (
                    <div className="relative w-full h-auto aspect-video">
                      <Image
                        src={selectedMedia.url}
                        alt="modal-preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  )}
                </Dialog.Panel>
              </Dialog>
            </>
          )}

          {/* Like / Reply */}
          <div className="mt-4 flex items-center space-x-6">
            <button
              onClick={() => onLikeReview(review._id)}
              className="text-blue-600 hover:text-blue-800"
            >
              👍 {review.likes.length}
            </button>
            <button
              onClick={() =>
                setReplyingTo(replyingTo === review._id ? null : review._id)
              }
              className="text-green-600 hover:text-green-800"
            >
              💬 Reply
            </button>
          </div>

          {/* Replies */}
          <div className="mt-4 ml-6">
            {review.replies.length > 0 ? (
              review.replies.map((reply) => (
                <div
                  key={reply._id}
                  className="flex items-center justify-between bg-gray-100 m-1 p-3 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
                      {reply.userName?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {reply.userName}
                      </p>
                      <p className="text-sm text-gray-700">{reply.comment}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(reply.timestamp)}
                      </p>
                    </div>
                  </div>
                  {reply.userId === loggedInUser?._id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteReply(review._id, reply._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No replies yet.</p>
            )}
          </div>

          {replyingTo === review._id && (
            <div className="mt-4 flex items-center">
              <input
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={() => handleSendReply(review._id)}
                className="bg-green-600 text-white px-4 py-2"
              >
                Send
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          showControls
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
          classNames={{
            cursor: "bg-[#F85606] text-white", // active page style
          }}
        />
      </div>
    </div>
  );
};

export default ReviewsSection;
