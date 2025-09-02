import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Plans - PlanPal AI",
  description: "Manage and view all your created event plans. Track RSVPs, share events, and organize your group activities in one place.",
  openGraph: {
    title: "My Plans - PlanPal AI",
    description: "Manage and view all your created event plans. Track RSVPs, share events, and organize your group activities in one place.",
    url: '/my-plans',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PlanPal AI - Manage Your Event Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "My Plans - PlanPal AI",
    description: "Manage and view all your created event plans. Track RSVPs, share events, and organize your group activities in one place.",
    images: ['/og-image.png'],
  },
};

export default function MyPlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
