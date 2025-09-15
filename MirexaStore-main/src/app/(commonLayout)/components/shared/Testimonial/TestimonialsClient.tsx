"use client";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Pagination, Skeleton } from "@heroui/react";

interface Testimonial {
  createdAt: string;
  userName: string;
  review: string;
  image: string;
  rating: number;
}

interface Props {
  initialReviews: Testimonial[];
  totalReviews: number;
  totalPages: number;
}

const TestimonialsClient: FC<Props> = ({
  initialReviews,
  totalReviews,
  totalPages: initialTotalPages,
}) => {
  const [testimonials, setTestimonials] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  useEffect(() => {
    if (currentPage === 1) return; // SSR already loaded

    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/all?page=${currentPage}&limit=6`
        );
        const reviews = res.data.data.map((review: any) => ({
          userName: review.userName || "Anonymous",
          review: review.comment,
          image: generateFallbackImage(review.userName),
          rating: review.rating,
          createdAt: new Date(review.createdAt).toLocaleDateString("en-US"),
        }));
        setTestimonials(reviews);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [currentPage]);

  const generateFallbackImage = (userName: string) => {
    const letter = userName ? userName.charAt(0).toUpperCase() : "U";
    return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjhmOGY4Ii8+PHRleHQgeD0iMjUiIHk9IjMwIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmIj4${letter}</text></svg>`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        What Our Customers Say
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-lg p-4 rounded-lg space-y-4"
              >
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          : testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-lg p-4 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.userName}
                    width={64}
                    height={64}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h2 className="font-semibold text-lg truncate">
                      {testimonial.userName}
                    </h2>
                    <p className="text-yellow-400">
                      {"★".repeat(testimonial.rating)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.createdAt}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  {testimonial.review}
                </p>
              </div>
            ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            showControls
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            classNames={{
              cursor:
                "bg-[#F85606] text-white border border-[#F85606] hover:opacity-90",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TestimonialsClient;
