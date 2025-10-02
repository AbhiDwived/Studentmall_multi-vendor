"use client";
import { FC } from "react";

interface Props {
  initialReviews: any[];
  totalReviews: number;
  totalPages: number;
}

const TestimonialsClient: FC<Props> = ({ initialReviews }) => {
  // Use dynamic testimonials, ensure minimum 5 for proper display
  const testimonials = initialReviews.length >= 5 
    ? initialReviews 
    : [...initialReviews, ...initialReviews, ...initialReviews].slice(0, 5);

  // Create duplicated array for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <h1 className="text-3xl font-bold text-center mb-3 sm:mb-6">
        What Our Customers Say
      </h1>

      <div className="relative overflow-hidden">
        <div 
          className="flex"
          style={{
            width: '200%',
            animation: 'scroll 20s linear infinite'
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-1/5 px-3"
            >
              <div className="card bg-base-100 shadow-lg p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    {testimonial.userName.charAt(0)}
                  </div>
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
                <p className="text-gray-600 truncate">
                  {testimonial.review}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default TestimonialsClient;