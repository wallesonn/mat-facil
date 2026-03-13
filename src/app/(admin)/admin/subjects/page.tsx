"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, BookOpen, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "@/services/subjects";
import type { Subject, CreateSubjectInput } from "@/types";

const emptyForm: CreateSubjectInput = { name: "", description: "" };

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState<CreateSubjectInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const data = await getSubjects();
    setSubjects(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(s: Subject) { setEditing(s); setForm({ name: s.name, description: s.description ?? "" }); setDialogOpen(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Nome é obrigatório."); return; }
    setSaving(true);
    const result = editing
      ? await updateSubject(editing.id, form)
      : await createSubject(form);
    if (result.success) {
      toast.success(editing ? "Matéria atualizada!" : "Matéria criada!");
      setDialogOpen(false);
      load();
    } else {
      toast.error(result.error ?? "Erro ao salvar.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta matéria? Todos os assuntos e aulas relacionados também serão excluídos.")) return;
    setDeleting(id);
    const result = await deleteSubject(id);
    if (result.success) { toast.success("Matéria excluída."); load(); }
    else toast.error(result.error ?? "Erro ao excluir.");
    setDeleting(null);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Matérias</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{subjects.length} matéria(s) cadastrada(s)</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Nova matéria
        </Button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Nenhuma matéria cadastrada ainda.</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
            <Plus className="w-4 h-4" /> Criar primeira matéria
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {subjects.map((subject, i) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{subject.name}</p>
                  {subject.description && (
                    <p className="text-xs text-muted-foreground truncate">{subject.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(subject)} className="w-8 h-8 text-muted-foreground hover:text-blue-600">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(subject.id)}
                    disabled={deleting === subject.id}
                    className="w-8 h-8 text-muted-foreground hover:text-red-600"
                  >
                    {deleting === subject.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dialog de criação/edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar matéria" : "Nova matéria"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Ex: Álgebra, Geometria..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Descrição</Label>
              <Input
                id="desc"
                placeholder="Breve descrição da matéria"
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                <X className="w-4 h-4 mr-1" /> Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
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
