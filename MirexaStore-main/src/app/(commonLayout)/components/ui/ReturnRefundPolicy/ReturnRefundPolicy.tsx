"use client";

const ReturnRefundPolicy = () => {
  return (
    <section className="bg-white min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-navy-blue mb-10">
          Return & Refund Policy
        </h1>

        <div className="space-y-12 bg-white shadow-lg rounded-2xl p-8 md:p-12 border border-gray-100">
          <p className="text-steel-gray leading-relaxed text-lg">
            Thank you for shopping at{" "}
            <span className="font-semibold text-navy-blue">Studentmall</span>. If
            you are not entirely satisfied with your purchase, we&apos;re here
            to help you. Please read our Return & Refund Policy carefully.
          </p>

          {/* Returns Section */}
          <div>
            <h2 className="text-2xl font-semibold text-navy-blue mb-4">
              1. Returns
            </h2>
            <p className="text-steel-gray leading-relaxed">
              You have <span className="font-semibold">7 calendar days</span> to
              return an item from the date you received it. To be eligible for a
              return, your item must be unused and in the same condition that
              you received it. The product must be in its original packaging,
              along with the receipt or proof of purchase.
            </p>
          </div>

          {/* Refunds Section */}
          <div>
            <h2 className="text-2xl font-semibold text-navy-blue mb-4">
              2. Refunds
            </h2>
            <p className="text-steel-gray leading-relaxed">
              Once we receive your returned item, we will inspect it and notify
              you regarding the status of your refund. If approved, your refund
              will be processed to your original method of payment. The time to
              receive credit may vary depending on your bank or card issuer's
              policies.
            </p>
          </div>

          {/* Shipping Costs Section */}
          <div>
            <h2 className="text-2xl font-semibold text-navy-blue mb-4">
              3. Shipping Costs
            </h2>
            <p className="text-steel-gray leading-relaxed">
              Customers are responsible for paying shipping costs for returning
              items. Shipping fees are non-refundable. If you receive a refund,
              the cost of return shipping will be deducted from your refund.
            </p>
          </div>

          {/* Non-returnable Items Section */}
          <div>
            <h2 className="text-2xl font-semibold text-navy-blue mb-4">
              4. Non-returnable Items
            </h2>
            <p className="text-steel-gray leading-relaxed mb-4">
              Certain items are non-returnable, including but not limited to:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-steel-gray">
              <li>
                Perishable goods (e.g., food, flowers, newspapers)
              </li>
              <li>Intimate or sanitary goods</li>
              <li>Hazardous materials</li>
              <li>
                Downloadable software products
              </li>
              <li>Gift cards</li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h2 className="text-2xl font-semibold text-navy-blue mb-4">
              5. Contact Us
            </h2>
            <p className="text-steel-gray leading-relaxed mb-4">
              If you have any questions about returns and refunds, feel free to
              contact us:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-steel-gray">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@studentmall.com"
                  className="text-accent-orange hover:underline"
                >
                  support@studentmall.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+91 8433208146"
                  className="text-accent-orange hover:underline"
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