"use client";

import { useState } from "react";

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
  const [listVersion, setListVersion] = useState(0);

  return (
    <div className="space-y-6">
      {canUpload && (
        <UploadMaterialForm
          courseId={courseId}
          onUploaded={() => setListVersion((version) => version + 1)}
        />
      )}

      <MaterialList key={listVersion} courseId={courseId} />
    </div>
  );
}