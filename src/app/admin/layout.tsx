import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getCurrentUserWithProfile } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userWithProfile = await getCurrentUserWithProfile();

  // 1. If no user, redirect to login
  if (!userWithProfile?.user) {
    redirect("/login");
  }

  // 2. If no profile or user is not an admin, redirect to the home page
  if (!userWithProfile.profile || userWithProfile.profile.role !== "admin") {
    redirect("/");
  }

  // 3. If all checks pass, render the children
  return <>{children}</>;
}
