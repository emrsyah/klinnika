import "./globals.css";
import type { Metadata } from "next";
import { siteConfig } from "@/constant/config";
import SessionProvider from "@/components/auth/SessionProvider";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  // icons: {
  //   icon: '/favicon/favicon.ico',
  //   shortcut: '/favicon/favicon-16x16.png',
  //   apple: '/favicon/apple-touch-icon.png',
  // },
  // manifest: `/favicon/site.webmanifest`,
  // authors: [
  //   {
  //     name: 'Theodorus Clarence',
  //     url: 'https://theodorusclarence.com',
  //   },
  // ],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        <Toast />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
