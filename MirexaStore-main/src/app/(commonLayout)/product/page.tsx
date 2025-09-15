// src/app/components/ProductSection.server.tsx

import ProductCart from "../components/ui/ProductCart";

const Product = async () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/product`;

  const response = await fetch(apiUrl, {
    next: { revalidate: 60 }, // ✅ Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const responseData = await response.json();
  const products = responseData.data;

  // Filter for featured products
  const featuredProducts = products.filter(
    (product: { status: string; isFeatured: any }) =>
      product.isFeatured && product.status === "active"
  );
  // Filter for new arrival products
  const newArrivalProducts = products.filter(
    (product: { status: string; isNewArrival: any }) =>
      product.isNewArrival && product.status === "active"
  );

  return (
    <div>
      {/* New Arrivals Section */}
      <section>
        <h2 className="text-3xl pt-7 font-semibold text-center mb-8 text-gray-800">
          New Arrivals
        </h2>
        <ProductCart products={newArrivalProducts} />
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Featured Products
        </h2>
        <ProductCart products={featuredProducts} />
      </section>

      {/* All Products Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          All Products
        </h2>
        <ProductCart products={products} />
      </section>
    </div>
  );
};

export default Product;
