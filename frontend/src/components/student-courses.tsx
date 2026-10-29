"use client";

import { useState } from "react";

import CourseList from "@/components/course-list";
import CreateCourseForm from "@/components/create-course-form";

interface StudentCoursesProps {
  studentId: string;
}

export default function StudentCourses({
  studentId,
}: StudentCoursesProps) {
  const [listVersion, setListVersion] = useState(0);

  return (
    <div className="space-y-6">
      <CreateCourseForm
        studentId={studentId}
        onCreated={() => setListVersion((version) => version + 1)}
      />

      <CourseList key={listVersion} studentId={studentId} />
    </div>
  );
}