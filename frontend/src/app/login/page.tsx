import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-indigo-600">
          Tutor eClass
        </p>

        <h1 className="mt-2 text-2xl font-bold">
          Σύνδεση
        </h1>

        <p className="mt-3 text-slate-600">
          Συνδέσου με το email και τον κωδικό σου.
        </p>

        <LoginForm />
        
      </div>
    </main>
  );
}