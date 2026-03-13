"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Settings,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { XPProgressBar } from "@/components/ui/xp-progress-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APP_META } from "@/lib/constants";
import type { Profile } from "@/types";

interface SidebarProps {
  profile: Profile | null;
  open?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/subjects",  label: "Matérias", icon: BookOpen },
  { href: "/ranking",   label: "Ranking",  icon: Trophy },
];

const adminItems = [
  { href: "/admin", label: "Admin", icon: Settings },
];

export function Sidebar({ profile, open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const sidebarContent = (
    <div className="flex flex-col h-full sidebar-gradient text-white">
      {/* Logo + fechar (mobile) */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="font-black text-sm text-white">M</span>
          </div>
          <span className="font-bold text-base">{APP_META.name}</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Perfil do usuário */}
      {profile && (
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10 border-2 border-white/30">
              <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.name} />
              <AvatarFallback className="bg-white/20 text-white font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{profile.name}</p>
              <p className="text-xs text-white/60 truncate">{profile.email}</p>
            </div>
          </div>
          <XPProgressBar points={profile.points} compact className="opacity-90" />
        </div>
      )}

      {/* Navegação principal */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          );
        })}

        {/* Seção Admin */}
        {profile?.role === "admin" && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Admin</p>
            </div>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Rodapé */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">{APP_META.name} v{APP_META.version}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0 overflow-hidden shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden overflow-hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
