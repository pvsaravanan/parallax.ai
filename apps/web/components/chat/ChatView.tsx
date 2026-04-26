"use client";

import { useEffect, useRef, useState } from "react";
import { 
  ChevronDown, 
  Swords, 
  MessageSquare, 
  MessageCircle
} from "lucide-react";
import {
  ClaudeChatInput,
  type AttachedFile,
  type PastedContent,
} from "@/components/ui/claude-style-chat-input";

export function ChatView() {
  const [mode, setMode] = useState<"battle" | "compare" | "direct">("battle");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = dropdownContainerRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      setIsDropdownOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isDropdownOpen]);

  // Helper for mode dropdown
  const getModeDetails = (m: string) => {
    switch (m) {
      case "battle": return { label: "Battle Mode", icon: <Swords className="w-[18px] h-[18px]" /> };
      case "compare": return { label: "Side by Side", icon: <MessageSquare className="w-[18px] h-[18px]" /> };
      case "direct": return { label: "Direct", icon: <MessageCircle className="w-[18px] h-[18px]" /> };
      default: return { label: "", icon: null };
    }
  };

  const handleSendMessage = (data: {
    message: string;
    files: AttachedFile[];
    pastedContent: PastedContent[];
    model: string;
    isThinkingEnabled: boolean;
  }) => {
    console.log("Send message:", data);
    // TODO: Integrate with gateway API
  };

  return (
    <div className="flex-1 flex min-h-0 flex-col bg-[#262624] overflow-hidden overscroll-none relative font-sans text-gray-100">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-6 h-12 border-b border-[#31312f]">
        <div className="relative" ref={dropdownContainerRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-gray-200/90 hover:text-gray-100 px-2 py-1.5 rounded-md transition-colors text-[15px] font-medium"
          >
            {getModeDetails(mode).icon}
            <span>{getModeDetails(mode).label}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-300/80 mt-0.5 transition-transform ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-[270px] bg-[#3a3a38] border border-[#4a4a47] rounded-lg shadow-2xl overflow-hidden z-20">
              <div className="divide-y divide-[#4a4a47]">
                <ModeOption 
                  active={mode === "battle"}
                  icon={<Swords className="w-[18px] h-[18px]" />} 
                  label="Battle Mode" 
                  desc="Battle 2 anonymous models" 
                  onClick={() => { setMode("battle"); setIsDropdownOpen(false); }} 
                />
                <ModeOption 
                  active={mode === "compare"}
                  icon={<MessageSquare className="w-[18px] h-[18px]" />} 
                  label="Side by Side" 
                  desc="Compare 2 models of your choice" 
                  onClick={() => { setMode("compare"); setIsDropdownOpen(false); }} 
                />
                <ModeOption 
                  active={mode === "direct"}
                  icon={<MessageCircle className="w-[18px] h-[18px]" />} 
                  label="Direct" 
                  desc="Chat with 1 model at a time" 
                  onClick={() => { setMode("direct"); setIsDropdownOpen(false); }} 
                />
              </div>
            </div>
          )}
        </div>

        <button className="bg-white text-gray-900 text-[13px] font-medium px-4 py-1.5 rounded hover:bg-gray-100 transition-colors">
          Login
        </button>
      </header>

      {/* Main Chat Interface Area */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden overscroll-none p-4 min-h-0 relative mb-[15vh]">
        <div className="w-full max-w-[760px] flex flex-col items-center">
          
          <div className="flex flex-col items-center mb-10 gap-4">
            <div className="flex items-center justify-center pb-2">
              <div className="text-3xl font-serif italic tracking-tight text-white mb-2">
                parallax.ai
              </div>
            </div>
            
            <h1 className="text-[52px] leading-tight font-serif text-[#e0e0e0] tracking-tight">
              Experience the <span className="bg-accent text-[#1c1c1a] px-3 py-1 italic shadow-sm leading-none inline-block">frontier</span>
            </h1>
          </div>

          {/* Claude-style Chat Input */}
          <ClaudeChatInput onSendMessage={handleSendMessage} />
        </div>
      </main>
    </div>
  );
}

function ModeOption({ active, icon, label, desc, onClick }: { active: boolean; icon: React.ReactNode; label: string; desc: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors ${
        active ? "bg-[#2f2f2d]" : "hover:bg-[#2f2f2d]"
      }`}
    >
      <div className={`mt-0.5 ${active ? "text-gray-100" : "text-gray-200/70"}`}>{icon}</div>
      <div className="flex flex-col">
        <span className={`text-[14px] font-medium leading-tight ${active ? "text-gray-100" : "text-gray-100/90"}`}>{label}</span>
        <span className="text-[12px] text-gray-300/70 mt-0.5 leading-tight">{desc}</span>
      </div>
    </button>
  );
}

