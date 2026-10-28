"use client";

import { useSearchParams } from "next/navigation";

import ActivationForm from "@/components/activation-form";

export default function ActivationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return (
      <p role="alert" className="text-red-700">
        Ο σύνδεσμος ενεργοποίησης δεν είναι έγκυρος.
      </p>
    );
  }

  return <ActivationForm key={token} token={token} />;
}