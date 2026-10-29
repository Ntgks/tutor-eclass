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
    return <p role="status">Φόρτωση υλικού…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (materials.length === 0) {
    return <p>Δεν έχει προστεθεί ακόμη υλικό.</p>;
  }

  return (
    <ul className="space-y-3">
      {materials.map((material) => (
        <li
          key={material.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h3 className="font-semibold">{material.title}</h3>

          <p className="mt-1 break-all text-sm text-slate-600">
            {material.originalFilename}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {Math.ceil(material.sizeBytes / 1024)} KB
          </p>

          <a
            href={`/api/courses/${encodeURIComponent(courseId)}/materials/${encodeURIComponent(material.id)}/download`}
            className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:underline"
          >
            Λήψη αρχείου
          </a>
        </li>
      ))}
    </ul>
  );
}