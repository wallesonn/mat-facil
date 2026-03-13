"use client";

// ============================================================
// HOOK DE GAMIFICAÇÃO — XP, nível e animações
// ============================================================

import { useState, useCallback } from "react";
import { addPoints, calculateLevel, getLevelProgress, pointsToNextLevel } from "@/services/gamification";

interface XPGainAnimation {
  visible: boolean;
  amount: number;
}

interface LevelUpAnimation {
  visible: boolean;
  newLevel: number;
}

export function useGamification() {
  const [xpAnimation, setXpAnimation] = useState<XPGainAnimation>({ visible: false, amount: 0 });
  const [levelUpAnimation, setLevelUpAnimation] = useState<LevelUpAnimation>({ visible: false, newLevel: 0 });

  const grantPoints = useCallback(async (userId: string, amount: number, reason: string) => {
    const result = await addPoints(userId, amount, reason);

    if (result.success) {
      // Mostra animação de XP ganho
      setXpAnimation({ visible: true, amount });
      setTimeout(() => setXpAnimation({ visible: false, amount: 0 }), 2500);

      // Mostra animação de level up se necessário
      if (result.leveledUp) {
        setTimeout(() => {
          setLevelUpAnimation({ visible: true, newLevel: result.newLevel });
          setTimeout(() => setLevelUpAnimation({ visible: false, newLevel: 0 }), 3500);
        }, 500);
      }
    }

    return result;
  }, []);

  return {
    grantPoints,
    xpAnimation,
    levelUpAnimation,
    calculateLevel,
    getLevelProgress,
    pointsToNextLevel,
  };
}
