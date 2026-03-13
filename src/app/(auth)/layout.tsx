import Link from "next/link";
import { APP_META } from "@/lib/constants";

// Layout compartilhado pelas páginas de autenticação (login, cadastro, recuperação)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
      {/* Círculos decorativos de fundo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      {/* Header com logo */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-base">M</span>
          </div>
          <span className="font-bold text-white text-lg">{APP_META.name}</span>
        </Link>
      </header>

      {/* Conteúdo centralizado */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Rodapé */}
      <footer className="relative z-10 text-center py-4 text-white/30 text-xs">
        © 2026 {APP_META.name} · SESI
      </footer>
    </div>
  );
}
