"use client";

import { useEffect, useState } from "react";

import { getMaterials } from "@/lib/materials";
import type { Material } from "@/types/material";

interface MaterialListProps {
  courseId: string;
}

export default function MaterialList({
  courseId,
}: MaterialListProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMaterials() {
      try {
        const data = await getMaterials(courseId);

        if (active) {
          setMaterials(data);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Παρουσιάστηκε σφάλμα."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMaterials();

    return () => {
      active = false;
    };
  }, [courseId]);

  if (loading) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Φόρτωση υλικού…
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (materials.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4 text-sm leading-6 text-slate-500">
        Δεν έχει προστεθεί ακόμη υλικό.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {materials.map((material) => (
        <li
          key={material.id}
          className="rounded-xl border border-brand-900/10 bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6M8 13h8M8 17h5" />
              </svg>
            </div>

            <div className="min-w-0">
              <h3 className="break-words text-sm font-semibold text-brand-900">
                {material.title}
              </h3>

              <p className="mt-1 break-all text-xs leading-5 text-slate-500">
                {material.originalFilename}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {Math.ceil(material.sizeBytes / 1024)} KB
              </p>
            </div>
          </div>

          <a
            href={`/api/courses/${encodeURIComponent(courseId)}/materials/${encodeURIComponent(material.id)}/download`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <span aria-hidden="true">↓</span>
            Λήψη αρχείου
          </a>
        </li>
      ))}
    </ul>
  );
}