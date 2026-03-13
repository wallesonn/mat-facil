"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2, UserPlus, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/services/auth";
import { GRADES } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", grade: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const result = await signUp(form);
    if (result.success) {
      toast.success("Conta criada! Verifique seu email para confirmar o cadastro. 📧");
      router.push("/login");
    } else {
      toast.error(result.error ?? "Erro ao criar conta.");
      setLoading(false);
    }
  }

  const field = (id: keyof typeof form, label: string, type: string, placeholder: string, icon: React.ReactNode, extra?: React.ReactNode) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-white/80 text-sm font-medium">{label}</Label>
        {extra}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</span>
        <Input
          id={id}
          type={id.includes("password") ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={form[id]}
          onChange={(e) => setForm({ ...form, [id]: e.target.value })}
          required
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-blue-400"
        />
        {id === "password" && (
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Criar conta grátis</h1>
          <p className="text-white/60 text-sm">Comece sua jornada na matemática agora!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field("name", "Nome completo", "text", "Seu nome", <User className="w-4 h-4" />)}
          {field("email", "Email", "email", "seu@email.com", <Mail className="w-4 h-4" />)}

          {/* Série */}
          <div className="space-y-1.5">
            <Label htmlFor="grade" className="text-white/80 text-sm font-medium">Série</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><GraduationCap className="w-4 h-4" /></span>
              <select
                id="grade"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                required
                className="w-full h-10 pl-10 pr-3 bg-white/10 border border-white/20 text-white rounded-md text-sm focus:border-blue-400 focus:outline-none appearance-none cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option value="" disabled>Selecione sua série</option>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {field("password", "Senha", "password", "Mínimo 6 caracteres", <Lock className="w-4 h-4" />)}
          {field("confirmPassword", "Confirmar senha", "password", "Repita a senha", <Lock className="w-4 h-4" />)}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold h-11 rounded-xl shadow-lg shadow-blue-500/25 mt-2 transition-all duration-200"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Criando conta...</>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
