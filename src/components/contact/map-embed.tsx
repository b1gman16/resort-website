export function MapEmbed({ address }: { address: string }) {
  // Google's keyless embed format — no API key, no billing account needed.
  // encodeURIComponent handles spaces/commas/special characters safely in
  // the URL query string.
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="rounded-lg overflow-hidden border border-slate-200">
      <iframe
        src={mapSrc}
        width="100%"
        height="320"
        style={{ border: 0 }}
        loading="lazy" // defers loading the map until it's near the viewport
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing the location of ${address}`}
      />
    </div>
  );
}