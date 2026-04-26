import { ReactNode } from "react";
import { Sidebar } from "@/components/chat/Sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-[#1c1c1a] text-[#f0f0f5] overflow-hidden font-sans overscroll-none">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden overscroll-none">
        {children}
      </div>
    </div>
  );
}
