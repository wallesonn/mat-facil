"use client";

// Modal de parabéns ao subir de nível
import { AnimatePresence, motion } from "framer-motion";
import { Star, Trophy, X } from "lucide-react";
import { calculateLevel } from "@/services/gamification";

interface LevelUpModalProps {
  visible: boolean;
  newLevel: number;
  onClose?: () => void;
}

export function LevelUpModal({ visible, newLevel, onClose }: LevelUpModalProps) {
  const levelInfo = calculateLevel(newLevel * 100); // aproximação para pegar o label
  const info = { level: newLevel, label: ["", "Iniciante", "Explorador", "Aprendiz", "Estudante", "Dedicado", "Avançado", "Expert", "Mestre", "Gênio", "Lendário"][newLevel] ?? "" };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center shadow-2xl max-w-sm w-full mx-4"
          >
            {/* Botão fechar */}
            {onClose && (
              <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Ícone troféu com animação */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mb-6"
            >
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-yellow-300 fill-yellow-300" />
              </div>
            </motion.div>

            {/* Estrelas decorativas */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: (i % 2 === 0 ? 1 : -1) * Math.random() * 80 - 40, y: -Math.random() * 80 }}
                transition={{ duration: 1.5, delay: 0.2 + i * 0.15, repeat: Infinity, repeatDelay: 2 }}
                className="absolute top-1/3"
                style={{ left: "50%" }}
              >
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </motion.div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-base mb-2"
            >
              Parabéns! Você subiu de nível!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className="text-7xl font-black mb-2">{newLevel}</div>
              <div className="text-xl font-bold text-yellow-300">{info.label}</div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-white/70 text-sm"
            >
              Continue estudando para desbloquear novos níveis! 🚀
            </motion.p>

            {onClose && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={onClose}
                className="mt-6 bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-2.5 rounded-full transition-colors"
              >
                Incrível! 🎉
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
