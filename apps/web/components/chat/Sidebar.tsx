"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquarePlus,
  ListOrdered,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  Scissors,
  FileText,
  BrainCircuit,
} from "lucide-react";
import { SplitFlapText } from "@/components/ui/split-flap-text";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`flex h-full shrink-0 flex-col overflow-hidden overscroll-none border-r border-[#31312f] bg-[#1c1c1a] transition-[width] duration-300 ease-in-out ${
        isExpanded ? "w-[260px]" : "w-[64px]"
      }`}
    >
      <div
        className={`flex h-12 shrink-0 items-center border-b border-[#31312f] transition-all duration-300 ${
          isExpanded ? "justify-between px-4" : "justify-center px-2"
        }`}
      >
        {isExpanded ? (
          <>
            <button className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-white transition-opacity hover:opacity-90">
              <SplitFlapText
                text="PARALLAX"
                speed={80}
                fontSize="1.35rem"
                className="shrink-0"
              />
            </button>

            <button
              onClick={() => setIsExpanded(false)}
              className="shrink-0 rounded-md p-1.5 text-[#a1a19d] transition-colors hover:bg-[#2c2c2a] hover:text-white"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="rounded-md p-2 text-[#a1a19d] transition-colors hover:bg-[#2c2c2c] hover:text-white"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <nav
        className={`flex shrink-0 flex-col transition-all duration-300 ${
          isExpanded ? "gap-1 px-3 py-2" : "items-center gap-4 px-0 py-2"
        }`}
      >
        {!isExpanded && (
          <button className="rounded-md p-2 text-[#a1a19d] transition-colors hover:bg-[#2c2c2c] hover:text-white">
            <MessageSquarePlus className="h-5 w-5" strokeWidth={1.5} />
          </button>
        )}

        {isExpanded && (
          <NavItem
            isExpanded={isExpanded}
            icon={<MessageSquarePlus className="h-[18px] w-[18px]" strokeWidth={1.5} />}
            label="New Chat"
            href="/chat"
          />
        )}

        <NavItem
          isExpanded={isExpanded}
          icon={
            <ListOrdered
              className={isExpanded ? "h-[18px] w-[18px]" : "h-5 w-5"}
              strokeWidth={1.5}
            />
          }
          label="Leaderboard"
          href="/leaderboard"
        />
        <NavItem
          isExpanded={isExpanded}
          icon={<Search className={isExpanded ? "h-[18px] w-[18px]" : "h-5 w-5"} strokeWidth={1.5} />}
          label="Search"
          href="#"
        />
      </nav>

      <div
        className={`flex min-h-0 flex-1 flex-col overflow-hidden transition-opacity duration-200 ${
          isExpanded ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="custom-scrollbar mt-4 flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 pb-4">
          <div className="px-3 pb-2 text-[12px] font-medium text-[#a1a19d]">Older</div>

          <HistoryItem icon={<Scissors className="h-[14px] w-[14px]" />} title="hello!" />
          <HistoryItem icon={<FileText className="h-[14px] w-[14px]" />} title="Analyse" />
          <HistoryItem icon={<Scissors className="h-[14px] w-[14px]" />} title="what is Organized AI?" />
          <HistoryItem icon={<Scissors className="h-[14px] w-[14px]" />} title="python function to print..." />
          <HistoryItem icon={<Bot className="h-[14px] w-[14px]" />} title="python function to print..." />
          <HistoryItem icon={<Bot className="h-[14px] w-[14px]" />} title="hello, how are you?" />
          <HistoryItem icon={<Scissors className="h-[14px] w-[14px]" />} title="Just like TextEdit on Ma..." />
          <HistoryItem
            icon={<span className="font-serif text-[12px] font-bold leading-none">AI</span>}
            title="A World Away: Hunting..."
          />
          <HistoryItem icon={<BrainCircuit className="h-[14px] w-[14px]" />} title="Hey! I want to build a w..." />
        </div>

        <div className="mt-auto shrink-0 border-t border-[#31312f] bg-[#1c1c1a]">
          <button className="flex w-full items-center gap-3 overflow-hidden p-4 text-left transition-colors hover:bg-[#2c2c2a]">
            <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-tr from-blue-600 via-purple-500 to-orange-400" />
            <span className="min-w-0 truncate whitespace-nowrap text-[14px] font-medium tracking-tight text-[#e0e0e0]">
              saravanan.parthiban3010...
            </span>
          </button>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap border-t border-[#31312f] px-5 py-3 text-[12px] text-[#a1a19d]">
            <Link href="#" className="transition-colors hover:text-white">
              Terms of Use
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  href,
  isExpanded,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  isExpanded: boolean;
}) {
  if (!isExpanded) {
    return (
      <Link
        href={href}
        className="flex items-center justify-center rounded-lg p-2 text-[#a1a19d] transition-colors hover:bg-[#2c2c2c] hover:text-white"
        title={label}
      >
        {icon}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-3 overflow-hidden whitespace-nowrap rounded-lg px-3 py-2 text-[15px] text-[#e0e0e0] transition-colors hover:bg-[#2c2c2a] hover:text-white"
    >
      <div className="flex w-5 shrink-0 items-center justify-center text-[#a1a19d]">{icon}</div>
      <span className="truncate">{label}</span>
    </Link>
  );
}

function HistoryItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <button className="group flex shrink-0 items-center gap-3 overflow-hidden whitespace-nowrap rounded-lg px-3 py-2 text-left text-[14px] tracking-tight text-[#e0e0e0] transition-colors hover:bg-[#2c2c2a] hover:text-white">
      <div className="flex w-[18px] shrink-0 items-center justify-center text-[#a1a19d] group-hover:text-white">
        {icon}
      </div>
      <span className="truncate">{title}</span>
    </button>
  );
}
