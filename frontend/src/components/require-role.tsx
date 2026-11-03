"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

interface RequireRoleProps {
  role: "ROLE_TEACHER" | "ROLE_STUDENT" | "ANY";
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
      try {
        const user = await getCurrentUser();

        if (!active) return;

        if (!user) {
          router.replace("/login");
          return;
        }

        const isTeacher = user.authorities.includes("ROLE_TEACHER");
        const isStudent = user.authorities.includes("ROLE_STUDENT");

        const hasAccess =
          role === "ANY"
            ? isTeacher || isStudent
            : user.authorities.includes(role);

        if (hasAccess) {
          setAllowed(true);
          return;
        }

        if (isTeacher) {
          router.replace("/");
        } else if (isStudent) {
          router.replace("/student");
        } else {
          setError("Δεν έχεις δικαίωμα πρόσβασης σε αυτή τη σελίδα.");
        }
      } catch (error) {
        if (active) {
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

  if (error) {
    return (
      <p role="alert" className="p-4 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!allowed) {
    return (
      <p role="status" className="p-4 text-sm text-slate-500">
        Έλεγχος σύνδεσης…
      </p>
    );
  }

  return <>{children}</>;
}