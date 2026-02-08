"use client";
import SkinShadeBackground from "@/components/common/SkinShadeBackground";
import FloatingDecorations from "@/components/common/FloatingDecorations";
import Header from "@/components/common/Header";
import LoginModal from "@/components/common/LoginModal";
import { UIProvider } from "@/context/UIContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <SkinShadeBackground />
      <FloatingDecorations />
      <div className="relative z-20">
        <Header />
      </div>
      <main className="relative z-10 min-h-screen pt-16">{children}</main>
      <LoginModal />
    </UIProvider>
  );
}
