"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  Settings,
  LayoutDashboard
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Chat Tutor", href: "/chat", icon: MessageSquare },
  { name: "Vocabulary", href: "/vocabulary", icon: BookOpen },
  { name: "Grammar Vault", href: "/grammar", icon: GraduationCap },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-20 items-center justify-center border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-orange-500">
          Dutch<span className="text-white">Master</span>
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-slate-800 text-orange-500" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive ? "text-orange-500" : "text-slate-400 group-hover:text-white"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <Link
          href="/settings"
          className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <Settings className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
          Settings
        </Link>
      </div>
    </div>
  );
}
