"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Flame, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SubjectCard } from "@/components/shared/SubjectCard";
import { XPProgressBar } from "@/components/ui/xp-progress-bar";
import { getSubjects, getTopicCountBySubject } from "@/services/subjects";
import { calculateLevel } from "@/services/gamification";
import type { Subject } from "@/types";

type SubjectWithCount = Subject & {
  topicsCount: number;
};

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-lg text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [subjects, setSubjects] = useState<SubjectWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      const data = await getSubjects();
      const subjectsWithCounts = await Promise.all(
        data.map(async (subject) => ({
          ...subject,
          topicsCount: await getTopicCountBySubject(subject.id),
        }))
      );

      setSubjects(subjectsWithCounts as SubjectWithCount[]);
      setLoading(false);
    }

    loadSubjects();
  }, []);

  if (!profile) return null;

  const levelInfo = calculateLevel(profile.points);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Boas-vindas */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        {/* Decoração */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute right-20 bottom-0 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">{greeting()},</p>
          <h1 className="text-2xl font-bold mb-4">{profile.name.split(" ")[0]}! 👋</h1>

          {/* Card de nível */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 max-w-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Nível {profile.level} · {levelInfo.label}</span>
              <span className="text-xs text-white/70">{profile.points} XP total</span>
            </div>
            <XPProgressBar points={profile.points} compact showLabel={false} />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label="Nível atual" value={profile.level} color="bg-yellow-500/10 text-yellow-400" />
        <StatCard icon={Flame} label="Pontos XP" value={profile.points} color="bg-orange-500/10 text-orange-400" />
        <StatCard icon={BookOpen} label="Matérias" value={subjects.length} color="bg-blue-500/10 text-blue-400" />
        <StatCard icon={TrendingUp} label="Progresso" value="Em breve" color="bg-green-500/10 text-green-400" />
      </div>

      {/* Matérias disponíveis */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground font-heading">Matérias</h2>
          <span className="text-sm text-muted-foreground">{subjects.length} disponíveis</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma matéria disponível ainda.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Em breve novos conteúdos serão adicionados!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, i) => (
              <SubjectCard key={subject.id} subject={subject} index={i} topicsCount={subject.topicsCount} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
