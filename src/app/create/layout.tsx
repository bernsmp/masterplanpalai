import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Plan - PlanPal AI",
  description: "Create the perfect event plan with AI-powered venue recommendations, weather-aware suggestions, and smart time optimization. Plan group activities effortlessly.",
  openGraph: {
    title: "Create New Plan - PlanPal AI",
    description: "Create the perfect event plan with AI-powered venue recommendations, weather-aware suggestions, and smart time optimization. Plan group activities effortlessly.",
    url: '/create',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PlanPal AI - Create New Event Plan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Create New Plan - PlanPal AI",
    description: "Create the perfect event plan with AI-powered venue recommendations, weather-aware suggestions, and smart time optimization.",
    images: ['/og-image.png'],
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
