"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Menu, X, User, Settings } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/services/auth";
import { XPProgressBar } from "@/components/ui/xp-progress-bar";
import { APP_META } from "@/lib/constants";
import type { Profile } from "@/types";

interface NavbarProps {
  profile: Profile | null;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export function Navbar({ profile, onMenuToggle, sidebarOpen }: NavbarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  async function handleSignOut() {
    setLoading(true);
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-4 gap-3 shadow-sm">
      {/* Toggle sidebar (mobile) */}
      {onMenuToggle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      )}

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
          <span className="text-white font-black text-sm">M</span>
        </div>
        <span className="font-bold text-lg text-foreground font-heading hidden sm:block">
          {APP_META.name}
        </span>
      </Link>

      {/* XP bar (desktop) */}
      {profile && (
        <div className="hidden md:block flex-1 max-w-xs">
          <XPProgressBar points={profile.points} compact showLabel={false} />
        </div>
      )}

      <div className="flex-1" />

      {/* Info de nível + avatar */}
      {profile && (
        <div className="flex items-center gap-3">
          {/* Nível badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hidden sm:flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5"
          >
            <span className="text-xs font-bold text-blue-400">Nível {profile.level}</span>
            <span className="text-xs text-purple-400 font-medium">· {profile.points} XP</span>
          </motion.div>

          {/* Avatar com dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer">
              <Avatar className="w-9 h-9 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="font-semibold text-sm">{profile.name}</p>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" /> Meu painel
              </DropdownMenuItem>
              {profile.role === "admin" && (
                <DropdownMenuItem
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4" /> Painel Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={loading}
                className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {loading ? "Saindo..." : "Sair"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
