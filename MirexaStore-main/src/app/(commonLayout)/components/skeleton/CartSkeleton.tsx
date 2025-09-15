const CartSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-400 mb-10 bg-gray-300 rounded w-64 mx-auto h-12"></h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items Skeleton */}
          <div className="md:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative flex items-center bg-white p-5 rounded-xl shadow-md"
              >
                {/* Remove button placeholder */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-gray-300 rounded-full"></div>

                {/* Image placeholder */}
                <div className="w-24 h-24 rounded-lg bg-gray-300"></div>

                {/* Text placeholders */}
                <div className="ml-6 flex-1 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="h-6 bg-gray-300 rounded w-6"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-20 space-y-6">
            <div className="h-8 bg-gray-300 rounded w-48"></div>

            {/* Coupon Input */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-40"></div>
              <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-gray-300 rounded-l-lg"></div>
                <div className="w-24 h-10 bg-gray-300 rounded-r-lg"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gray-300 rounded w-24"></div>
            </div>

            {/* Checkout Button */}
            <div className="h-12 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
