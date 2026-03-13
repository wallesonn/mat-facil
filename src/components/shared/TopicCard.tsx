"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, BookMarked } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DIFFICULTY_CONFIG } from "@/lib/constants";
import type { Topic } from "@/types";

interface TopicCardProps {
  topic: Topic;
  subjectId: string;
  index?: number;
  lessonsCount?: number;
  completedLessons?: number;
}

export function TopicCard({ topic, subjectId, index = 0, lessonsCount = 0, completedLessons = 0 }: TopicCardProps) {
  const diffConfig = DIFFICULTY_CONFIG[topic.difficulty];
  const progress = lessonsCount > 0 ? Math.round((completedLessons / lessonsCount) * 100) : 0;
  const isCompleted = progress === 100 && lessonsCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ x: 4 }}
      className="group"
    >
      <Link href={`/subjects/${subjectId}/topics/${topic.id}`}>
        <div className={cn(
          "flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md hover:shadow-black/20 transition-all duration-200 cursor-pointer",
          isCompleted ? "border-green-500/30 bg-green-500/5" : "border-border"
        )}>
          {/* Número de ordem */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
            isCompleted ? "bg-green-500 text-white" : "bg-primary/10 text-primary"
          )}>
            {isCompleted ? "✓" : topic.order || index + 1}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                {topic.title}
              </h3>
              <Badge variant="outline" className={cn("text-xs flex-shrink-0", diffConfig.color)}>
                {diffConfig.label}
              </Badge>
            </div>
            {topic.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{topic.description}</p>
            )}
            {/* Progresso */}
            {lessonsCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
                    className={cn("h-full rounded-full", isCompleted ? "bg-green-500" : "bg-primary")}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {completedLessons}/{lessonsCount} aulas
                </span>
              </div>
            )}
          </div>

          {/* Ícone + seta */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <BookMarked className="w-4 h-4 text-muted-foreground/50" />
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
