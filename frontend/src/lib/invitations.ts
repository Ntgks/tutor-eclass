import { getCsrfToken } from "@/lib/csrf";

interface InvitationResponse {
    activationUrl: string;
}

export async function createInvitation(
    studentId: string
): Promise<InvitationResponse> {

    const csrf = await getCsrfToken();

    const response = await fetch(
        `/api/students/${encodeURIComponent(studentId)}/invitation`,
        {
            method: "POST",
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
                [csrf.headerName]: csrf.token,  
            },
        }
    );

    if(response.status === 404){
        throw new Error("Ο μαθητής δεν βρέθηκε.");
    }

    if(response.status === 409){
        throw new Error("Ο μαθητής δεν βρίσκεται σε αναμονή ενεργοποίησης.");
    }

    if(response.status === 401 || response.status === 403){
        throw new Error("Χρειάζεται σύνδεση με λογαριασμό καθηγήτριας.");
    }

    if(!response.ok){
        throw new Error("Δεν ήταν δυνατή η δημιουργία πρόσκλησης.");
    }

    const contentType = response.headers.get("content-type");

    if(!contentType?.includes("application/json")){
        throw new Error("Χρειάζεται να συνδεθείς ξανά.");
    }

    return response.json();
}