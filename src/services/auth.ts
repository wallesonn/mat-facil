// ============================================================
// SERVIÇO DE AUTENTICAÇÃO — Supabase Auth
// ============================================================

import { createClient } from "@/lib/supabase/client";
import type { LoginFormData, RegisterFormData, ApiResponse, Profile } from "@/types";

/**
 * Realiza o login com email e senha.
 */
export async function signIn(data: LoginFormData): Promise<ApiResponse<Profile>> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { data: null, error: translateAuthError(error.message), success: false };
  }

  const profile = await getCurrentProfile();
  return { data: profile, error: null, success: true };
}

/**
 * Cadastra um novo usuário com email e senha.
 * Cria automaticamente um perfil na tabela profiles.
 */
export async function signUp(data: RegisterFormData): Promise<ApiResponse<null>> {
  if (data.password !== data.confirmPassword) {
    return { data: null, error: "As senhas não coincidem.", success: false };
  }

  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { name: data.name },
    },
  });

  if (error) {
    return { data: null, error: translateAuthError(error.message), success: false };
  }

  // Cria o perfil do usuário (o trigger do Supabase pode fazer isso automaticamente)
  if (authData.user) {
    await supabase.from("profiles").upsert({
      id: authData.user.id,
      name: data.name,
      email: data.email,
      role: "student",
      points: 0,
      level: 1,
    });
  }

  return { data: null, error: null, success: true };
}

/**
 * Realiza o logout.
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/**
 * Envia email de recuperação de senha.
 */
export async function resetPassword(email: string): Promise<ApiResponse<null>> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    return { data: null, error: translateAuthError(error.message), success: false };
  }

  return { data: null, error: null, success: true };
}

/**
 * Retorna o perfil do usuário autenticado atualmente.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data ?? null;
}

/**
 * Atualiza o perfil do usuário.
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "name" | "avatar_url">>
): Promise<ApiResponse<Profile>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message, success: false };
  }

  return { data, error: null, success: true };
}

/**
 * Traduz mensagens de erro do Supabase Auth para português.
 */
function translateAuthError(message: string): string {
  const translations: Record<string, string> = {
    "Invalid login credentials": "Email ou senha inválidos.",
    "Email not confirmed": "Confirme seu email antes de fazer login.",
    "User already registered": "Este email já está cadastrado.",
    "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres.",
    "Unable to validate email address: invalid format": "Formato de email inválido.",
    "signup is not enabled": "Cadastro desabilitado. Entre em contato com o suporte.",
  };

  return translations[message] ?? message;
}
