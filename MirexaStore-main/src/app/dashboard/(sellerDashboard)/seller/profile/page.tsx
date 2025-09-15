"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Axios from "axios";
import Image from "next/image";
import { RootState } from "@/app/lib/redux/store";
import Loading from "@/app/loading";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";

const ProfilePage = () => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [brandProfile, setBrandProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userResponse = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = userResponse.data.data;
        setUserProfile(user);

        if (user?.email) {
          try {
            const sellerResponse = await Axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${user.email}`
            );

            if (sellerResponse?.data?.data?.brand) {
              setBrandProfile(sellerResponse?.data?.data);
            }
          } catch {
            console.warn("No seller brand data found.");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, router]);

  if (loading) return <ProfileSkeleton></ProfileSkeleton>;

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        My Profile
      </h1>

      {brandProfile?.brand ? (
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 hover:shadow-2xl transition duration-300">
          <div className="w-full rounded-xl overflow-hidden shadow">
            <Image
              src={brandProfile.brand.banner}
              alt="Brand Banner"
              width={1200}
              height={300}
              className="w-full h-60 object-cover"
            />
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <Image
              src={brandProfile.brand.logo}
              alt="Brand Logo"
              width={112}
              height={112}
              className="rounded-full object-contain border p-1 shadow"
            />
            <div>
              <h2 className="text-2xl font-semibold">
                {brandProfile.brand.name}
              </h2>
              <p className="text-sm text-gray-500">
                {brandProfile.brand.tagline}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {brandProfile.brand.location}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProfileItem label="Email" value={brandProfile.userEmail} />
            <ProfileItem label="Phone" value={brandProfile.brand.phone} />
            <ProfileItem label="WhatsApp" value={brandProfile.brand.whatsapp} />

            <ProfileItem
              label="Verified"
              value={
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                    brandProfile.brand.verified
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {brandProfile.brand.verified ? "Verified" : "Not Verified"}
                </span>
              }
            />
            <ProfileItem
              label="Joined"
              value={new Date(brandProfile.brand.joinedAt).toLocaleDateString()}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              About the Brand
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {brandProfile.brand.description}
            </p>

            <div className="flex gap-4 mt-4">
              {brandProfile.brand.socialLinks?.facebook && (
                <a
                  href={brandProfile.brand.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.05H8v-2.9h2.5V9.4c0-2.5 1.49-3.9 3.77-3.9 1.1 0 2.25.2 2.25.2v2.5h-1.27c-1.26 0-1.65.78-1.65 1.57v1.9h2.8l-.45 2.9h-2.35v7.05A10 10 0 0 0 22 12z" />
                  </svg>
                  Facebook
                </a>
              )}
              {brandProfile.brand.socialLinks?.instagram && (
                <a
                  href={brandProfile.brand.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-pink-500 hover:underline font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm4.75-3.75a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25Z" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>

          <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">
            Edit Profile
          </button>
        </div>
      ) : (
        userProfile && (
          <div className="bg-white shadow-xl rounded-2xl p-8 hover:shadow-2xl transition duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-3xl font-bold shadow">
                {userProfile.name?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileItem label="Full Name" value={userProfile.name} />
                <ProfileItem label="Email Address" value={userProfile.email} />
                <ProfileItem label="Phone Number" value={userProfile.phone} />
                <ProfileItem label="Address" value={userProfile.address} />
                <ProfileItem label="Account Role" value={userProfile.role} />
              </div>
            </div>

            <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">
              Edit Profile
            </button>
          </div>
        )
      )}
    </div>
  );
};

const ProfileItem = ({
  label,
  value,
}: {
  label: string;
  value: string | JSX.Element;
}) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500 font-medium">{label}</span>
    <span className="text-base font-semibold text-gray-800">
      {value || "N/A"}
    </span>
  </div>
);

export default ProfilePage;
