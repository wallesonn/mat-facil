"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

interface LessonCardProps {
  lesson: Lesson;
  subjectId: string;
  topicId: string;
  index?: number;
  completed?: boolean;
  progressPercentage?: number;
}

export function LessonCard({
  lesson,
  subjectId,
  topicId,
  index = 0,
  completed = false,
  progressPercentage = 0,
}: LessonCardProps) {
  const inProgress = progressPercentage > 0 && !completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ x: 3 }}
      className="group"
    >
      <Link href={`/subjects/${subjectId}/topics/${topicId}/lessons/${lesson.id}`}>
        <div className={cn(
          "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer",
          completed
            ? "bg-green-500/5 border-green-500/30 hover:bg-green-500/10"
            : inProgress
            ? "bg-blue-500/5 border-blue-500/30 hover:bg-blue-500/10"
            : "bg-card border-border hover:border-primary/30 hover:bg-primary/5"
        )}>
          {/* Ícone de status */}
          <div className="flex-shrink-0">
            {completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : inProgress ? (
              <PlayCircle className="w-5 h-5 text-blue-500" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground/40" />
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium text-sm truncate",
              completed ? "text-green-400" : "text-foreground group-hover:text-primary transition-colors"
            )}>
              {lesson.title}
            </p>
            {inProgress && (
              <div className="mt-1.5">
                <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden max-w-[100px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <span className="text-xs text-blue-400 font-medium">{progressPercentage}% concluído</span>
              </div>
            )}
            {completed && (
              <p className="text-xs text-green-400 font-medium mt-0.5">Concluída ✓</p>
            )}
          </div>

          {/* Seta */}
          <ChevronRight className={cn(
            "w-4 h-4 flex-shrink-0 transition-all duration-200",
            completed ? "text-green-400" : "text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5"
          )} />
        </div>
      </Link>
    </motion.div>
  );
}
