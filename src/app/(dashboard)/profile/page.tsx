"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, GraduationCap, Lock, Save, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XPProgressBar } from "@/components/ui/xp-progress-bar";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/services/auth";
import { createClient } from "@/lib/supabase/client";
import { GRADES } from "@/types";

export default function ProfilePage() {
  const { profile, loading } = useAuth();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Sync state with profile on load
  const [initialized, setInitialized] = useState(false);
  if (profile && !initialized) {
    setName(profile.name);
    setGrade(profile.grade ?? "");
    setInitialized(true);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    if (!name.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }
    setSaving(true);
    const result = await updateProfile(profile.id, {
      name: name.trim(),
      grade: grade || null,
    });
    if (result.success) {
      toast.success("Perfil atualizado!");
    } else {
      toast.error(result.error ?? "Erro ao atualizar.");
    }
    setSaving(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground font-heading">Meu Perfil</h1>

      {/* Card do perfil */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16 border-2 border-purple-500/30">
            <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.name} />
            <AvatarFallback className="bg-purple-500/10 text-purple-400 font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-lg">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              {profile.grade && (
                <span className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">
                  <GraduationCap className="w-3 h-3" />
                  {profile.grade}
                </span>
              )}
              <span>Nível {profile.level}</span>
              <span>{profile.points} XP</span>
            </div>
          </div>
        </div>
        <XPProgressBar points={profile.points} />
      </motion.div>

      {/* Formulário de edição */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-foreground font-heading mb-4">Informações pessoais</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pname">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="pname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                placeholder="Seu nome"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profile.email}
                disabled
                className="pl-10 opacity-60 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pgrade">Série</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                id="pgrade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-transparent border border-border text-foreground rounded-md text-sm focus:border-primary focus:outline-none appearance-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
              >
                <option value="">Não informada</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar alterações
          </Button>
        </form>
      </motion.div>

      {/* Alterar senha */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-foreground font-heading mb-4">Alterar senha</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="newpw">Nova senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="newpw"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmpw">Confirmar nova senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmpw"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                placeholder="Repita a nova senha"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={savingPassword}
            variant="outline"
            className="gap-2"
          >
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Alterar senha
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
