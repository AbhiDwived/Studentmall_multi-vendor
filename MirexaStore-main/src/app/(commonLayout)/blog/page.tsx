"use client";

import Image from "next/image";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "Top 5 Shopping Trends in 2025 You Can’t Miss",
    excerpt:
      "Discover the most exciting eCommerce trends in 2025, including AI-driven personalization, voice shopping, and sustainable packaging.",
    image:
      "https://res.cloudinary.com/dwg8d0bfp/image/upload/v1754317012/online_shopping_concept_4_c9c3bd35fd_vwqby2.jpg",
    slug: "shopping-trends-2025",
    content: `
      <p>In 2025, shopping is transforming with AI, voice assistants, and eco-conscious consumers leading the way. Personalization will be a major driver of conversions, and customers will expect smarter, faster interactions.</p>
      <p>Brands adopting sustainable practices and faster delivery logistics will lead the competition.</p>
    `,
  },
  {
    id: 2,
    title: "How to Choose the Right Product for Your Online Store",
    excerpt:
      "Struggling to pick products that actually sell? Learn how to identify winning products, analyze demand, and find profitable niches.",
    image:
      "https://res.cloudinary.com/dwg8d0bfp/image/upload/v1754317086/1_qGQCsrs3O4whFaqPPiyl2g_qndcrd.png",
    slug: "choose-right-product-online-store",
    content: `
      <p>Choosing the right product begins with understanding your target customer. Start by solving a specific pain point or need.</p>
      <p>Research trends, test small batches, and always analyze feedback and sales data before scaling.</p>
    `,
  },
  {
    id: 3,
    title: "Why Fast Shipping Is the Future of eCommerce",
    excerpt:
      "Speed matters more than ever. We break down how 1-day and same-day delivery are changing customer expectations and boosting conversions.",
    image:
      "https://res.cloudinary.com/dwg8d0bfp/image/upload/v1754317165/future-of-ecommerce-thumbnail_oatp1u.jpg",
    slug: "importance-of-fast-shipping",
    content: `
      <p>Customers now expect fast shipping. 1-day and same-day delivery is becoming standard thanks to companies like Amazon.</p>
      <p>To stay competitive, online stores must optimize their fulfillment process or use third-party logistics solutions.</p>
    `,
  },
  {
    id: 4,
    title: "Creating a Brand That Builds Customer Trust",
    excerpt:
      "A strong brand is more than a logo. Learn the key ingredients to build trust, boost retention, and drive word-of-mouth sales.",
    image:
      "https://res.cloudinary.com/dwg8d0bfp/image/upload/v1754317210/How-to-Build-Brand-Trust-With-Surveys-01-01_gs7hcs.png",
    slug: "build-customer-trust-branding",
    content: `
      <p>Trust is the foundation of any successful brand. Build it through consistency, quality products, real testimonials, and great support.</p>
      <p>Your brand’s story, voice, and values must align with your audience’s expectations.</p>
    `,
  },
];

const BlogSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        From Our Blog
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/blog/${blog.slug}`}>
              <Image
                src={blog.image}
                alt={blog.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>
              {/* <Link
                href={`/blog/${blog.slug}`}
                className="text-orange-600 font-medium hover:underline text-sm"
              >
                Read More →
              </Link> */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
