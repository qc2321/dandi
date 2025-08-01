import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarShell from "./SidebarShell";
import SessionProvider from "../components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dandi GitHub Analyzer - AI-Powered Repository Analysis",
  description: "Get comprehensive analysis, trending metrics, important pull requests, and version updates for any open source GitHub repository in seconds.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8fafc]`}>
        <SessionProvider>
          <SidebarShell>{children}</SidebarShell>
        </SessionProvider>
      </body>
    </html>
  );
}
