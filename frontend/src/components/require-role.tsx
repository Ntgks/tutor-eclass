"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

interface RequireRoleProps {
  role: "ROLE_TEACHER" | "ROLE_STUDENT";
  children: ReactNode;
}

export default function RequireRole({
  role,
  children,
}: RequireRoleProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
        try{
            const user = await getCurrentUser();

            if(!active) return;

            if(!user){
                router.replace("/login");
                return;
            }

            if(user.authorities.includes(role)){
                setAllowed(true);
                return;
            }

            if(user.authorities.includes("ROLE_TEACHER")){
                router.replace("/");
            } else if(user.authorities.includes("ROLE_STUDENT")){
                router.replace("/student");
            } else{
                setError("Δεν έχεις δικαίωμα πρόσβασης σε αυτή τη σελίδα.");
            }
        } catch (error){
            if(active){
                setError(
                    error instanceof Error
                        ? error.message
                        : "Δεν ήταν δυνατός ο έλεγχος πρόσβασης."
                );
            }
        }
    }

    checkAccess();

    return () => {
        active = false;
    };
  }, [role, router]);

  if (error){
    return <p role="alert">{error}</p>;
  }

  if(!allowed){
    return <p role="status">Έλεγχος σύνδεσης…</p>;
  }

  return<>{children}</>;
}