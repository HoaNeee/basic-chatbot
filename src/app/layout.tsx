import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import ChatProvider from "@/context/ChatContext";
import { cookies } from "next/headers";
import HistoryProvider from "@/context/HistoryContext";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatbot",
  description: "Chatbot application built with Next.js",
  keywords: ["chatbot", "next.js", "react", "typescript"],
  authors: [
    {
      name: "Hoane",
      url: "https://hoane.com",
    },
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await cookies();
  const token = cookie.get("jwt_token")?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="light">
          <AuthProvider token={token}>
            <HistoryProvider>
              <ChatProvider>
                <Toaster position="top-right" />
                {children}
              </ChatProvider>
            </HistoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
