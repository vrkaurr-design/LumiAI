"use client";
import SkinShadeBackground from "@/components/common/SkinShadeBackground";
import LiveBackground from "@/components/common/LiveBackground";
import Header from "@/components/common/Header";
import LoginModal from "@/components/common/LoginModal";
import { UIProvider } from "@/context/UIContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <SkinShadeBackground />
      <LiveBackground />
      <div className="relative z-20">
        <Header />
      </div>
      <main className="relative z-10 min-h-screen pt-16">{children}</main>
      <LoginModal />
    </UIProvider>
  );
}
