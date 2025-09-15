"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Bell, Search, LogOut, Home } from "lucide-react";
import Link from "next/link";

interface SellerNavbarProps {
  onMenuClick: () => void;
}

const SellerNavbar = ({ onMenuClick }: SellerNavbarProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const userImage = ""; // Use actual image URL if available
  const userName = "Seller"; // Fallback initials or username

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    if (isMobile) setShowDropdown((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-[#F6550C] p-2 rounded hover:bg-gray-100 transition"
          aria-label="Toggle sidebar"
        >
          <MoreVertical size={24} />
        </button>

        <h1 className="text-xl font-extrabold text-[#F6550C] select-none">
          Mirexa Seller
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-md">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm w-36 placeholder-gray-500"
          />
        </div>

        {/* Notification */}
        {/* Notification Button */}
        <div className="relative pt-2">
          <button
            onClick={() => setShowNotification((prev) => !prev)}
            className="relative text-gray-600 hover:text-[#F6550C] transition"
            aria-label="Notifications"
          >
            <Bell size={22} />

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
              2
            </span>
          </button>

          {/* Notification Dropdown */}
          {showNotification && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 px-4 py-3 text-sm text-gray-700 border border-gray-100">
              🔔 Coming Soon...
            </div>
          )}
        </div>

        {/* Avatar + Dropdown Wrapper */}
        <div
          className="relative"
          onMouseEnter={() => !isMobile && setShowDropdown(true)}
          onMouseLeave={() => !isMobile && setShowDropdown(false)}
        >
          {/* Combined Wrapper */}
          <div className="flex flex-col items-end">
            {/* Avatar */}
            <div
              onClick={toggleDropdown}
              className="w-9 h-9 rounded-full border-2 border-[#F6550C] cursor-pointer overflow-hidden flex items-center justify-center bg-gray-200 text-sm font-bold text-[#F6550C]"
              title="Profile"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                userName[0]
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div
                className="mt-9 w-44 z-40 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 absolute right-0"
                role="menu"
                aria-labelledby="dropdown-button"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link
                      href="/"
                      role="menuitem"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-[#F6550C]" />
                        <span>Go to Home</span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        console.log("Logout clicked");
                        // Insert logout logic here
                      }}
                      role="menuitem"
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerNavbar;
