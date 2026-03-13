"use client";

// ============================================================
// BARRA DE XP / NÍVEL — componente de progresso gamificado
// ============================================================

import { motion } from "framer-motion";
import { calculateLevel, getLevelProgress, pointsToNextLevel } from "@/services/gamification";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface XPProgressBarProps {
  points: number;
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export function XPProgressBar({ points, className, showLabel = true, compact = false }: XPProgressBarProps) {
  const levelInfo = calculateLevel(points);
  const progress = getLevelProgress(points);
  const remaining = pointsToNextLevel(points);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-sm">
              <Star className="w-3 h-3 text-white fill-white" />
            </div>
            <span className={cn("font-bold text-foreground", compact ? "text-sm" : "text-base")}>
              Nível {levelInfo.level}
            </span>
            <span className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
              · {levelInfo.label}
            </span>
          </div>
          {levelInfo.level < 10 ? (
            <span className={cn("text-muted-foreground font-medium", compact ? "text-xs" : "text-sm")}>
              {points} / {levelInfo.maxPoints} XP
            </span>
          ) : (
            <span className={cn("text-yellow-600 font-bold", compact ? "text-xs" : "text-sm")}>
              Máximo! ✨
            </span>
          )}
        </div>
      )}

      {/* Barra de progresso */}
      <div className={cn(
        "relative w-full rounded-full overflow-hidden bg-muted",
        compact ? "h-2" : "h-3"
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 relative"
        >
          {/* Brilho animado na barra */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-gradient-x rounded-full" />
        </motion.div>
      </div>

      {/* Pontos para o próximo nível */}
      {showLabel && !compact && levelInfo.level < 10 && (
        <p className="text-xs text-muted-foreground mt-1 text-right">
          Faltam <span className="font-semibold text-primary">{remaining} XP</span> para o próximo nível
        </p>
      )}
    </div>
  );
}
