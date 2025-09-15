// "use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Image from "next/image";
import { RootState } from "@/app/lib/redux/store";
import {
  Store,
  Tag,
  MapPin,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  FileText,
  Image as ImageIcon,
  Link2,
  FileImage,
  AlignLeft,
  Banknote,
  X,
  UploadCloud,
  Loader2,
} from "lucide-react";

import Loading from "@/app/loading";
import toast, { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const SellerProfileForm = () => {
  const userInfo = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [profileExists, setProfileExists] = useState(false);
  type Field = "logo" | "banner";
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = userInfo?.user?.email;
        if (!email) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${email}`
        );

        const brand = res.data?.data?.brand;
        if (brand) {
          setForm({
            ...brand,
            socialLinks: {
              facebook: brand?.socialLinks?.facebook || "",
              instagram: brand?.socialLinks?.instagram || "",
            },
            whatsapp: brand?.whatsapp || "",
            phone: brand?.phone || "",
            bkash: brand?.bkash || "",
          });
          setProfileExists(true);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileExists(false);
      }
    };

    fetchProfile();

    if (userInfo?.user?.phone) {
      setForm((prev) => ({ ...prev, phone: userInfo?.user?.phone }));
    }
  }, [userInfo]);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else if (["facebook", "instagram"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value,
        },
      }));
    } else if (name === "whatsapp") {
      const cleaned = value.trim();
      const formatted = cleaned.startsWith("+")
        ? cleaned
        : `+880${cleaned.replace(/^0+/, "")}`;
      setForm((prev) => ({
        ...prev,
        whatsapp: formatted,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [uploading, setUploading] = useState<{
    logo: boolean;
    banner: boolean;
  }>({
    logo: false,
    banner: false,
  });

  const [progress, setProgress] = useState<{ logo: number; banner: number }>({
    logo: 0,
    banner: 0,
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: Field
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // allow only one per field
    if (form[field]) {
      alert("Already uploaded. Remove first, then upload again.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      e.target.value = "";
      return;
    }

    try {
      setUploading((u) => ({ ...u, [field]: true }));
      setProgress((p) => ({ ...p, [field]: 0 }));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "campus-needs-upload");
      formData.append("folder", "seller-profile-images");
      formData.append("cloud_name", "dwg8d0bfp");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwg8d0bfp/image/upload",
        formData,
        {
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            const percent = Math.round((evt.loaded * 100) / evt.total);
            setProgress((p) => ({ ...p, [field]: percent }));
          },
        }
      );

      const originalUrl: string = res.data.secure_url;
      const optimizedUrl = originalUrl.replace(
        "/upload/",
        // quality + format auto; width tuned—logo ছোট হবে, banner বড়
        field === "logo"
          ? "/upload/q_auto:eco,f_auto,w_400/"
          : "/upload/q_auto:eco,f_auto,w_1600/"
      );

      setForm((prev) => ({ ...prev, [field]: optimizedUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading((u) => ({ ...u, [field]: false }));
      // progress reset করবেন না চাইলে রাখুন—আমি 100 এ রেখে দিচ্ছি UX-এর জন্য
      setTimeout(() => {
        setProgress((p) => ({ ...p, [field]: 0 }));
      }, 800);
    }
  };
  const removeImage = (field: Field) => {
    setForm((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    if (!form.logo || !form.banner) {
      setSuccessMsg(" Please upload both logo and banner.");
      setLoading(false);
      return;
    }
    // 🔐 Role check before submit
    if (userInfo?.user?.role !== "seller") {
      toast.error(
        "🔒 For security reasons, please log out and log in again to activate your seller access."
      );
      setLoading(false);
      return;
    }

    try {
      const payload = {
        userEmail: userInfo?.user?.email,
        brand: {
          name: form.name,
          slug: form.slug,
          logo: form.logo,
          banner: form.banner,
          tagline: form.tagline,
          description: form.description,
          location: form.location,
          phone: form.phone,
          whatsapp: form.whatsapp,
          bkash: form.bkash,
          socialLinks: {
            facebook: form.socialLinks.facebook,
            instagram: form.socialLinks.instagram,
          },
        },
      };

      // 🔍 Log the payload before submitting

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/create-profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      console.log("✅ Response:", response.data);

      setSuccessMsg("✅ Profile created successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setProfileExists(true);
    } catch (err: any) {
      console.error("❌ Submission Error:", err?.response?.data || err.message);

      if (err.response?.data?.message?.includes("slug")) {
        setSuccessMsg(
          "❌ Slug already exists. Please choose a different name."
        );
      } else if (err.response?.data?.message?.includes("You are not seller")) {
        setSuccessMsg(
          "❌ You are not a seller. Please contact support to upgrade."
        );
      } else {
        setSuccessMsg("❌ Failed to submit profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo?.user?.email) {
    return <Loading></Loading>;
  }

  if (profileExists) {
    return (
      <div className="mt-10 p-4 sm:p-6 border border-green-300 rounded-xl shadow bg-green-50 max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-green-700">
          🎉 Your Seller Profile is Already Submitted!
        </h2>

        <div className="mb-4">
          {form.banner ? (
            <div className="relative w-full h-40 sm:h-60 md:h-72 lg:h-80 rounded-xl overflow-hidden">
              <Image
                src={form.banner}
                alt="Banner"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-gray-200 w-full h-40 rounded-xl flex items-center justify-center text-gray-500">
              No Banner
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          {form.logo ? (
            <Image
              src={form.logo}
              alt="Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
          ) : (
            <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center text-gray-500">
              No Logo
            </div>
          )}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold">{form.name}</h3>
            <p className="text-sm text-gray-600">{form.tagline}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm sm:text-base text-gray-700">
          <p>
            <strong>Description:</strong> {form.description}
          </p>
          <p>
            <strong>Location:</strong> {form.location}
          </p>
          <p>
            <strong>Phone:</strong> {form.phone}
          </p>
          <p>
            <strong>Bkash:</strong>{" "}
            {form?.bkash ? (
              form.bkash
            ) : (
              <span className="text-red-500 italic">N/A</span>
            )}
          </p>

          <p>
            <strong>WhatsApp:</strong> {form.whatsapp}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {form.socialLinks.facebook && (
            <a
              href={form.socialLinks.facebook}
              target="_blank"
              className="text-blue-600 font-medium hover:underline"
            >
              Facebook
            </a>
          )}
          {form.socialLinks.instagram && (
            <a
              href={form.socialLinks.instagram}
              target="_blank"
              className="text-pink-600 font-medium hover:underline"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 p-4 sm:pt-6  mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange-600">
        🛍️ Complete Your Seller Profile
      </h2>
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{
          top: "75px",
          zIndex: 9999,
        }}
        reverseOrder={false}
      />
      {successMsg && (
        <p className="text-green-600 font-medium mb-4">{successMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          {
            label: "Brand Name",
            name: "name",
            icon: <Store className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Brand Slug",
            name: "slug",
            icon: <Link2 className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Tagline",
            name: "tagline",
            icon: <Tag className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Location",
            name: "location",
            icon: <MapPin className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Phone Number",
            name: "phone",
            icon: <Phone className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "WhatsApp Number",
            name: "whatsapp",
            icon: <MessageCircle className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Bkash Number",
            name: "bkash",
            icon: <Banknote className="w-4 h-4 mr-1 text-pink-500" />, // pink for Bkash theme
          },
          {
            label: "Facebook",
            name: "facebook",
            icon: <Facebook className="w-4 h-4 mr-1 text-blue-600" />,
          },
          {
            label: "Instagram",
            name: "instagram",
            icon: <Instagram className="w-4 h-4 mr-1 text-pink-600" />,
          },
        ].map((field) => {
          const isRequired = [
            "name",
            "slug",
            "tagline",
            "location",
            "phone",
            "whatsapp",
          ].includes(field.name);

          return (
            <div key={field.name}>
              <label className="flex items-center text-sm font-medium mb-1">
                {field.icon}
                {field.label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name={field.name}
                value={
                  ["facebook", "instagram"].includes(field.name)
                    ? form.socialLinks[field.name as "facebook" | "instagram"]
                    : (form as any)[field.name]
                }
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
                required={isRequired}
              />
            </div>
          );
        })}

        <div>
          <label className="flex items-center text-sm font-medium mb-1 text-gray-700">
            <AlignLeft className="w-4 h-4 mr-1 text-orange-500" />
            Description<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="description"
            rows={3}
            required
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
          />
        </div>

        {/* Upload Logo */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Upload Logo */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <ImageIcon className="w-4 h-4 mr-1 text-orange-500" />
              Upload Logo.. <span className="text-red-500 ml-1">*</span>
            </label>

            {/* Dropzone-style uploader */}
            {!form.logo ? (
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition
              ${
                uploading.logo
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:border-orange-400 hover:bg-orange-50/40"
              } `}
              >
                <UploadCloud className="w-7 h-7 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Click to upload logo (PNG/SVG). Recommended height ~80–120px.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "logo")}
                  className="hidden"
                  disabled={uploading.logo}
                />
                {/* Progress */}
                {uploading.logo && (
                  <div className="w-full mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading… {progress.logo}%
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-orange-500 transition-all"
                        style={{ width: `${progress.logo}%` }}
                      />
                    </div>
                  </div>
                )}
              </label>
            ) : (
              <div className="relative inline-block">
                <Image
                  src={form.logo}
                  alt="Logo Preview"
                  width={120}
                  height={120}
                  className="rounded-xl border shadow-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeImage("logo")}
                  className="absolute -top-2 -right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white shadow ring-1 ring-gray-200 hover:bg-red-50"
                  aria-label="Remove logo"
                  title="Remove"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* Upload Banner */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileImage className="w-4 h-4 mr-1 text-orange-500" />
              Upload Banner.. <span className="text-red-500 ml-1">*</span>
            </label>

            {!form.banner ? (
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition
            ${
              uploading.banner
                ? "opacity-70 cursor-not-allowed"
                : "hover:border-orange-400 hover:bg-orange-50/40"
            } `}
              >
                <UploadCloud className="w-7 h-7 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Click to upload banner (recommended 1600×500+).
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "banner")}
                  className="hidden"
                  disabled={uploading.banner}
                />
                {/* Progress */}
                {uploading.banner && (
                  <div className="w-full mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading… {progress.banner}%
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-orange-500 transition-all"
                        style={{ width: `${progress.banner}%` }}
                      />
                    </div>
                  </div>
                )}
              </label>
            ) : (
              <div className="relative w-full h-40 sm:h-48 mt-1 rounded-2xl overflow-hidden border shadow-sm bg-white">
                <Image
                  src={form.banner}
                  alt="Banner Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage("banner")}
                  className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow ring-1 ring-gray-200 hover:bg-red-50"
                  aria-label="Remove banner"
                  title="Remove"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default SellerProfileForm;
