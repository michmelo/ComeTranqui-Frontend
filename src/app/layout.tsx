import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Come Tranqui — Comé sin preocuparte",
  description:
    "Come Tranqui te ayuda a encontrar restaurantes y cafeterías seguros para tus restricciones alimentarias. Sin gluten, sin lactosa, APLV, vegano y más.",
  keywords: [
    "sin gluten",
    "sin lactosa",
    "APLV",
    "vegano",
    "restricciones alimentarias",
    "restaurantes seguros",
    "come tranqui",
  ],
  openGraph: {
    title: "Come Tranqui — Comé sin preocuparte",
    description:
      "Encontrá restaurantes y cafeterías seguros para tu restricción alimentaria.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
