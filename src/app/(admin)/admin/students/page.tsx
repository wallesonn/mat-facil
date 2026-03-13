"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, GraduationCap, Trophy, Flame, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { GRADES } from "@/types";
import type { Profile } from "@/types";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGrade, setFilterGrade] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("points", { ascending: false });
      setStudents(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = students.filter((s) => {
    if (filterGrade !== "all" && s.grade !== filterGrade) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const gradeStats = GRADES.map((g) => ({
    grade: g,
    count: students.filter((s) => s.grade === g).length,
  }));
  const noGradeCount = students.filter((s) => !s.grade).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Alunos</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{students.length} aluno(s) cadastrado(s)</p>
      </div>

      {/* Stats por série */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        {gradeStats.filter((g) => g.count > 0).map((g) => (
          <button
            key={g.grade}
            onClick={() => setFilterGrade(filterGrade === g.grade ? "all" : g.grade)}
            className={`p-3 rounded-2xl border text-left transition-colors ${
              filterGrade === g.grade
                ? "bg-purple-500/15 border-purple-500/30"
                : "bg-card border-border hover:border-purple-500/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-foreground">{g.grade}</span>
            </div>
            <p className="text-xs text-muted-foreground">{g.count} aluno(s)</p>
          </button>
        ))}
        {noGradeCount > 0 && (
          <button
            onClick={() => setFilterGrade(filterGrade === "none" ? "all" : "none")}
            className={`p-3 rounded-2xl border text-left transition-colors ${
              filterGrade === "none"
                ? "bg-muted border-border"
                : "bg-card border-border hover:border-muted-foreground/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">Sem série</span>
            </div>
            <p className="text-xs text-muted-foreground">{noGradeCount} aluno(s)</p>
          </button>
        )}
      </div>

      {/* Filtro por série (todos) + busca */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setFilterGrade("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filterGrade === "all"
              ? "bg-purple-600 text-white"
              : "bg-card border border-border text-muted-foreground hover:border-purple-500/30 hover:text-purple-400"
          }`}
        >
          Todas as séries
        </button>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 bg-card rounded-2xl border border-border">
          <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Nenhum aluno encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((student, i) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-400">
                    {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm">{student.name}</p>
                    {student.grade && (
                      <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/20">
                        {student.grade}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-yellow-400" title="Nível">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="font-bold">{student.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-400" title="XP">
                    <Flame className="w-3.5 h-3.5" />
                    <span className="font-bold">{student.points}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
