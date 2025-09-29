"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import Loading from "@/app/loading";
import { RootState } from "@/app/lib/redux/store";
import { useSelector } from "react-redux";
import WithAuth from "@/lib/utils/withAuth";

// User type definition
type UserType = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "seller";
  phone?: string;
  address?: string;
};

const UserViewPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const accessToken = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get<{ data: UserType[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter((user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleMakeseller = async (userId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No accessToken found");
      return;
    }

    toast
      .promise(
        axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role/seller`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        {
          pending: "Making user a seller...",
          success: "User role updated to seller",
          error: "Failed to update user role",
        }
      )
      .then(() => {
        setUsers((prevUsers: UserType[]) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: "seller" } : user
          )
        );
      });
  };

  const openDeleteModal = (userId: string) => {
    setDeleteUserId(userId);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId || !accessToken) return;

    const userToDelete = users.find(
      (user: { _id: any }) => user._id === deleteUserId
    );

    if (userToDelete?.role === "admin") {
      toast.error("Admins cannot delete other admins.");
      setIsModalOpen(false);
      return;
    }

    toast
      .promise(
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${deleteUserId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        {
          pending: "Deleting user...",
          success: "User deleted successfully",
          error: "Failed to delete user",
        }
      )
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== deleteUserId)
        );
        setIsModalOpen(false);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="pt-10">
      <div className="mb-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="px-4 py-2 border rounded-md w-60 sm:w-1/2"
            placeholder="Search by email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => setSearchQuery(searchQuery)}
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.role}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.phone || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.address || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.role !== "admin" && user.role !== "seller" && (
                      <button
                        className="px-3 py-1 bg-green-600 text-white mr-2 rounded hover:bg-green-700"
                        onClick={() => handleMakeseller(user._id)}
                      >
                        Make seller
                      </button>
                    )}
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => openDeleteModal(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this user?"
      />

      <ToastContainer />
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <UserViewPage />
    </WithAuth>
  );
}
