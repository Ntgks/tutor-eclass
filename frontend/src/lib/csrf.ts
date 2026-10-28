interface CsrfResponse{
    token: string;
    headerName: string;
    parameterName: string;
}

export async function getCsrfToken(): Promise<CsrfResponse> {
    const response = await fetch("/api/auth/csrf", {
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            Accept: "application/json"
        },
    });

    if(!response.ok){
        throw new Error("Δεν ήταν δυνατή η λήψη του CSRF token.");
    }

    const contentType = response.headers.get("content-type");

    if(!contentType?.includes("application/json")){
        throw new Error("Χρειάζεται σύνδεση για αυτή την ενέργεια.");
    }

    return response.json();
}