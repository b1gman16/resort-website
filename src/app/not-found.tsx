import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-semibold text-slate-900">404</h1>
      <p className="text-slate-600 mt-2">We couldn't find the page you're looking for.</p>
      <Link href="/" className="mt-6 text-sm text-slate-900 underline">
        Back to Home
      </Link>
    </div>
  );
}