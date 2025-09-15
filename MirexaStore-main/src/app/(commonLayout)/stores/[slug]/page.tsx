// src/app/(commonLayout)/store/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";
import StorePageClient from "../../components/ui/StorePageClient";

// Define the types for Brand and sellerProfile
interface Brand {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logo?: string;
  banner?: string;
  location?: string;
  verified?: boolean;
  joinedAt?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
}

interface SellerProfile {
  _id: string;
  userEmail: string;
  brand: Brand;
}

// ✅ Create a proper PageProps interface
interface PageProps {
  params: Promise<{ slug: string }>; // params is a Promise, so you need to await it
}

// ✅ Helper function to fetch seller data by slug
async function getsellerBySlug(slug: string): Promise<SellerProfile | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seller/slug/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Error fetching seller:", error);
    return null;
  }
}

// ✅ Metadata generation for the store page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // params is a Promise that needs to be awaited
}): Promise<Metadata> {
  // Await the params to get the slug
  const { slug } = await params;

  const seller = await getsellerBySlug(slug);

  if (!seller) {
    return {
      title: "Store Not Found - MirexaStore",
      description:
        "The store you're looking for does not exist or is currently unavailable.",
    };
  }

  const { name, description, logo, socialLinks } = seller.brand;

  return {
    title: `${name} Store | MirexaStore`,
    description:
      description?.slice(0, 160) || "Explore products from this store.",
    openGraph: {
      title: `${name} Store`,
      description: description,
      images: [
        {
          url: logo || "/default-logo.png", // Fallback to default logo if no logo is available
          width: 800,
          height: 600,
          alt: `${name} Store Logo`,
        },
      ],
    },
  };
}

// Main Store Page Component
export default async function StorePage({ params }: PageProps) {
  // Await params to get the slug
  const { slug } = await params;

  const seller = await getsellerBySlug(slug);

  if (!seller) return notFound(); // Redirect to notFound page if seller is not found

  return <StorePageClient seller={seller} />;
}
