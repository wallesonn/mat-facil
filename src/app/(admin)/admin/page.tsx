"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, BookMarked, FileText, Users, ArrowRight } from "lucide-react";
import { getSubjects, getTopicsBySubject, getLessonsByTopic } from "@/services/subjects";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ subjects: 0, topics: 0, lessons: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const subjects = await getSubjects();
      let topicsCount = 0;
      let lessonsCount = 0;

      for (const subject of subjects) {
        const topics = await getTopicsBySubject(subject.id);
        topicsCount += topics.length;
        for (const topic of topics) {
          const lessons = await getLessonsByTopic(topic.id, false);
          lessonsCount += lessons.length;
        }
      }

      setStats({ subjects: subjects.length, topics: topicsCount, lessons: lessonsCount });
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    {
      href: "/admin/subjects",
      icon: BookOpen,
      label: "Matérias",
      value: stats.subjects,
      color: "from-blue-500 to-blue-600",
      light: "bg-blue-500/10 text-blue-400",
      desc: "Gerenciar matérias da plataforma",
    },
    {
      href: "/admin/topics",
      icon: BookMarked,
      label: "Assuntos",
      value: stats.topics,
      color: "from-purple-500 to-purple-600",
      light: "bg-purple-500/10 text-purple-400",
      desc: "Gerenciar assuntos por matéria",
    },
    {
      href: "/admin/lessons",
      icon: FileText,
      label: "Aulas",
      value: stats.lessons,
      color: "from-green-500 to-emerald-600",
      light: "bg-green-500/10 text-green-400",
      desc: "Criar e publicar aulas",
    },
    {
      href: "#",
      icon: Users,
      label: "Alunos",
      value: "—",
      color: "from-orange-500 to-orange-600",
      light: "bg-orange-500/10 text-orange-400",
      desc: "Em breve",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground font-heading">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-1">Gerencie todo o conteúdo da plataforma MAT Fácil</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link href={card.href} className="block group">
                <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:shadow-black/20 transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.light}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className={`text-3xl font-black mb-1 ${loading ? "animate-pulse" : ""}`}>
                    {loading ? "—" : card.value}
                  </div>
                  <p className="font-semibold text-foreground text-sm">{card.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Acesso rápido */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-foreground mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/admin/subjects", label: "+ Nova matéria", color: "bg-blue-600 hover:bg-blue-700 text-white" },
            { href: "/admin/topics",   label: "+ Novo assunto",  color: "bg-purple-600 hover:bg-purple-700 text-white" },
            { href: "/admin/lessons",  label: "+ Nova aula",     color: "bg-green-600 hover:bg-green-700 text-white" },
          ].map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className={`flex items-center justify-center py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${btn.color}`}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
