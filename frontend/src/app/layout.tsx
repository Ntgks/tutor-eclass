import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tutor eClass",
    template: "%s | Tutor eClass",
  },
  description:
    "Ο προσωπικός χώρος για μαθητές, μαθήματα και εργασίες.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="el" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}