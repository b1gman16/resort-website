export const siteConfig = {
  name: "Bayfront Resort",
  description:
    "A quiet beachfront resort with ocean-view suites, garden villas, and private bungalows.",
  nav: [
    { label: "Rooms", href: "/rooms" },
    { label: "Amenities", href: "/amenities" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  contact: {
    email: "hello@bayfrontresort.example",
    phone: "+63 900 000 0000",
    address: "3PCW+WJC, Dipaculao, Aurora, Philippines",
  },
} as const;