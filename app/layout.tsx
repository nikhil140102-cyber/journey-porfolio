import type { Metadata, Viewport } from 'next';
import { site } from '@/lib/content';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description: site.intro,
  keywords: ['Nikhil Rana', 'Web Developer', 'DevOps Engineer', 'Next.js', 'React', 'WordPress', 'AWS', 'Terraform', 'Portfolio'],
  authors: [{ name: site.name, url: site.url }],
  openGraph: { type: 'website', title: `${site.name} — ${site.role}`, description: site.intro, url: site.url, siteName: site.name },
  twitter: { card: 'summary_large_image', title: `${site.name} — ${site.role}`, description: site.intro },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#07060f', width: 'device-width', initialScale: 1 };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  address: { '@type': 'PostalAddress', addressLocality: 'Dholpur', addressRegion: 'Rajasthan', addressCountry: 'IN' },
  sameAs: [site.socials.github, site.socials.linkedin],
  knowsAbout: ['React', 'Next.js', 'WordPress', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#about" className="skip">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
