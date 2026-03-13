"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Zap, Star, ArrowRight,
  CheckCircle2, Brain, BarChart3, Users,
} from "lucide-react";
import { APP_META } from "@/lib/constants";

const features = [
  { icon: BookOpen, title: "Conteúdo Estruturado", desc: "Matérias e assuntos organizados de forma progressiva", color: "bg-blue-500/10 text-blue-400" },
  { icon: Zap,      title: "Aprendizado Interativo", desc: "Exercícios dinâmicos e explicações passo a passo", color: "bg-yellow-500/10 text-yellow-400" },
  { icon: Trophy,   title: "Gamificação",             desc: "Ganhe XP, suba de nível e acompanhe seu progresso", color: "bg-purple-500/10 text-purple-400" },
  { icon: Brain,    title: "IA Tutora",               desc: "Em breve: tutor inteligente para tirar dúvidas", color: "bg-green-500/10 text-green-400" },
  { icon: BarChart3,title: "Acompanhamento",          desc: "Veja seu progresso e evolução em cada matéria", color: "bg-orange-500/10 text-orange-400" },
  { icon: Users,    title: "Para o SESI",             desc: "Plataforma desenvolvida especialmente para alunos SESI", color: "bg-pink-500/10 text-pink-400" },
];

const levels = [
  { level: 1, label: "Iniciante",  color: "bg-gray-400" },
  { level: 3, label: "Aprendiz",   color: "bg-blue-500" },
  { level: 5, label: "Dedicado",   color: "bg-purple-500" },
  { level: 8, label: "Mestre",     color: "bg-yellow-500" },
  { level: 10, label: "Lendário",  color: "bg-orange-500" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="font-bold text-lg text-foreground font-heading">{APP_META.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Entrar
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20">
              Criar conta grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white overflow-hidden">
        {/* Decorações de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          {[
            { x: 5, y: 12, d: 3.2, dl: 0.1 }, { x: 15, y: 68, d: 4.1, dl: 1.3 },
            { x: 25, y: 34, d: 5.0, dl: 0.7 }, { x: 35, y: 82, d: 3.8, dl: 2.1 },
            { x: 45, y: 21, d: 4.5, dl: 0.4 }, { x: 55, y: 55, d: 3.4, dl: 1.8 },
            { x: 65, y: 78, d: 5.2, dl: 0.9 }, { x: 72, y: 15, d: 4.0, dl: 2.5 },
            { x: 82, y: 42, d: 3.6, dl: 1.1 }, { x: 92, y: 60, d: 4.8, dl: 0.3 },
            { x: 10, y: 90, d: 5.5, dl: 1.6 }, { x: 30, y: 8, d: 3.1, dl: 2.8 },
            { x: 48, y: 45, d: 4.3, dl: 0.6 }, { x: 60, y: 92, d: 3.9, dl: 1.4 },
            { x: 78, y: 30, d: 5.1, dl: 2.0 }, { x: 88, y: 85, d: 4.6, dl: 0.8 },
            { x: 20, y: 50, d: 3.3, dl: 2.3 }, { x: 40, y: 70, d: 4.2, dl: 1.0 },
            { x: 68, y: 5, d: 5.3, dl: 0.2 },  { x: 95, y: 25, d: 3.7, dl: 1.7 },
          ].map((s, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: s.d, repeat: Infinity, delay: s.dl }}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white/90 mb-6"
          >
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            Plataforma oficial SESI de aprendizado de matemática
          </motion.div>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight"
          >
            Matemática{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              ficou fácil!
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto mb-10"
          >
            Aprenda matemática de forma divertida e interativa. Ganhe pontos, suba de nível e conquiste o conhecimento!
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/register" className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-yellow-500/30 hover:opacity-90 transition-all hover:scale-105 text-lg">
              Começar agora — grátis!
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all text-lg">
              Já tenho conta
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 mt-16 flex-wrap"
          >
            {[
              { value: "10", label: "Níveis" },
              { value: "∞", label: "Conteúdos" },
              { value: "100%", label: "Gratuito" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-24 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3 font-heading">
              Tudo que você precisa para aprender
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Uma plataforma completa pensada para tornar o aprendizado de matemática envolvente e eficaz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-background rounded-2xl p-6 border border-border hover:shadow-lg hover:shadow-black/20 transition-shadow group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GAMIFICAÇÃO ──────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 text-sm font-semibold text-yellow-400 mb-4">
                <Trophy className="w-4 h-4" /> Sistema de Gamificação
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4 font-heading">
                Aprenda e{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  evolua de nível
                </span>
              </h2>
              <p className="text-muted-foreground mb-6">
                A cada aula concluída você ganha XP. Acumule pontos, suba de nível e veja seu progresso crescer!
              </p>
              <ul className="space-y-3">
                {[
                  { icon: "✅", text: "+10 XP por aula concluída" },
                  { icon: "🎯", text: "+20 XP bônus ao completar um assunto" },
                  { icon: "🏆", text: "10 níveis de progressão, do Iniciante ao Lendário" },
                  { icon: "📊", text: "Acompanhe sua barra de progresso em tempo real" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-base">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 text-white"
            >
              <p className="text-white/60 text-sm mb-4">Progressão de níveis</p>
              <div className="space-y-3">
                {levels.map((lvl, i) => (
                  <div key={lvl.level} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white ${lvl.color}`}>
                      {lvl.level}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{lvl.label}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(i + 1) * 20}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`h-full rounded-full ${lvl.color}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* XP badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-4 py-2 text-yellow-400 font-bold text-sm"
              >
                <Zap className="w-4 h-4 fill-yellow-400" />
                +10 XP ganhos!
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Pronto para dominar a matemática?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Crie sua conta agora e comece sua jornada. É completamente gratuito!
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-blue-500/30 hover:opacity-90 transition-colors text-lg"
              >
                Criar conta grátis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/25 transition-colors text-lg"
              >
                Já tenho conta
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
              {["Grátis para sempre", "Sem cartão de crédito", "Acesso imediato"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white/40 py-8 text-center text-sm">
        <p>© 2026 {APP_META.name} · Desenvolvido para o SESI</p>
      </footer>
    </div>
  );
}
