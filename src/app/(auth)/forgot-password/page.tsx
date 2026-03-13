"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      setSent(true);
    } else {
      toast.error(result.error ?? "Erro ao enviar email.");
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        {sent ? (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </motion.div>
            <h2 className="text-xl font-bold text-white mb-2">Email enviado!</h2>
            <p className="text-white/60 text-sm mb-6">
              Verifique sua caixa de entrada em <span className="text-white/90 font-medium">{email}</span> e siga as instruções para redefinir sua senha.
            </p>
            <Link href="/login">
              <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-600 shadow-lg mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Recuperar senha</h1>
              <p className="text-white/60 text-sm">Enviaremos um link de redefinição para o seu email</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/80 text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-blue-400"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold h-11 rounded-xl"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Enviando...</> : "Enviar link"}
              </Button>
            </form>

            <p className="text-center text-white/50 text-sm mt-6">
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center justify-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
              </Link>
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
