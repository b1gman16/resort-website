-- ============================================================
-- Extensions
-- ============================================================

-- Needed for the room/date overlap exclusion constraint on bookings.
-- Without this, Postgres has no way to express "no two ranges may overlap"
-- as a database-level guarantee — it would have to be enforced in app code,
-- which is NOT safe under concurrent requests (two guests booking the same
-- room/dates within the same second could both succeed).
create extension if not exists btree_gist;

-- ============================================================
-- Enums
-- ============================================================

create type booking_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

-- ============================================================
-- rooms
-- ============================================================

create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,               -- for clean URLs: /rooms/ocean-view-suite
  description text not null,
  base_price numeric(10, 2) not null check (base_price >= 0),
  capacity int not null check (capacity > 0),
  total_units int not null default 1 check (total_units > 0), -- how many rooms of this type exist
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column rooms.base_price is
  'Current listed price. Bookings snapshot this at creation time — changing this does NOT retroactively change past bookings.';

-- ============================================================
-- room_images
-- ============================================================

create table room_images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  storage_path text not null,   -- path within the Supabase Storage bucket, not a public URL
  alt_text text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_room_images_room_id on room_images(room_id);

-- ============================================================
-- amenities
-- ============================================================

create table amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text  -- icon identifier (e.g. lucide-react icon name) rendered in the UI
);

-- Join table: rooms can have many amenities, amenities belong to many rooms
create table room_amenities (
  room_id uuid not null references rooms(id) on delete cascade,
  amenity_id uuid not null references amenities(id) on delete cascade,
  primary key (room_id, amenity_id)
);

-- ============================================================
-- bookings
-- ============================================================

create table bookings (
  id uuid primary key default gen_random_uuid(),

  -- Short human-typeable code, distinct from the internal UUID.
  -- Never expose the raw `id` in guest-facing URLs/emails — this is what we expose instead.
  booking_reference text not null unique,

  room_id uuid not null references rooms(id),

  guest_name text not null,
  guest_email text not null,
  guest_phone text,

  check_in date not null,
  check_out date not null,
  guests_count int not null default 1 check (guests_count > 0),

  status booking_status not null default 'pending',

  -- Snapshotted at booking time — see comment on rooms.base_price above.
  price_per_night numeric(10, 2) not null check (price_per_night >= 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  currency text not null default 'PHP',

  special_requests text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  cancelled_at timestamptz,

  constraint check_out_after_check_in check (check_out > check_in),

  -- The core integrity guarantee for this whole app: no two CONFIRMED
  -- bookings for the same room may have overlapping date ranges.
  -- Scoped to 'confirmed' only (see WHERE clause) because v1 uses manual
  -- staff confirmation, not payment-triggered confirmation — multiple
  -- 'pending' requests for the same dates are allowed to stack up and get
  -- resolved by staff. See architecture notes for why this was chosen over
  -- a soft-hold/expiry system.
  exclude using gist (
    room_id with =,
    daterange(check_in, check_out) with &&
  ) where (status = 'confirmed')
);

create unique index idx_bookings_reference on bookings(booking_reference);
create index idx_bookings_guest_email on bookings(guest_email);
create index idx_bookings_room_dates on bookings(room_id, check_in, check_out);

comment on constraint check_out_after_check_in on bookings is
  'Prevents zero-length or inverted date ranges.';

-- ============================================================
-- updated_at auto-touch trigger (shared across tables)
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_rooms_updated_at
  before update on rooms
  for each row execute function set_updated_at();

create trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table rooms enable row level security;
alter table room_images enable row level security;
alter table amenities enable row level security;
alter table room_amenities enable row level security;
alter table bookings enable row level security;

-- Public (anon) can READ rooms/images/amenities — this is marketing content.
create policy "Public can view rooms"
  on rooms for select
  using (true);

create policy "Public can view room images"
  on room_images for select
  using (true);

create policy "Public can view amenities"
  on amenities for select
  using (true);

create policy "Public can view room amenities"
  on room_amenities for select
  using (true);

-- Bookings: NO public select/update policy is created here on purpose.
-- Guests never query `bookings` directly with the anon key — the booking
-- creation and the manage/lookup flow both go through Route Handlers using
-- the service_role client (see lib/supabase/admin.ts), which bypasses RLS
-- under our own server-side validation instead. This keeps guest booking
-- data from being queryable by anyone holding just the public anon key.
--
-- Authenticated staff (admin) access is granted below once staff roles exist.
create policy "Staff can view all bookings"
  on bookings for select
  using (auth.role() = 'authenticated');

create policy "Staff can update bookings"
  on bookings for update
  using (auth.role() = 'authenticated');

create policy "Staff can manage rooms"
  on rooms for all
  using (auth.role() = 'authenticated');