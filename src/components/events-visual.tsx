export function EventsVisual() {
  const items = ["Weddings", "Milestone Dinners", "Private Celebrations", "Sunset Gatherings"];

  return (
    <div className="w-full h-full bg-gradient-to-br from-[var(--color-ink)] to-[var(--color-tide)] flex items-center justify-center p-10">
      <ul className="space-y-5 text-center">
        {items.map((item, i) => (
          <li key={item}>
            <span
              className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-foam)]"
              style={{ opacity: 1 - i * 0.12 }} // subtle fade down the list — top item reads as the most prominent
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}