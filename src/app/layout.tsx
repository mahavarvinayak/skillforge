import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import {
  DOMAINS,
  FAQS,
  REPO_URL,
  PI_LAB_URL,
  PI_LAB_LINKEDIN_URL,
  FOUNDER_LINKEDIN_URL,
} from "@/components/forge/data";

/* Fraunces — high-contrast editorial serif (variable, no fixed weight
   so the full 100–900 range + optical sizing stay available) */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const SITE_URL = "https://thepilab.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "PI SkillForge — The Modular Intelligence Layer for LinkedIn Workflows",
    template: "%s | PI SkillForge by The PI Lab",
  },
  description:
    "40 contract-governed reasoning skills across 10 capability domains for LinkedIn workflows. Zero runtime dependencies, Draft 2020-12 schema validation, swappable adapter boundary, and 6-gate governed self-evolution. Open source under MIT by The PI Lab.",
  keywords: [
    "PI SkillForge",
    "SkillForge",
    "LinkedIn AI agents",
    "LinkedIn automation",
    "The PI Lab",
    "Vinayak Mahavar",
    "modular intelligence layer",
    "LinkedIn reasoning skills",
    "Claude Code skills",
    "Cursor skills",
    "Windsurf skills",
    "B2B prospecting AI",
    "cold messaging AI",
    "sales navigator automation",
    "LinkedIn MCP server",
    "Draft 2020-12 JSON schema",
    "governed self evolution",
    "open source AI agent skills",
    "AI workflow automation",
  ],
  authors: [
    { name: "The PI Lab", url: PI_LAB_URL },
    { name: "Vinayak Mahavar", url: FOUNDER_LINKEDIN_URL },
  ],
  creator: "The PI Lab",
  publisher: "The PI Lab",
  applicationName: "PI SkillForge",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "PI SkillForge — The Modular Intelligence Layer for LinkedIn Workflows",
    description:
      "Prompts are volatile scripts. Skills are enduring infrastructure. 40 contract-governed reasoning modules for LinkedIn workflows by The PI Lab.",
    type: "website",
    siteName: "PI SkillForge",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PI SkillForge — Modular Intelligence Layer for LinkedIn Workflows by The PI Lab",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "PI SkillForge — The Modular Intelligence Layer for LinkedIn Workflows",
    description:
      "Prompts are volatile scripts. Skills are enduring infrastructure. 40 contract-governed reasoning modules for LinkedIn workflows.",
    site: "@ThePILab",
    creator: "@ThePILab",
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
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f7f2ea",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "PI SkillForge",
        description:
          "The Modular Intelligence Layer for LinkedIn Workflows by The PI Lab",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "The PI Lab",
        url: PI_LAB_URL,
        logo: `${SITE_URL}/icon.svg`,
        sameAs: [
          PI_LAB_LINKEDIN_URL,
          REPO_URL,
          FOUNDER_LINKEDIN_URL,
        ],
        founder: {
          "@type": "Person",
          name: "Vinayak Mahavar",
          url: FOUNDER_LINKEDIN_URL,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: "PI SkillForge",
        operatingSystem: "Cross-platform (macOS, Linux, Windows, Cloud)",
        applicationCategory: "DeveloperApplication, BusinessApplication",
        description:
          "40 contract-governed reasoning skills for LinkedIn workflows with zero runtime dependencies, swappable adapter boundary, and Draft 2020-12 schema validation.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        license: "https://opensource.org/licenses/MIT",
        author: { "@id": `${SITE_URL}/#organization` },
        codeRepository: REPO_URL,
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#catalog`,
        name: "PI SkillForge 40-Skill Catalog",
        description:
          "40 contract-governed reasoning modules organized across 10 operational domains",
        numberOfItems: 40,
        itemListElement: DOMAINS.map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${d.index} - ${d.name}`,
          description: d.purpose,
        })),
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-paper text-ink grain`}
      >
        {children}
      </body>
    </html>
  );
}
