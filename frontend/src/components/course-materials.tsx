"use client";

import { useId, useRef, useState } from "react";

import MaterialList from "@/components/material-list";
import UploadMaterialForm from "@/components/upload-material-form";

interface CourseMaterialsProps {
  courseId: string;
  canUpload: boolean;
}

export default function CourseMaterials({
  courseId,
  canUpload,
}: CourseMaterialsProps) {
  const formId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [listVersion, setListVersion] = useState(0);
  const [showForm, setShowForm] = useState(false);

  function handleUploaded() {
    setListVersion((version) => version + 1);
    setShowForm(false);
    buttonRef.current?.focus();
  }

  return (
    <div className="space-y-4">
      {canUpload && (
        <>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setShowForm((current) => !current)}
            aria-expanded={showForm}
            aria-controls={formId}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <span aria-hidden="true">
              {showForm ? "−" : "+"}
            </span>

            {showForm ? "Κλείσιμο φόρμας" : "Προσθήκη υλικού"}
          </button>

          <div id={formId} hidden={!showForm}>
            {showForm && (
              <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
                <UploadMaterialForm
                  courseId={courseId}
                  onUploaded={handleUploaded}
                />
              </div>
            )}
          </div>
        </>
      )}

      <MaterialList key={listVersion} courseId={courseId} />
    </div>
  );
}