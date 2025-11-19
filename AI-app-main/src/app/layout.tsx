import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "../components/AuthGuard";
import { ToastProvider } from "../components/Toast";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal AI App Builder",
  description: "Build React components and apps using AI - the right way",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-neutral-950 font-sans">
        <ToastProvider>
          <AuthGuard>
            <div className="min-h-full">
              {children}
            </div>
          </AuthGuard>
        </ToastProvider>
      </body>
    </html>
  );
}
