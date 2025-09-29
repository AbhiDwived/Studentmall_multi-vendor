"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "@/app/lib/redux/store";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  requiredRoles: string[]; // Multiple roles support
}

const WithAuth = ({ children, requiredRoles }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Give some time for the auth state to hydrate
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!user || !token) {
        router.push("/login");
        return;
      }
      
      if (!requiredRoles.includes(user.role)) {
        router.push("/unauthorized");
        return;
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [user, token, requiredRoles, router]);

  // Show loading while checking authentication
  if (isChecking || !user || !token || !requiredRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#F6550C]" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WithAuth;