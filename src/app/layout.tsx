import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlanPal AI - Smart Planning Assistant",
  description: "An AI planning assistant that acts like your group's most organized friend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
