"use client";

const ReturnRefundPolicy = () => {
  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Return & Refund Policy / রিটার্ন ও রিফান্ড পলিসি
        </h1>

        <div className="space-y-12 bg-white shadow-lg rounded-2xl p-8 md:p-12">
          <p className="text-gray-600 leading-relaxed text-lg">
            Thank you for shopping at{" "}
            <span className="font-semibold text-gray-800">MirexaStore</span>. If
            you are not entirely satisfied with your purchase, we&apos;re here
            to help you. Please read our Return & Refund Policy carefully.
            <br />
            ধন্যবাদ,{" "}
            <span className="font-semibold text-gray-800">MirexaStore</span> এ
            কেনাকাটা করার জন্য। আপনি যদি আপনার কেনাকাটা নিয়ে পুরোপুরি সন্তুষ্ট
            না হন, আমরা আপনাকে সাহায্য করতে এখানে আছি। দয়া করে আমাদের রিটার্ন ও
            রিফান্ড পলিসিটি সতর্কতার সাথে পড়ুন।
          </p>

          {/* Returns Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Returns / রিটার্ন
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You have <span className="font-semibold">7 calendar days</span> to
              return an item from the date you received it. To be eligible for a
              return, your item must be unused and in the same condition that
              you received it. The product must be in its original packaging,
              along with the receipt or proof of purchase.
              <br />
              আপনি পণ্য গ্রহণের তারিখ থেকে{" "}
              <span className="font-semibold">৭ ক্যালেন্ডার দিন</span> মধ্যে
              একটি পণ্য রিটার্ন করতে পারবেন। রিটার্নের জন্য, পণ্যটি অপ্রচলিত এবং
              আপনি যেভাবে পেয়েছিলেন ঠিক সেভাবে থাকতে হবে। পণ্যটির আসল
              প্যাকেজিংসহ রসিদ বা ক্রয়ের প্রমাণ থাকা আবশ্যক।
            </p>
          </div>

          {/* Refunds Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Refunds / রিফান্ড
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Once we receive your returned item, we will inspect it and notify
              you regarding the status of your refund. If approved, your refund
              will be processed to your original method of payment. The time to
              receive credit may vary depending on your bank or card issuer’s
              policies.
              <br />
              একবার আমরা আপনার রিটার্নকৃত পণ্যটি গ্রহণ করলে, আমরা এটি পরীক্ষা
              করব এবং রিফান্ডের অবস্থান সম্পর্কে আপনাকে জানাব। অনুমোদিত হলে,
              আপনার রিফান্ড আপনার মূল পেমেন্ট পদ্ধতিতে প্রক্রিয়া করা হবে।
              ক্রেডিট পাওয়ার সময় আপনার ব্যাংক বা কার্ড ইস্যুকারের নীতির উপর
              নির্ভর করে সময় পার হতে পারে।
            </p>
          </div>

          {/* Shipping Costs Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Shipping Costs / শিপিং খরচ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Customers are responsible for paying shipping costs for returning
              items. Shipping fees are non-refundable. If you receive a refund,
              the cost of return shipping will be deducted from your refund.
              <br />
              গ্রাহকরা রিটার্ন করার জন্য শিপিং খরচ দেওয়ার জন্য দায়ী। শিপিং ফি
              ফেরতযোগ্য নয়। আপনি যদি রিফান্ড পান, তবে রিটার্ন শিপিং খরচ আপনার
              রিফান্ড থেকে কেটে নেওয়া হবে।
            </p>
          </div>

          {/* Non-returnable Items Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Non-returnable Items / অযোগ্য রিটার্ন পণ্য
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Certain items are non-returnable, including but not limited to:
              <br />
              কিছু পণ্য রিটার্নযোগ্য নয়, যার মধ্যে রয়েছে কিন্তু এর মধ্যে
              সীমাবদ্ধ নয়:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-600">
              <li>
                Perishable goods (e.g., food, flowers, newspapers) / ক্ষয়শীল
                পণ্য (যেমন, খাবার, ফুল, সংবাদপত্র)
              </li>
              <li>Intimate or sanitary goods / অন্তরঙ্গ বা স্যানিটারি পণ্য</li>
              <li>Hazardous materials / বিপজ্জনক উপাদান</li>
              <li>
                Downloadable software products / ডাউনলোডযোগ্য সফটওয়্যার পণ্য
              </li>
              <li>Gift cards / গিফট কার্ড</li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Contact Us / আমাদের সাথে যোগাযোগ করুন
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about returns and refunds, feel free to
              contact us:
              <br />
              যদি রিটার্ন এবং রিফান্ড সম্পর্কিত কোনও প্রশ্ন থাকে, আমাদের সাথে
              যোগাযোগ করতে দ্বিধা করবেন না:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-600">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@MirexaStore.com"
                  className="text-blue-600 hover:underline"
                >
                  support@MirexaStore.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+8801405671742"
                  className="text-blue-600 hover:underline"
                >
                  +880-1405671742
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReturnRefundPolicy;
