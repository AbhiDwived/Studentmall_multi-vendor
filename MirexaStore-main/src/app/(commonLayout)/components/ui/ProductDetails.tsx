// "use client";
// import React, { useState } from "react";

// interface ProductDetailsProps {
//   product: {
//     data: {
//       _id: string;
//       name: string;
//       description: string;
//       price: number;
//       stockQuantity: number;
//       category: string;
//       productImages: string[];
//       reviews: { rating: number; comment: string }[]; // Reviews array
//     };
//   };
// }

// const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
//   const {
//     name,
//     description,
//     price,
//     stockQuantity,
//     category,
//     productImages,
//     reviews,
//   } = product.data;

//   const [cartQuantity, setCartQuantity] = useState(1); // Quantity for the Add to Cart button
//   const [newRating, setNewRating] = useState(1); // Rating for the new review (1-5 stars)
//   const [newComment, setNewComment] = useState(""); // Comment for the new review
//   const [updatedReviews, setUpdatedReviews] = useState(reviews); // State to manage updated reviews

//   // Function to handle adding to cart
//   const handleAddToCart = () => {
//     if (stockQuantity >= cartQuantity) {
//       console.log(`Added ${cartQuantity} ${name}(s) to the cart.`);
//       // Here, you can implement cart functionality, such as saving the cart to a context or local storage
//     } else {
//       console.log("Not enough stock available.");
//     }
//   };

//   // Function to handle submitting a new review
//   const handleSubmitReview = () => {
//     if (newComment.trim() === "") {
//       alert("Please write a comment.");
//       return;
//     }

//     const newReview = { rating: newRating, comment: newComment };
//     setUpdatedReviews([...updatedReviews, newReview]);
//     setNewRating(1); // Reset rating to 1 after submission
//     setNewComment(""); // Clear comment input after submission
//     console.log("Review submitted:", newReview);
//   };

//   // Handle case when there are no product images
//   if (!productImages || productImages.length === 0) {
//     return (
//       <div className="flex flex-col gap-8">
//         <h1 className="text-2xl font-bold">{name}</h1>
//         <p>No images available for this product.</p>
//         {/* Display other product details */}
//       </div>
//     );
//   }

//   return (
//     <div className="product-details pt-5 flex flex-col gap-8 px-4 sm:px-8 lg:px-16">
//       <h1 className="text-3xl font-semibold">{name}</h1>
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Left side - Product Images */}
//         <div className="w-full md:w-1/2 flex justify-center items-center">
//           <div className="flex flex-wrap gap-4 justify-center">
//             {productImages.map((image, index) => (
//               <img
//                 key={index}
//                 src={image}
//                 alt={name}
//                 className="w-48 h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right side - Product Information */}
//         <div className="w-full md:w-1/2">
//           <p className="mt-4 text-lg">{description}</p>
//           <p className="mt-4 text-xl font-semibold">${price}</p>
//           <p className="mt-2 text-gray-600">Category: {category}</p>
//           <p
//             className={`mt-2 text-gray-600 ${
//               stockQuantity > 0 ? "" : "text-red-600"
//             }`}
//           >
//             {stockQuantity > 0 ? `In stock: ${stockQuantity}` : "Out of stock"}
//           </p>

//           {/* Add to Cart */}
//           <div className="mt-4 flex items-center">
//             <label htmlFor="cartQuantity" className="mr-2 text-lg">
//               Quantity:
//             </label>
//             <input
//               type="number"
//               id="cartQuantity"
//               value={cartQuantity}
//               min="1"
//               max={stockQuantity}
//               onChange={(e) => setCartQuantity(Number(e.target.value))}
//               className="border border-gray-400 rounded-md py-1 px-2 text-lg"
//             />
//             <button
//               onClick={handleAddToCart}
//               className="ml-4 py-2 px-6 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300"
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Product Reviews */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold">Reviews</h2>
//         {updatedReviews && updatedReviews.length > 0 ? (
//           <div>
//             {updatedReviews.map((review, index) => (
//               <div
//                 key={index}
//                 className="review mt-4 border-b border-gray-300 pb-4"
//               >
//                 <div className="flex justify-between">
//                   <span className="font-semibold">
//                     Rating: {review.rating}★
//                   </span>
//                 </div>
//                 <p className="mt-2">{review.comment}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No reviews yet. Be the first to leave a review!</p>
//         )}
//       </div>

//       {/* Add Review Section */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold">Leave a Review</h2>
//         <div className="mt-4">
//           <label htmlFor="rating" className="mr-2">
//             Rating:
//           </label>
//           <select
//             id="rating"
//             value={newRating}
//             onChange={(e) => setNewRating(Number(e.target.value))}
//             className="border border-gray-400 rounded-md py-1 px-2"
//           >
//             {[1, 2, 3, 4, 5].map((star) => (
//               <option key={star} value={star}>
//                 {star} Star{star > 1 ? "s" : ""}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mt-4">
//           <label htmlFor="comment" className="mr-2">
//             Comment:
//           </label>
//           <textarea
//             id="comment"
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             rows={4}
//             className="border border-gray-400 rounded-md py-2 px-3 w-full"
//           />
//         </div>

//         <button
//           onClick={handleSubmitReview}
//           className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//         >
//           Submit Review
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
