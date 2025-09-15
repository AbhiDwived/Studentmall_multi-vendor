"use client";

import { useState } from "react";
import { User, Mail, MessageCircle } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Contact Us / আমাদের সাথে যোগাযোগ করুন
        </h1>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-800 font-semibold mb-1"
                >
                  Name / নাম
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <div className="px-3 text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 focus:outline-none"
                    required
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-800 font-semibold mb-1"
                >
                  Email / ইমেইল
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <div className="px-3 text-gray-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 focus:outline-none"
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-800 font-semibold mb-1"
                >
                  Message / বার্তা
                </label>
                <div className="flex items-start border border-gray-300 rounded-md overflow-hidden">
                  <div className="px-3 pt-3 text-gray-500">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 focus:outline-none"
                    required
                    rows={5}
                    placeholder="Enter your message"
                  />
                </div>
              </div>

              {/* Status Message */}
              {formStatus && (
                <div className="text-green-600 font-medium">{formStatus}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Send Message / বার্তা পাঠান"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
