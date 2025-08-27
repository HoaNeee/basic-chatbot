import AppSideBar from "@/components/app-sidebar";
import FooterChat from "@/components/footer-chat";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSideBar />

      <main className="flex flex-col flex-1 w-full max-h-screen">
        <Header />
        {children}
        <FooterChat />
      </main>
    </SidebarProvider>
  );
}
