// src/app/(commonLayout)/product/[id]/page.tsx

import { notFound } from "next/navigation";
import RelatedProduct from "../RelatedProduct";
import ProductDetails from "../productDetails";

type tParams = { id: string };
export async function generateMetadata({ params }: { params: Promise<tParams> }) {
  const { id } = await params;

  try {
    // Check if id is a valid ObjectId (24 character hex string) or a URL slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    // Use appropriate endpoint based on whether it's an ID or slug
    const apiUrl = isObjectId 
      ? `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/product/url-slug/${id}`;
      
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return {
        title: "Product Not Found - MirexaStore",
        description:
          "The product you're looking for does not exist or is currently unavailable.",
      };
    }

    const productData = await res.json();
    const product = productData.data;

    return {
      title: product.name || "Product - MirexaStore",
      description:
        product.description?.slice(0, 160) ||
        "Explore premium products from MirexaStore.",
      keywords: product.tags?.join(', ') || '',
      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: product.productImages[0],
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Page - MirexaStore",
      description: "Explore the finest products at MirexaStore.",
    };
  }
}

const ProductPage = async ({ params }: { params: Promise<tParams> }) => {
  const { id } = await params;

  try {
    // Check if id is a valid ObjectId (24 character hex string) or a URL slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    // Use appropriate endpoint based on whether it's an ID or slug
    const apiUrl = isObjectId 
      ? `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/product/url-slug/${id}`;
      
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      notFound();
      return; // Ensure the function exits here if not found
    }

    const productData = await response.json();

    if (!productData || !productData.data) {
      notFound();
      return;
    }
    
    // Ensure the product data has the expected structure
    const product = {
      ...productData,
      data: {
        ...productData.data,
        category: productData.data.category || 'Electronics'
      }
    };

    const relatedProductsUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/category/${product.data.category}`;
    const relatedProductsResponse = await fetch(relatedProductsUrl, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });

    const relatedProducts = relatedProductsResponse.ok
      ? await relatedProductsResponse.json()
      : { data: [] };

    // ✅ Filter out the current product
    const currentProductId = product.data._id;
    const relatedProductsData =
      relatedProducts?.data?.filter(
        (prod: any) => prod._id !== currentProductId
      ) || [];

    return (
      <>
        <ProductDetails
          product={product}
          relatedProducts={relatedProductsData}
        />

        {Array.isArray(relatedProductsData) &&
        relatedProductsData.length > 0 ? (
          <RelatedProduct relatedProducts={relatedProductsData} />
        ) : (
          <p className="text-left lg:ml-6 ml-5 py-8 lg:px-4">
            No similar items available right now. Please check back later!
          </p>
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    notFound();
  }
};

// This will treat this page as a static page

export default ProductPage;
