"use client";

// Animação flutuante de ganho de XP
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";

interface XPGainToastProps {
  visible: boolean;
  amount: number;
}

export function XPGainToast({ visible, amount }: XPGainToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-5 py-3 rounded-2xl shadow-2xl"
        >
          <Zap className="w-5 h-5 fill-white" />
          <span className="text-lg">+{amount} XP</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
