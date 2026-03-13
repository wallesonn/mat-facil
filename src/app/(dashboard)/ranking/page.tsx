"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { calculateLevel } from "@/services/gamification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/types";

export default function RankingPage() {
  const { profile: currentUser } = useAuth();
  const [players, setPlayers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id, name, email, avatar_url, points, level, role")
        .order("points", { ascending: false })
        .limit(50);
      setPlayers((data as Profile[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  const medalIcon = (pos: number) => {
    if (pos === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (pos === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    return <Medal className="w-5 h-5 text-amber-600" />;
  };

  const medalColor = (pos: number) => {
    if (pos === 0) return "from-yellow-400 to-orange-500";
    if (pos === 1) return "from-gray-300 to-gray-400";
    return "from-amber-500 to-amber-700";
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground font-heading flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" /> Ranking
        </h1>
        <p className="text-muted-foreground mt-1">Os estudantes com mais XP da plataforma</p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Trophy className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Nenhum jogador ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <>
          {/* Pódio TOP 3 */}
          {top3.length > 0 && (
            <div className="flex items-end justify-center gap-3 pt-4 pb-2">
              {[top3[1], top3[0], top3[2]].filter(Boolean).map((player, idx) => {
                const realPos = top3.indexOf(player);
                const height = realPos === 0 ? "h-32" : realPos === 1 ? "h-24" : "h-20";
                const initials = player.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
                const levelInfo = calculateLevel(player.points);
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex flex-col items-center ${realPos === 0 ? "order-2" : realPos === 1 ? "order-1" : "order-3"}`}
                  >
                    <div className="relative mb-2">
                      <Avatar className="w-14 h-14 border-4 border-background shadow-lg">
                        <AvatarImage src={player.avatar_url ?? undefined} />
                        <AvatarFallback className={`bg-gradient-to-br ${medalColor(realPos)} text-white font-bold`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-card rounded-full flex items-center justify-center shadow">
                        {medalIcon(realPos)}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-foreground text-center max-w-[80px] truncate">{player.name.split(" ")[0]}</p>
                    <p className="text-xs text-muted-foreground">{player.points} XP</p>
                    <div className={`w-20 ${height} bg-gradient-to-t ${medalColor(realPos)} rounded-t-xl mt-2 flex items-center justify-center`}>
                      <span className="text-white font-black text-xl">#{realPos + 1}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Lista posições 4+ */}
          {rest.length > 0 && (
            <div className="space-y-2">
              {rest.map((player, i) => {
                const pos = i + 4;
                const isMe = player.id === currentUser?.id;
                const initials = player.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
                const levelInfo = calculateLevel(player.points);
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${isMe ? "bg-blue-500/10 border-blue-500/30" : "bg-card border-border"}`}
                  >
                    <span className="w-7 text-center text-sm font-bold text-muted-foreground">#{pos}</span>
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={player.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {player.name} {isMe && <span className="text-blue-500 text-xs">(você)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">Nível {player.level} · {levelInfo.label}</p>

                    </div>
                    <span className="text-sm font-bold text-foreground">{player.points} XP</span>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Posição do usuário atual se não estiver no top */}
          {currentUser && !players.slice(0, 50).find(p => p.id === currentUser.id) && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-center">
              <p className="text-sm text-blue-400 font-medium">
                Você ainda não está no top 50. Continue estudando para subir no ranking! 💪
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
