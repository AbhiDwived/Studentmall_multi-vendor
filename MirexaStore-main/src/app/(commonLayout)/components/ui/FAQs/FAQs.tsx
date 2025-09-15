"use client";

import { useState } from "react";

const FAQs = () => {
  const [open, setOpen] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const faqs = [
    {
      question: "What is MirexaStore? / MirexaStore কি?",
      answer:
        "MirexaStore is an online e-commerce platform where you can shop for a variety of products, including electronics, clothing, accessories, and more. We aim to provide the best shopping experience with fast delivery and secure payment methods. / MirexaStore একটি অনলাইন ই-কমার্স প্ল্যাটফর্ম, যেখানে আপনি বিভিন্ন ধরনের পণ্য কিনতে পারবেন, যেমন ইলেকট্রনিক্স, পোশাক, অ্যাকসেসরিজ, এবং আরও অনেক কিছু। আমরা দ্রুত ডেলিভারি এবং নিরাপদ পেমেন্ট পদ্ধতির মাধ্যমে সেরা শপিং অভিজ্ঞতা প্রদান করার লক্ষ্য রাখি।",
    },
    {
      question: "How do I place an order? / আমি কীভাবে অর্ডার দেব?",
      answer:
        "To place an order, simply browse our product categories, select the items you want, and add them to your cart. When you're ready, proceed to checkout, enter your shipping details, and choose your preferred payment method to complete the order. / অর্ডার দিতে, আমাদের পণ্য ক্যাটাগরি গুলি ব্রাউজ করুন, আপনার পছন্দের পণ্যগুলি নির্বাচন করুন এবং সেগুলি আপনার কার্টে যোগ করুন। যখন আপনি প্রস্তুত, চেকআউট পেজে যান, আপনার শিপিং বিবরণ দিন এবং পছন্দসই পেমেন্ট পদ্ধতি নির্বাচন করে অর্ডার সম্পূর্ণ করুন।",
    },
    {
      question:
        "What payment methods do you accept? / আপনি কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?",
      answer:
        "We accept a variety of payment methods, including credit/debit cards, mobile payments, and cash on delivery (COD) in certain locations. For online payments, we support secure gateways like PayPal and Stripe. / আমরা বিভিন্ন পেমেন্ট পদ্ধতি গ্রহণ করি, যার মধ্যে ক্রেডিট/ডেবিট কার্ড, মোবাইল পেমেন্ট এবং কিছু স্থানে ক্যাশ অন ডেলিভারি (COD) অন্তর্ভুক্ত। অনলাইন পেমেন্টের জন্য, আমরা নিরাপদ পেমেন্ট গেটওয়ে যেমন PayPal এবং Stripe সমর্থন করি।",
    },
    {
      question:
        "How can I track my order? / আমি কীভাবে আমার অর্ডার ট্র্যাক করব?",
      answer:
        "Once your order is shipped, you'll receive an email with the tracking information. You can use this tracking number on the courier's website to monitor the status of your shipment. / একবার আপনার অর্ডার শিপিং হলে, আপনি ট্র্যাকিং তথ্য সহ একটি ইমেল পাবেন। আপনি এই ট্র্যাকিং নম্বরটি কুরিয়ারের ওয়েবসাইটে ব্যবহার করে আপনার শিপমেন্টের অবস্থান পর্যবেক্ষণ করতে পারবেন।",
    },
    {
      question:
        "What is your return and refund policy? / আপনার রিটার্ন এবং রিফান্ড পলিসি কী?",
      answer:
        "You can return most items within 7 calendar days from the date of receipt. Please refer to our Return & Refund Policy page for detailed information on eligible returns, refund processing, and non-returnable items. / আপনি প্রাপ্তির তারিখ থেকে 7 ক্যালেন্ডার দিনের মধ্যে বেশিরভাগ পণ্য রিটার্ন করতে পারবেন। বিস্তারিত রিটার্ন এবং রিফান্ড পলিসি সম্পর্কিত তথ্যের জন্য আমাদের Return & Refund Policy পেজ দেখুন।",
    },
    {
      question:
        "How can I contact customer support? / আমি কীভাবে গ্রাহক সাপোর্টের সাথে যোগাযোগ করতে পারি?",
      answer:
        "You can reach out to our customer support team via email at support@MirexaStore.com or by calling +880-1405671742. We are available to assist you with any questions or issues you may have. / আপনি আমাদের গ্রাহক সাপোর্ট টিমের সাথে ইমেইল বা ফোনের মাধ্যমে যোগাযোগ করতে পারেন। ইমেইল: support@MirexaStore.com এবং ফোন: +880-1405671742। আমাদের টিম আপনার যেকোনো প্রশ্ন বা সমস্যা সমাধানে সহায়ক হতে প্রস্তুত।",
    },
  ];

  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Frequently Asked Questions / সাধারণ জিজ্ঞাস্য
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white shadow-lg rounded-2xl p-6">
              <button
                onClick={() => toggleOpen(index)}
                className="w-full text-left text-2xl font-semibold text-gray-800 flex justify-between items-center"
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
                <p className="text-gray-600 leading-relaxed mt-4">
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
