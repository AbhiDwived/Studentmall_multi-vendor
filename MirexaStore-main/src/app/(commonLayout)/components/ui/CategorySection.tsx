// "use client";

// import Image from "next/image";
// import Link from "next/link";

// interface Category {
//   _id: string;
//   name: string;
//   slug: string;
//   bannerImage: string;
// }

// const CategorySection = ({ categories }: { categories: Category[] }) => {
//   return (
//     <section className="py-10 bg-white">
//       <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
//         Categories
//       </h2>

//       <div className="w-full px-4">
//         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           {categories.map((category) => (
//             <Link
//               key={category._id}
//               href={`/product/category/${category.slug}`}
//             >
//               <div className="flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer">
//                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 shadow-md">
//                   <Image
//                     src={(
//                       category.bannerImage || "https://via.placeholder.com/100"
//                     ).replace("http://", "https://")}
//                     alt={category.name}
//                     width={100}
//                     height={100}
//                     className="object-cover w-full h-full"
//                     unoptimized
//                   />
//                 </div>
//                 <p className="text-sm md:text-base font-medium text-[#F85606] mt-2 text-center">
//                   {category.name}
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CategorySection;

"use client";

import Link from "next/link";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
  bannerImage: string;
}

interface Props {
  categories: Category[];
}

export default function CategorySection({ categories }: Props) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        No categories available now.
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
        🛒 Browse Categories
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={{
              pathname: "/products",
              query: { category: category.slug },
            }}
            className="group border rounded-lg bg-white shadow-sm hover:shadow-md transition flex flex-col items-center text-center p-3"
          >
            <div className="w-24 h-24 relative rounded-md overflow-hidden bg-gray-100">
              <Image
                src={category.bannerImage}
                alt={category.name}
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-800 group-hover:text-[#F6550C] transition">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
