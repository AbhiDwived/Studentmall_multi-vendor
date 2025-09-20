"use client";

import { useState } from "react";

const FAQs = () => {
  const [open, setOpen] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Studentmall?",
      answer:
        "Studentmall is an online e-commerce platform where you can shop for a variety of products, including electronics, clothing, accessories, and more. We aim to provide the best shopping experience with fast delivery and secure payment methods.",
    },
    {
      question: "How do I place an order?",
      answer:
        "To place an order, simply browse our product categories, select the items you want, and add them to your cart. When you're ready, proceed to checkout, enter your shipping details, and choose your preferred payment method to complete the order.",
    },
    {
      question:
        "What payment methods do you accept?",
      answer:
        "We accept a variety of payment methods, including credit/debit cards, mobile payments, and cash on delivery (COD) in certain locations. For online payments, we support secure gateways like PayPal and Stripe.",
    },
    {
      question:
        "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive an email with the tracking information. You can use this tracking number on the courier's website to monitor the status of your shipment.",
    },
    {
      question:
        "What is your return and refund policy?",
      answer:
        "You can return most items within 7 calendar days from the date of receipt. Please refer to our Return & Refund Policy page for detailed information on eligible returns, refund processing, and non-returnable items.",
    },
    {
      question:
        "How can I contact customer support?",
      answer:
        "You can reach out to our customer support team via email at support@studentmall.com or by calling +880-1405671742. We are available to assist you with any questions or issues you may have."
    },
  ];

  return (
    <section className="bg-white min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-[#0A3D62] mb-10">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white shadow-lg rounded-2xl p-6">
              <button
                onClick={() => toggleOpen(index)}
                className="w-full text-left text-2xl font-semibold text-[#0A3D62] flex justify-between items-center"
              >
                {faq.question}
                <span>
                  {open === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </span>
              </button>
              {open === index && (
                <p className="text-[#4B4B4B] leading-relaxed mt-4">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
