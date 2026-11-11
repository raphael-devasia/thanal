import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
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

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith("http") ? process.env.NEXT_PUBLIC_SITE_URL : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
  : "https://greymatterscare.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "graymatters | Dedicated Parent Care in Kerala for NRKs",
    template: "%s | graymatters"
  },
  description: "Ethical, zero-commission eldercare accompaniment, hospital OPD escorting, and mobility for parents in Kerala. Direct WhatsApp updates for NRI families abroad.",
  keywords: [
    "Kerala eldercare",
    "elder care Kerala",
    "NRK parents care",
    "hospital companion Kerala",
    "OPD escort Calicut Kochi",
    "NRI parents care Kerala",
    "graymatters eldercare",
    "elderly mobility service Kerala"
  ],
  authors: [{ name: "Zynthexion Technologies Private Limited" }],
  creator: "graymatters Eldercare Concierge",
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
    siteName: "graymatters Eldercare Concierge",
    title: "graymatters | Dedicated Parent Care in Kerala for NRKs",
    description: "Ethical, zero-commission eldercare accompaniment, hospital OPD escorting, and mobility for parents in Kerala. Direct WhatsApp updates for NRI families abroad.",
    images: [
      {
        url: "/og-image.png",
        secureUrl: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "graymatters Eldercare Concierge Kerala",
        type: "image/png",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "graymatters | Dedicated Parent Care in Kerala for NRKs",
    description: "Ethical, zero-commission eldercare accompaniment, hospital OPD escorting, and mobility for parents in Kerala. Direct WhatsApp updates for NRI families abroad.",
    images: [`${siteUrl}/og-image.png`],
  },
  other: {
    "image_src": `${siteUrl}/og-image.png`,
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
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="graymatters Eldercare Concierge Kerala" />
        <link rel="image_src" href={`${siteUrl}/og-image.png`} />
      </head>
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
