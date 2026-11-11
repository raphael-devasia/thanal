import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#122617"
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith("http") ? process.env.NEXT_PUBLIC_SITE_URL : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://greymatters.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Greymatters Eldercare Concierge | Dedicated Parent Care in Kerala for NRKs",
    template: "%s | Greymatters Eldercare"
  },
  description: "Ethical, zero-commission eldercare accompaniment, hospital OPD escorting, and mobility for parents in Kerala. Direct WhatsApp updates for NRI families abroad.",
  keywords: [
    "Kerala eldercare",
    "elder care Kerala",
    "NRK parents care",
    "hospital companion Kerala",
    "OPD escort Calicut Kochi",
    "NRI parents care Kerala",
    "Greymatters eldercare",
    "elderly mobility service Kerala"
  ],
  authors: [{ name: "Zynthexion Technologies Private Limited" }],
  creator: "Greymatters Eldercare Concierge",
  publisher: "Zynthexion Technologies Private Limited",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Greymatters Eldercare Concierge",
    title: "Greymatters Eldercare | Dedicated Parent Care in Kerala for NRKs",
    description: "Ethical, zero-commission eldercare accompaniment, hospital OPD escorting, and mobility for parents in Kerala. Direct WhatsApp updates for NRI families abroad.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Greymatters Eldercare Concierge Kerala",
        type: "image/png",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Greymatters Eldercare | Dedicated Parent Care in Kerala for NRKs",
    description: "Ethical, zero-commission eldercare accompaniment, hospital OPD escorting, and mobility for parents in Kerala. Direct WhatsApp updates for NRI families abroad.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ym99lnwhe3");
            `
          }}
        />
      </body>
    </html>
  );
}
