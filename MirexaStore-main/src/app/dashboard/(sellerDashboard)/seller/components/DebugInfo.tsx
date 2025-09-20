"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";

const DebugInfo = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Debug Info:</h4>
      <div className="space-y-1">
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
        <p>User Role: {user?.role || 'Not logged in'}</p>
        <p>User Email: {user?.email || 'Not available'}</p>
        <p>Token: {token ? 'Present' : 'Missing'}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
};

export default DebugInfo;