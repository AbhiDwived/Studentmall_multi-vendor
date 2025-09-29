"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";

export default function TestPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard Test Page</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Authentication Status</h2>
        <div className="space-y-2">
          <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</p>
          <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
          <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}</p>
        </div>
        
        <div className="mt-6">
          <a 
            href="/dashboard/seller/subscription" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Subscription Page
          </a>
        </div>
      </div>
    </div>
  );
}
