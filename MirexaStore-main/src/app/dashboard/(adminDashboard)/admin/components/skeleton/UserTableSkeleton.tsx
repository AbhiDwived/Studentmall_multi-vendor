import React from "react";

const UserTableSkeleton = () => {
  const rows = Array(5).fill(0); // 5 skeleton rows

  return (
    <div className="animate-pulse overflow-x-auto">
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
          {rows.map((_, index) => (
            <tr key={index} className="border-b">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <td key={i} className="py-3 px-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTableSkeleton;
