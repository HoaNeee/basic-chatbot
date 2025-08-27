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

const getHistories = async (token: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();

    if (!data.success) {
      return [];
    }

    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await cookies();
  const token = cookie.get("jwt_token")?.value as string;
  const histories = await getHistories(token);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="light">
          <AuthProvider token={token}>
            <HistoryProvider histories={histories}>
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
