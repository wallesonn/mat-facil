"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, BookMarked, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubjects, getTopicsBySubject, createTopic, updateTopic, deleteTopic } from "@/services/subjects";
import { DIFFICULTY_CONFIG } from "@/lib/constants";
import type { Subject, Topic, CreateTopicInput, Difficulty } from "@/types";
import { GRADES } from "@/types";

const emptyForm: CreateTopicInput = { subject_id: "", title: "", description: "", difficulty: "easy", grade: "", order: 1 };

export default function AdminTopicsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [form, setForm] = useState<CreateTopicInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadAll() {
    const subs = await getSubjects();
    setSubjects(subs);
    const all: Topic[] = [];
    for (const s of subs) {
      const tops = await getTopicsBySubject(s.id);
      all.push(...tops.map((t) => ({ ...t, subject: s })));
    }
    setTopics(all);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const filtered = topics.filter((t) => {
    if (selectedSubject !== "all" && t.subject_id !== selectedSubject) return false;
    if (filterGrade !== "all" && (t.grade ?? "") !== filterGrade) return false;
    return true;
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, subject_id: selectedSubject !== "all" ? selectedSubject : "" });
    setDialogOpen(true);
  }
  function openEdit(t: Topic) {
    setEditing(t);
    setForm({ subject_id: t.subject_id, title: t.title, description: t.description ?? "", difficulty: t.difficulty, grade: t.grade ?? "", order: t.order });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Título é obrigatório."); return; }
    if (!form.subject_id) { toast.error("Selecione uma matéria."); return; }
    setSaving(true);
    const result = editing
      ? await updateTopic(editing.id, form)
      : await createTopic(form);
    if (result.success) {
      toast.success(editing ? "Assunto atualizado!" : "Assunto criado!");
      setDialogOpen(false);
      loadAll();
    } else {
      toast.error(result.error ?? "Erro ao salvar.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este assunto? Todas as aulas relacionadas também serão excluídas.")) return;
    setDeleting(id);
    const result = await deleteTopic(id);
    if (result.success) { toast.success("Assunto excluído."); loadAll(); }
    else toast.error(result.error ?? "Erro ao excluir.");
    setDeleting(null);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Assuntos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{topics.length} assunto(s) cadastrado(s)</p>
        </div>
        <Button onClick={openCreate} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Novo assunto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 flex-wrap">
        {[{ id: "all", name: "Todas as matérias" }, ...subjects].map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedSubject === s.id
                ? "bg-purple-600 text-white"
                : "bg-card border border-border text-muted-foreground hover:border-purple-500/30 hover:text-purple-400"
            }`}
          >
            {s.name}
          </button>
        ))}
        <span className="text-muted-foreground/40">|</span>
        {[{ id: "all", label: "Todas as séries" }, ...GRADES.map((g) => ({ id: g, label: g }))].map((g) => (
          <button
            key={g.id}
            onClick={() => setFilterGrade(g.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterGrade === g.id
                ? "bg-indigo-600 text-white"
                : "bg-card border border-border text-muted-foreground hover:border-indigo-500/30 hover:text-indigo-400"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 bg-card rounded-2xl border border-border">
          <BookMarked className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Nenhum assunto encontrado.</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
            <Plus className="w-4 h-4" /> Criar primeiro assunto
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((topic, i) => {
              const diff = DIFFICULTY_CONFIG[topic.difficulty];
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow"
                >
                  <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-purple-400">
                    {topic.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-sm">{topic.title}</p>
                      <Badge variant="outline" className={`text-xs ${diff.color}`}>{diff.label}</Badge>
                      {topic.grade && <Badge variant="outline" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/20">{topic.grade}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {topic.subject?.name ?? "—"}
                      {topic.description && ` · ${topic.description}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(topic)} className="w-8 h-8 text-muted-foreground hover:text-purple-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)} disabled={deleting === topic.id} className="w-8 h-8 text-muted-foreground hover:text-red-600">
                      {deleting === topic.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar assunto" : "Novo assunto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Matéria *</Label>
              <Select value={form.subject_id} onValueChange={(v) => setForm({ ...form, subject_id: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Selecione a matéria" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" placeholder="Ex: Equações do 2º grau" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tdesc">Descrição</Label>
              <Input id="tdesc" placeholder="Breve descrição" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Série</Label>
              <Select value={form.grade ?? ""} onValueChange={(v) => setForm({ ...form, grade: v || "" })}>
                <SelectTrigger><SelectValue placeholder="Selecione a série" /></SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Dificuldade</Label>
                <Select value={form.difficulty} onValueChange={(v) => v && setForm({ ...form, difficulty: v as Difficulty })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="order">Ordem</Label>
                <Input id="order" type="number" min={1} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}><X className="w-4 h-4 mr-1" />Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                {editing ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
