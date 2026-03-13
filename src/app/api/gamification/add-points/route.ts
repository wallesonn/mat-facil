import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addPoints } from "@/services/gamification";

// POST /api/gamification/add-points
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { userId, amount, reason } = await request.json();

  // Só o próprio usuário pode adicionar pontos a si mesmo, ou um admin a qualquer usuário
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (userId !== user.id && profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const result = await addPoints(userId, amount, reason);
  if (!result.success) return NextResponse.json({ error: "Erro ao adicionar pontos." }, { status: 500 });
  return NextResponse.json({ success: true, newPoints: result.newPoints, newLevel: result.newLevel, leveledUp: result.leveledUp });
}
