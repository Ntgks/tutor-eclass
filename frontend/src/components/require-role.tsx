"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

interface RequireRoleProps {
  role: "ROLE_TEACHER" | "ROLE_STUDENT" | "ANY";
  children: ReactNode;
}

interface AccessCheckProps extends RequireRoleProps {
  onRetry: () => void;
}

function AccessCheck({
  role,
  children,
  onRetry,
}: AccessCheckProps) {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [slow, setSlow] = useState(false);
  const [failed, setFailed] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let active = true;

    const slowTimer = window.setTimeout(() => {
      if (active) {
        setSlow(true);
      }
    }, 12000);

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
          setDenied(true);
        }
      } catch {
        if (active) {
          setFailed(true);
        }
      } finally {
        window.clearTimeout(slowTimer);
      }
    }

    void checkAccess();

    return () => {
      active = false;
      window.clearTimeout(slowTimer);
    };
  }, [role, router]);

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f9] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-900 text-sm font-bold text-white"
          >
            TE
          </span>

          <p className="text-lg font-bold tracking-tight text-brand-900">
            Tutor eClass
          </p>
        </div>

        {denied ? (
          <div role="alert">
            <h1 className="text-xl font-semibold text-brand-900">
              Δεν υπάρχει πρόσβαση
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Ο λογαριασμός σου δεν έχει δικαίωμα πρόσβασης σε αυτή
              τη σελίδα.
            </p>

            <a
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Επιστροφή στη σύνδεση
            </a>
          </div>
        ) : failed ? (
          <>
            <div role="alert">
              <h1 className="text-xl font-semibold text-brand-900">
                Δεν μπορέσαμε να ελέγξουμε τη σύνδεσή σου
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Η υπηρεσία μπορεί να ξεκινά ακόμη ή να υπάρχει
                προσωρινό πρόβλημα σύνδεσης. Περίμενε λίγο και
                δοκίμασε ξανά.
              </p>
            </div>

            <button
              type="button"
              onClick={onRetry}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Δοκίμασε ξανά
              <span aria-hidden="true">↻</span>
            </button>
          </>
        ) : (
          <div role="status" aria-live="polite">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-5 w-5 shrink-0 rounded-full border-2 border-brand-100 border-t-brand-600 motion-safe:animate-spin"
              />

              <h1 className="text-xl font-semibold text-brand-900">
                {slow ? "Χρειάζεται λίγο ακόμη…" : "Έλεγχος σύνδεσης"}
              </h1>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {slow
                ? "Η υπηρεσία ίσως ξεκινά μετά από αδράνεια. Περίμενε λίγο, ο έλεγχος συνεχίζεται."
                : "Περιμένουμε την επιβεβαίωση του λογαριασμού σου."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function RequireRole({
  role,
  children,
}: RequireRoleProps) {
  const [attempt, setAttempt] = useState(0);

  return (
    <AccessCheck
      key={`${role}-${attempt}`}
      role={role}
      onRetry={() => setAttempt((current) => current + 1)}
    >
      {children}
    </AccessCheck>
  );
}