// CategoryPage.tsx
"use client";

import { useEffect, useState } from "react";
import CategorySection from "../../components/ui/CategorySection";
import CategorySkeleton from "../../components/skeleton/CategorySkeleton";

interface Category {
  _id: string;
  name: string;
  slug: string;
  bannerImage: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <CategorySkeleton />;
  return <CategorySection categories={categories} />;
}
