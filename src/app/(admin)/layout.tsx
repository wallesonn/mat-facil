"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, BookOpen, BookMarked, FileText, LayoutDashboard, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/shared/Navbar";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin",          label: "Visão geral",  icon: LayoutDashboard, exact: true },
  { href: "/admin/subjects", label: "Matérias",     icon: BookOpen },
  { href: "/admin/topics",   label: "Assuntos",     icon: BookMarked },
  { href: "/admin/lessons",  label: "Aulas",        icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [loading, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
      </div>
    );
  }

  if (!profile || profile.role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar admin */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 h-screen sticky top-0 flex-col bg-slate-900 text-white shadow-2xl">
        <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">Painel Admin</span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== "/admin";
            const exactActive = item.exact && pathname === item.href;
            const isActive = item.exact ? exactActive : active;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-2"
          >
            ← Voltar à plataforma
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar profile={profile} />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
