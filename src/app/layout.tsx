import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/auth-guard";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "PlanPal AI - Smart Planning Assistant",
  description: "An AI planning assistant that acts like your group's most organized friend—the one who actually remembers everyone's schedules, knows all the good spots, and somehow makes plans happen without the endless group chat chaos.",
  keywords: ["event planning", "group coordination", "AI assistant", "social planning", "venue recommendations", "RSVP management"],
  authors: [{ name: "PlanPal AI Team" }],
  creator: "PlanPal AI",
  publisher: "PlanPal AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PlanPal AI - Smart Planning Assistant",
    description: "An AI planning assistant that acts like your group's most organized friend—the one who actually remembers everyone's schedules, knows all the good spots, and somehow makes plans happen without the endless group chat chaos.",
    url: '/',
    siteName: 'PlanPal AI',
    images: [
      {
        url: '/smarter-solutions-logo.png',
        width: 1200,
        height: 630,
        alt: 'PlanPal AI - Smart Planning Assistant for Group Coordination',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PlanPal AI - Smart Planning Assistant",
    description: "An AI planning assistant that acts like your group's most organized friend—the one who actually remembers everyone's schedules, knows all the good spots, and somehow makes plans happen without the endless group chat chaos.",
    images: ['/smarter-solutions-logo.png'],
    creator: '@planpalai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon-192x192.png', color: '#ffb829' },
    ],
  },
  manifest: '/manifest.json',
  category: 'productivity',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-192x192.png" />
        <link rel="mask-icon" href="/favicon-192x192.png" color="#ffb829" />
        <meta name="theme-color" content="#ffb829" />
        <meta name="msapplication-TileColor" content="#ffb829" />
        <meta name="msapplication-TileImage" content="/favicon-192x192.png" />
      </head>
      <body suppressHydrationWarning={true}>
        <AuthGuard>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
