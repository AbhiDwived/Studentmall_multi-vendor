"use client";

const ShippingPolicy = () => {
  return (
    <section className="bg-white min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-[#0A3D62] mb-10">
          Shipping Policy
        </h1>

        <div className="space-y-12 bg-white shadow-lg rounded-2xl p-8 md:p-12 border border-gray-100">
          <p className="text-[#4B4B4B] leading-relaxed text-lg">
            Thank you for shopping at{" "}
            <span className="font-semibold text-[#0A3D62]">Studentmall</span>. We
            want you to receive your order as quickly as possible. Please read
            our Shipping Policy carefully for more information.
          </p>

          {/* Shipping Information */}
          <div>
            <h2 className="text-2xl font-semibold text-[#0A3D62] mb-4">
              1. Shipping Time
            </h2>
            <p className="text-[#4B4B4B] leading-relaxed">
              All orders are processed and shipped within{" "}
              <span className="font-semibold">2-3 business days</span>. Once
              your order is shipped, you will receive a tracking number.
              Delivery times vary depending on your location but typically range
              from 5-7 business days within India. For international
              orders, shipping may take 10-15 business days.
            </p>
          </div>

          {/* Shipping Costs */}
          <div>
            <h2 className="text-2xl font-semibold text-[#0A3D62] mb-4">
              2. Shipping Costs
            </h2>
            <p className="text-[#4B4B4B] leading-relaxed">
              Shipping costs are calculated based on the weight of your order
              and the delivery location. You can see the exact shipping cost
              before completing your purchase at checkout. We offer free
              shipping on orders over
              <span className="font-semibold">₹5000</span>.
            </p>
          </div>

          {/* Order Processing */}
          <div>
            <h2 className="text-2xl font-semibold text-[#0A3D62] mb-4">
              3. Order Processing
            </h2>
            <p className="text-[#4B4B4B] leading-relaxed">
              Orders are processed and shipped from Monday to Friday. Orders
              placed on weekends or public holidays will be processed the
              following business day. During peak seasons, processing times may
              be slightly longer.
            </p>
          </div>

          {/* Shipping Restrictions */}
          <div>
            <h2 className="text-2xl font-semibold text-[#0A3D62] mb-4">
              4. Shipping Restrictions
            </h2>
            <p className="text-[#4B4B4B] leading-relaxed">
              We currently only ship to locations within India and select
              international countries. If we are unable to ship to your
              location, we will notify you at the earliest opportunity.
            </p>
          </div>

          {/* Damaged or Lost Items */}
          <div>
            <h2 className="text-2xl font-semibold text-[#0A3D62] mb-4">
              5. Damaged or Lost Items
            </h2>
            <p className="text-[#4B4B4B] leading-relaxed">
              If your item arrives damaged or is lost during shipping, please
              contact us within
              <span className="font-semibold">7 days</span> of receiving your
              package. We will either send a replacement or issue a full refund
              for the affected item.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-2xl font-semibold text-[#0A3D62] mb-4">
              6. Contact Us
            </h2>
            <p className="text-[#4B4B4B] leading-relaxed mb-4">
              If you have any questions about shipping or your order, please
              feel free to reach out to our customer support team:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#4B4B4B]">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@studentmall.com"
                  className="text-[#F39C12] hover:underline"
                >
                  support@studentmall.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+91 8433208146"
                  className="text-[#F39C12] hover:underline"
                >
                  +91 8433208146
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