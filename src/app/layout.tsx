import type { Metadata } from "next";
import { Barlow, Inter } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cursos.anbro.com.br"),
  title: {
    default: "ANBRO Cursos | Especialização em Harmonização Orofacial",
    template: "%s | ANBRO Cursos",
  },
  description:
    "Especialização e cursos em Harmonização Orofacial pela UNIFOR e Clinicare Training. Base científica, sem imediatismos. Para cirurgiões dentistas e médicos.",
  openGraph: {
    title: "ANBRO Cursos — Harmonização Orofacial",
    description:
      "Especialização UNIFOR (20 meses) e HOF Custom Training Clinicare (5 meses). Professores mestres e doutores, +13 anos de experiência.",
    type: "website",
    locale: "pt_BR",
    siteName: "ANBRO Cursos",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
