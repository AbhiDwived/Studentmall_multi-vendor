import React from "react";

export default function CategorySkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-8 text-center">
        🛒 Loading Categories...
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="border rounded-lg bg-white shadow-sm p-3 flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-md mb-3" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
