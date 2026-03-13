"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubjectCard } from "@/components/shared/SubjectCard";
import { getSubjects } from "@/services/subjects";
import type { Subject } from "@/types";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filtered, setFiltered] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubjects().then((data) => {
      setSubjects(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(subjects.filter((s) => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)));
  }, [search, subjects]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground font-heading">Matérias</h1>
        <p className="text-muted-foreground mt-1">Escolha uma matéria para começar a estudar</p>
      </motion.div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar matéria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid de matérias */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <BookOpen className="w-14 h-14 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {search ? "Nenhuma matéria encontrada." : "Nenhuma matéria disponível ainda."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((subject, i) => (
            <SubjectCard key={subject.id} subject={subject} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
