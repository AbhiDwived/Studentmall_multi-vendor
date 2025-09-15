"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RootState } from "@/app/lib/redux/store";

interface Props {
  children: React.ReactNode;
  requiredRoles: string[]; // Multiple roles support
}

const WithAuth = ({ children, requiredRoles }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!requiredRoles.includes(user.role)) {
      router.push("/unauthorized");
    }
  }, [user, requiredRoles, router]);

  if (!user || !requiredRoles.includes(user.role)) {
    return null; // Loading or blank while redirecting
  }

  return <>{children}</>;
};

export default WithAuth;
