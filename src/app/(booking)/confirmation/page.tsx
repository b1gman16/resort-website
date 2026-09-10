import Link from "next/link";

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>

      <h1 className="text-2xl font-semibold text-slate-900 mt-4">Booking Requested</h1>
      <p className="text-slate-600 mt-2">
        We've received your request. Our staff will review and confirm it shortly — you'll
        pay at the resort, no payment needed now.
      </p>

      {ref && (
        <div className="mt-6 bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Your Booking Reference
          </p>
          <p className="text-2xl font-mono font-semibold text-slate-900 mt-1">{ref}</p>
          <p className="text-xs text-slate-500 mt-2">
            Save this — you'll need it along with your email to manage your booking later.
          </p>
        </div>
      )}

      <div className="mt-8 flex gap-3 justify-center">
        <Link
          href="/"
          className="text-sm px-4 py-2 rounded border border-slate-300 hover:bg-slate-50"
        >
          Back to Home
        </Link>
        <Link
          href="/manage"
          className="text-sm px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Manage Booking
        </Link>
      </div>
    </div>
  );
}