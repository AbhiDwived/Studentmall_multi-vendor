"use client";
import { useState } from "react";

export const SellerDescription = ({ description }: { description: string }) => {
  const [expanded, setExpanded] = useState(false);

  const isLong = description.length > 200; // approx 100 words
  const displayedText = expanded
    ? description
    : description.slice(0, 200) + (isLong ? "..." : "");

  return (
    <div className="mt-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
      {displayedText}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-orange-600 font-medium ml-2 hover:underline"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};
