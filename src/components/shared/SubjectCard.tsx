"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subject } from "@/types";

const colorPalette = [
  { gradient: "from-blue-500 to-blue-700", light: "bg-blue-500/10", icon: "text-blue-400", border: "border-blue-500/20" },
  { gradient: "from-purple-500 to-purple-700", light: "bg-purple-500/10", icon: "text-purple-400", border: "border-purple-500/20" },
  { gradient: "from-green-500 to-emerald-600", light: "bg-green-500/10", icon: "text-green-400", border: "border-green-500/20" },
  { gradient: "from-orange-500 to-red-500", light: "bg-orange-500/10", icon: "text-orange-400", border: "border-orange-500/20" },
  { gradient: "from-pink-500 to-rose-500", light: "bg-pink-500/10", icon: "text-pink-400", border: "border-pink-500/20" },
  { gradient: "from-indigo-500 to-violet-600", light: "bg-indigo-500/10", icon: "text-indigo-400", border: "border-indigo-500/20" },
];

interface SubjectCardProps {
  subject: Subject;
  index?: number;
  topicsCount?: number;
  completedCount?: number;
}

export function SubjectCard({ subject, index = 0, topicsCount = 0, completedCount = 0 }: SubjectCardProps) {
  const palette = colorPalette[index % colorPalette.length];
  const progress = topicsCount > 0 ? Math.round((completedCount / topicsCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/subjects/${subject.id}`}>
        <div className={cn(
          "relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-lg hover:shadow-black/20 transition-all duration-300 cursor-pointer",
          palette.border
        )}>
          {/* Header colorido */}
          <div className={cn("bg-gradient-to-br h-28 flex items-center justify-center relative", palette.gradient)}>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            {/* Decoração */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute -left-2 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />
          </div>

          {/* Conteúdo */}
          <div className="p-4">
            <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors">
              {subject.name}
            </h3>
            {subject.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {subject.description}
              </p>
            )}

            {/* Info de tópicos */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {topicsCount} {topicsCount === 1 ? "assunto" : "assuntos"}
              </span>
              <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                Acessar
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Barra de progresso */}
            {topicsCount > 0 && (
              <div className="mt-3">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + index * 0.05 }}
                    className={cn("h-full rounded-full bg-gradient-to-r", palette.gradient)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{progress}% concluído</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
