import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details - PlanPal AI",
  description: "View event details, track RSVPs, and manage your group activities. See venue information, weather updates, and participant responses.",
  openGraph: {
    title: "Event Details - PlanPal AI",
    description: "View event details, track RSVPs, and manage your group activities. See venue information, weather updates, and participant responses.",
    url: '/plans',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PlanPal AI - Event Details and RSVP Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Event Details - PlanPal AI",
    description: "View event details, track RSVPs, and manage your group activities. See venue information, weather updates, and participant responses.",
    images: ['/og-image.png'],
  },
};

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
