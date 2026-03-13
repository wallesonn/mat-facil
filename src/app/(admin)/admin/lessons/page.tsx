"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, FileText, Loader2, X, Check, Eye } from "lucide-react";
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
import {
  getSubjects,
  getTopicsBySubject,
  getLessonsByTopic,
  createLesson,
  updateLesson,
  deleteLesson,
  publishLesson,
} from "@/services/subjects";
import { LESSON_STATUS_CONFIG } from "@/lib/constants";
import type { Subject, Topic, Lesson, CreateLessonInput, LessonStatus } from "@/types";

const emptyForm: CreateLessonInput = { topic_id: "", title: "", status: "draft", order: 1 };

export default function AdminLessonsPage() {
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [topics, setTopics]       = useState<Topic[]>([]);
  const [lessons, setLessons]     = useState<(Lesson & { topic?: Topic })[]>([]);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterTopic,   setFilterTopic]   = useState("all");
  const [loading,   setLoading]   = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing,  setEditing]    = useState<Lesson | null>(null);
  const [form,     setForm]       = useState<CreateLessonInput>(emptyForm);
  const [saving,   setSaving]     = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);

  async function loadAll() {
    const subs = await getSubjects();
    setSubjects(subs);
    const allTopics: Topic[] = [];
    const allLessons: (Lesson & { topic?: Topic })[] = [];

    for (const s of subs) {
      const tops = await getTopicsBySubject(s.id);
      allTopics.push(...tops.map((t) => ({ ...t, subject: s })));
      for (const t of tops) {
        const lessonList = await getLessonsByTopic(t.id, false);
        allLessons.push(...lessonList.map((l) => ({ ...l, topic: { ...t, subject: s } })));
      }
    }

    setTopics(allTopics);
    setLessons(allLessons);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const filteredTopics = filterSubject === "all" ? topics : topics.filter((t) => t.subject_id === filterSubject);
  const filtered = lessons.filter((l) => {
    if (filterSubject !== "all" && l.topic?.subject_id !== filterSubject) return false;
    if (filterTopic   !== "all" && l.topic_id !== filterTopic)           return false;
    return true;
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, topic_id: filterTopic !== "all" ? filterTopic : "" });
    setDialogOpen(true);
  }
  function openEdit(l: Lesson) {
    setEditing(l);
    setForm({ topic_id: l.topic_id, title: l.title, status: l.status, order: l.order });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Título obrigatório."); return; }
    if (!form.topic_id)     { toast.error("Selecione um assunto."); return; }
    setSaving(true);
    const result = editing
      ? await updateLesson(editing.id, form)
      : await createLesson(form);
    if (result.success) { toast.success(editing ? "Aula atualizada!" : "Aula criada!"); setDialogOpen(false); loadAll(); }
    else toast.error(result.error ?? "Erro ao salvar.");
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta aula?")) return;
    setDeleting(id);
    const result = await deleteLesson(id);
    if (result.success) { toast.success("Aula excluída."); loadAll(); }
    else toast.error(result.error ?? "Erro ao excluir.");
    setDeleting(null);
  }

  async function handlePublish(id: string) {
    const result = await publishLesson(id);
    if (result.success) { toast.success("Aula publicada! 🎉"); loadAll(); }
    else toast.error(result.error ?? "Erro ao publicar.");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Aulas</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{lessons.length} aula(s) cadastrada(s)</p>
        </div>
        <Button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Nova aula
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap bg-card border border-border rounded-2xl p-3">
        <div className="flex-1 min-w-[160px]">
          <Select value={filterSubject} onValueChange={(v) => { setFilterSubject(v ?? "all"); setFilterTopic("all"); }}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Todas as matérias" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as matérias</SelectItem>
              {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <Select value={filterTopic} onValueChange={(v) => setFilterTopic(v ?? "all")}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Todos os assuntos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os assuntos</SelectItem>
              {filteredTopics.map((t) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 bg-card rounded-2xl border border-border">
          <FileText className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Nenhuma aula encontrada.</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2"><Plus className="w-4 h-4" />Criar aula</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((lesson, i) => {
              const statusCfg = LESSON_STATUS_CONFIG[lesson.status];
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow"
                >
                  <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-green-400">
                    {lesson.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-sm">{lesson.title}</p>
                      <Badge variant="outline" className={`text-xs ${statusCfg.color}`}>{statusCfg.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lesson.topic?.subject?.name ?? "—"} · {lesson.topic?.title ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {lesson.status === "draft" && (
                      <Button variant="ghost" size="icon" onClick={() => handlePublish(lesson.id)} className="w-8 h-8 text-muted-foreground hover:text-green-600" title="Publicar">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => openEdit(lesson)} className="w-8 h-8 text-muted-foreground hover:text-blue-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(lesson.id)} disabled={deleting === lesson.id} className="w-8 h-8 text-muted-foreground hover:text-red-600">
                      {deleting === lesson.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar aula" : "Nova aula"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Assunto *</Label>
              <Select value={form.topic_id} onValueChange={(v) => setForm({ ...form, topic_id: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Selecione o assunto" /></SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.subject?.name ? `${t.subject.name} › ` : ""}{t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ltitle">Título *</Label>
              <Input id="ltitle" placeholder="Título da aula" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v as LessonStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lordex">Ordem</Label>
                <Input id="lordex" type="number" min={1} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}><X className="w-4 h-4 mr-1" />Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
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
