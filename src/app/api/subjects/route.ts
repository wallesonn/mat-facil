import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/subjects — lista todas as matérias
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("subjects").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/subjects — cria uma nova matéria (admin)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

  const body = await request.json();
  const { data, error } = await supabase.from("subjects").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
