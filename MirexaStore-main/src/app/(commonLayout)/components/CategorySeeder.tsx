"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

const CategorySeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const categories = [
    { name: "Electronics", slug: "electronics", bannerImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400" },
    { name: "Wearables", slug: "wearables", bannerImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { name: "Audio", slug: "audio", bannerImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { name: "Accessories", slug: "accessories", bannerImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
    { name: "Bags", slug: "bags", bannerImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
    { name: "Cameras", slug: "cameras", bannerImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400" },
    { name: "Home Appliances", slug: "home-appliances", bannerImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
    { name: "Kitchen Appliances", slug: "kitchen-appliances", bannerImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" }
  ];

  const seedCategories = async () => {
    setIsSeeding(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login as admin first");
      setIsSeeding(false);
      return;
    }

    let successCount = 0;
    
    for (const category of categories) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(category)
        });

        if (response.ok) {
          successCount++;
        }
      } catch (error) {
        console.error(`Failed to add ${category.name}:`, error);
      }
    }
    
    toast.success(`Added ${successCount} categories successfully!`);
    setIsSeeding(false);
    window.location.reload(); // Refresh to show new categories
  };

  return null;
};

export default CategorySeeder;
