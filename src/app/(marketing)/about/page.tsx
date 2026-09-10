import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900 mb-6">About {siteConfig.name}</h1>

      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p>
          {/* Replace with the resort's real story. */}
          Tucked along a quiet stretch of coastline, {siteConfig.name} was built around a
          simple idea: a resort should feel like an extension of the beach it sits on, not a
          building dropped onto it.
        </p>
        <p>
          Every room opens toward the water. Every meal uses what's in season locally. We keep
          the property small enough that our staff know most guests by name within a day.
        </p>
        <p>
          Whether you're here for a weekend or a longer stay, our goal is the same: give you
          fewer reasons to check your phone and more reasons to stay a little longer.
        </p>
      </div>
    </div>
  );
}