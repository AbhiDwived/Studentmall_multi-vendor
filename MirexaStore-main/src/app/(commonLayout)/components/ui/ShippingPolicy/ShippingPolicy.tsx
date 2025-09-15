"use client";

const ShippingPolicy = () => {
  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Shipping Policy / শিপিং পলিসি
        </h1>

        <div className="space-y-12 bg-white shadow-lg rounded-2xl p-8 md:p-12">
          <p className="text-gray-600 leading-relaxed text-lg">
            Thank you for shopping at{" "}
            <span className="font-semibold text-gray-800">MirexaStore</span>. We
            want you to receive your order as quickly as possible. Please read
            our Shipping Policy carefully for more information.
            <br />
            <br />
            <span className="font-semibold text-gray-800">MirexaStore</span>
            -এ কেনাকাটা করার জন্য আপনাকে ধন্যবাদ। আমরা চাই আপনি দ্রুত আপনার
            অর্ডারটি পেয়ে যান। আরও তথ্যের জন্য আমাদের শিপিং পলিসি внимিতভাবে
            পড়ুন।
          </p>

          {/* Shipping Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Shipping Time / শিপিং সময়
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All orders are processed and shipped within{" "}
              <span className="font-semibold">2-3 business days</span>. Once
              your order is shipped, you will receive a tracking number.
              Delivery times vary depending on your location but typically range
              from 5-7 business days within Bangladesh. For international
              orders, shipping may take 10-15 business days.
              <br />
              <br />
              সমস্ত অর্ডার প্রক্রিয়া ও শিপিং হবে{" "}
              <span className="font-semibold">2-3 ব্যবসায়িক দিনের</span> মধ্যে।
              একবার আপনার অর্ডার শিপিং হলে, আপনি একটি ট্র্যাকিং নম্বর পাবেন।
              ডেলিভারি সময় স্থান অনুযায়ী পরিবর্তিত হতে পারে, তবে সাধারণত
              বাংলাদেশে ৫-৭ ব্যবসায়িক দিনের মধ্যে পৌঁছে যাবে। আন্তর্জাতিক
              অর্ডারগুলি ১০-১৫ ব্যবসায়িক দিন সময় নিতে পারে।
            </p>
          </div>

          {/* Shipping Costs */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Shipping Costs / শিপিং খরচ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Shipping costs are calculated based on the weight of your order
              and the delivery location. You can see the exact shipping cost
              before completing your purchase at checkout. We offer free
              shipping on orders over
              <span className="font-semibold">৳5000</span>.
              <br />
              <br />
              শিপিং খরচ আপনার অর্ডারের ওজন এবং ডেলিভারি অবস্থান অনুযায়ী হিসাব
              করা হয়। চেকআউটের আগে আপনি সঠিক শিপিং খরচ দেখতে পারবেন। আমরা{" "}
              <span className="font-semibold">৳5000</span> এর উপরে অর্ডার করার
              জন্য ফ্রি শিপিং প্রদান করি।
            </p>
          </div>

          {/* Order Processing */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Order Processing / অর্ডার প্রক্রিয়াকরণ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Orders are processed and shipped from Monday to Friday. Orders
              placed on weekends or public holidays will be processed the
              following business day. During peak seasons, processing times may
              be slightly longer.
              <br />
              <br />
              অর্ডারগুলি সোমবার থেকে শুক্রবার পর্যন্ত প্রক্রিয়া ও শিপিং হয়।
              সপ্তাহান্তে বা পাবলিক হলিডেতে অর্ডার করা হলে, পরবর্তী ব্যবসায়িক
              দিনে সেগুলি প্রক্রিয়া করা হবে। শীর্ষ মৌসুমে প্রক্রিয়াকরণ সময়
              একটু বেশি হতে পারে।
            </p>
          </div>

          {/* Shipping Restrictions */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Shipping Restrictions / শিপিং সীমাবদ্ধতা
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We currently only ship to locations within Bangladesh and select
              international countries. If we are unable to ship to your
              location, we will notify you at the earliest opportunity.
              <br />
              <br />
              বর্তমানে আমরা শুধুমাত্র বাংলাদেশ এবং কিছু আন্তর্জাতিক দেশে শিপিং
              করি। যদি আমরা আপনার অবস্থানে শিপিং করতে না পারি, তাহলে আমরা আপনাকে
              দ্রুত জানিয়ে দেব।
            </p>
          </div>

          {/* Damaged or Lost Items */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Damaged or Lost Items / ক্ষতিগ্রস্ত বা হারানো আইটেম
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If your item arrives damaged or is lost during shipping, please
              contact us within
              <span className="font-semibold">7 days</span> of receiving your
              package. We will either send a replacement or issue a full refund
              for the affected item.
              <br />
              <br />
              যদি আপনার আইটেমটি শিপিংয়ের সময় ক্ষতিগ্রস্ত হয় বা হারিয়ে যায়,
              তবে আপনার প্যাকেজ পাওয়ার{" "}
              <span className="font-semibold">৭ দিনের</span> মধ্যে আমাদের সাথে
              যোগাযোগ করুন। আমরা হয় একটি রিপ্লেসমেন্ট পাঠাবো বা ক্ষতিগ্রস্ত
              আইটেমের জন্য পূর্ণ অর্থ ফেরত দেব।
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Contact Us / আমাদের সাথে যোগাযোগ করুন
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about shipping or your order, please
              feel free to reach out to our customer support team:
              <br />
              <br />
              যদি আপনি শিপিং বা আপনার অর্ডার সম্পর্কে কোন প্রশ্ন থাকে, তবে
              আমাদের কাস্টমার সাপোর্ট টিমের সাথে যোগাযোগ করুন:
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

export default ShippingPolicy;
