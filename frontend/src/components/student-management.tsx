"use client";

import { useState } from "react";

import CreateStudentForm from "@/components/create-student-form";
import StudentList from "@/components/student-list";

export default function StudentManagement(){
    const [listVersion, setListVersion] = useState(0);

    return(
        <>
            <section
                className="mt-8 max-w-xl rounded-xl border border-slate-200 bg-white p-6"
                aria-labelledby="create-student-title"
            >
                <h2
                    id="create-student-title"
                    className="mb-4 text-xl font-semibold"
                >
                    Νέος μαθητής
                </h2>

                <CreateStudentForm
                    onCreated={() => setListVersion((version) => version + 1)}
                />
            </section>

            <section className="mt-8" aria-label="Λίστα μαθητών">
                <StudentList key={listVersion} />
            </section>
        </>
    );
}