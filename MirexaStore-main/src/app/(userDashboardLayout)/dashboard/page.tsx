"use client";

import React, { useState } from "react";
import {
  FaUser,
  FaBicycle,
  FaBook,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa"; // Placeholder component for Rental History
import UserProfile from "../component/userProfile";

const UserDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("userProfile");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "userProfile":
        return <UserProfile />;
      case "bikeBooking":
        return <h1>Bike Booking Page</h1>;
      case "bikeHistory":
        return <h1>Rental History Page</h1>;
      case "settings":
        return <div>User Settings Section</div>;
      default:
        return <div>User profile</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 w-64 bg-[#F85606] text-white p-4 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">User Dashboard</h2>
          <button
            className="text-gray-400 focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <FaTimes />
          </button>
        </div>
        <ul>
          <li>
            <button
              onClick={() => setSelectedSection("userProfile")}
              className={`flex items-center p-2 rounded-md ${
                selectedSection === "userProfile"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaUser className="mr-3" /> Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSection("bikeBooking")}
              className={`flex items-center p-2 rounded-md ${
                selectedSection === "bikeBooking"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaBicycle className="mr-3" /> Book Bike
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSection("bikeHistory")}
              className={`flex items-center p-2 rounded-md ${
                selectedSection === "bikeHistory"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaBook className="mr-3" /> Rental History
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSection("settings")}
              className={`flex items-center p-2 rounded-md ${
                selectedSection === "settings"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaCog className="mr-3" /> Settings
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 p-8 bg-gray-100 overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } transition-all duration-300`}
      >
        {/* Toggle Button for Mobile View */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 focus:outline-none"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="space-y-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;
