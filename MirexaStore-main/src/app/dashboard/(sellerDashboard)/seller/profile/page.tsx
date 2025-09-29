"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WithAuth from "@/lib/utils/withAuth";

const SellerProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    userEmail: user?.email || "",
    brand: {
      name: "",
      slug: "",
      logo: "",
      banner: "",
      tagline: "",
      description: "",
      location: "",
      phone: "",
      whatsapp: "",
      bkash: "",
      socialLinks: {
        facebook: "",
        instagram: "",
      },
    },
  });

  useEffect(() => {
    checkExistingProfile();
  }, [user?.email]);

  const checkExistingProfile = async () => {
    if (!user?.email) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${user.email}`,
        { validateStatus: (status) => status < 500 }
      );

      if (response.status === 200 && response.data?.success) {
        setHasProfile(true);
        setProfileData(response.data.data);
      }
    } catch (error) {
      setHasProfile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('brand.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        brand: { ...prev.brand, [field]: value }
      }));
    } else if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        brand: { 
          ...prev.brand, 
          socialLinks: { ...prev.brand.socialLinks, [field]: value }
        }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
  };

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProfileData(prev => ({
      ...prev,
      brand: {
        ...prev.brand,
        name,
        slug: generateSlug(name)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/create-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        toast.success("✅ Seller profile created successfully!");
        setHasProfile(true);
        // Refresh the page to update sidebar
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.response?.data?.message || "❌ Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  if (hasProfile) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Seller Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Name</label>
            <p className="mt-1 text-lg text-gray-900">{profileData.brand.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Slug</label>
            <p className="mt-1 text-lg text-blue-600">{profileData.brand.slug}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store URL</label>
            <p className="mt-1 text-lg text-green-600">
              {window.location.origin}/store/{profileData.brand.slug}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Seller Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Brand Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              name="brand.name"
              value={profileData.brand.name}
              onChange={handleBrandNameChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your brand name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Slug (Auto-generated)
            </label>
            <input
              type="text"
              name="brand.slug"
              value={profileData.brand.slug}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="brand-slug"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your store will be available at: /store/{profileData.brand.slug}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Description *
            </label>
            <textarea
              name="brand.description"
              value={profileData.brand.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your brand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Tagline
            </label>
            <input
              type="text"
              name="brand.tagline"
              value={profileData.brand.tagline}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="A catchy tagline for your brand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="brand.location"
              value={profileData.brand.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your business location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL *
            </label>
            <input
              type="url"
              name="brand.logo"
              value={profileData.brand.logo}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner URL *
            </label>
            <input
              type="url"
              name="brand.banner"
              value={profileData.brand.banner}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/banner.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="brand.phone"
                value={profileData.brand.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number *
              </label>
              <input
                type="tel"
                name="brand.whatsapp"
                value={profileData.brand.whatsapp}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="WhatsApp number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              bKash Number *
            </label>
            <input
              type="tel"
              name="brand.bkash"
              value={profileData.brand.bkash}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="bKash number for payments"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Social Media Links</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Page *
            </label>
            <input
              type="url"
              name="socialLinks.facebook"
              value={profileData.brand.socialLinks.facebook}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Profile *
            </label>
            <input
              type="url"
              name="socialLinks.instagram"
              value={profileData.brand.socialLinks.instagram}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://instagram.com/yourprofile"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {loading ? 'Creating Profile...' : 'Create Seller Profile'}
        </button>
      </form>
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <SellerProfile />
    </WithAuth>
  );
}
