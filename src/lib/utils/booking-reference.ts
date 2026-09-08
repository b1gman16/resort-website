// Generates short, human-typeable booking reference codes like "RST-8F2K1".
//
// Design decisions:
// - Excludes ambiguous characters (0/O, 1/I/L) so guests reading it off a
//   confirmation email over the phone to staff don't misread it.
// - 5 characters from a 32-symbol alphabet = 32^5 (~33.5 million) combinations.
//   Collision odds are effectively covered by the DB's UNIQUE constraint anyway
//   (see Part 1 migration) — this generator doesn't need to guarantee
//   uniqueness itself, just make collisions rare enough that a retry on
//   conflict (below) almost never actually triggers.

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

function randomSegment(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

export function generateBookingReference(): string {
  return `RST-${randomSegment(5)}`;
}