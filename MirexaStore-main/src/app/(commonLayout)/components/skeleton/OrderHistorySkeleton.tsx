const OrderHistorySkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto my-8 px-4 md:px-8 animate-pulse">
      <h1 className="text-3xl font-semibold text-center mb-8 bg-gray-300 rounded w-64 h-10 mx-auto"></h1>

      <div className="space-y-8">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
              <div className="h-8 bg-gray-300 rounded w-40"></div>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>

            {/* Status and Total */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
              <div className="h-6 bg-gray-300 rounded-full w-24"></div>
              <div className="h-6 bg-gray-300 rounded w-40"></div>
            </div>

            {/* Payment info */}
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-300 rounded w-56"></div>
            </div>

            {/* Items */}
            <div className="mt-6 space-y-6">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>

              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row justify-between items-center py-4 border-b border-gray-300 mb-4"
                >
                  {/* Image Placeholder */}
                  <div className="w-24 h-24 bg-gray-300 rounded-md shadow-sm"></div>

                  <div className="ml-6 flex-1 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-48"></div>
                    <div className="h-4 bg-gray-300 rounded w-64"></div>

                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </div>

                    {/* Rating stars placeholder */}
                    <div className="flex space-x-1 mt-4">
                      {[...Array(5)].map((_, starIdx) => (
                        <div
                          key={starIdx}
                          className="w-6 h-6 bg-gray-300 rounded"
                        ></div>
                      ))}
                    </div>

                    {/* Review textarea placeholder */}
                    <div className="mt-4 h-20 bg-gray-300 rounded w-full"></div>

                    {/* Media upload placeholders */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(3)].map((_, mediaIdx) => (
                        <div
                          key={mediaIdx}
                          className="w-full h-24 bg-gray-300 rounded shadow"
                        ></div>
                      ))}
                    </div>

                    {/* Submit button placeholder */}
                    <div className="mt-4 h-10 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistorySkeleton;
