"use server";

import { connection } from "next/server";
import { google } from "googleapis";
import { courses, type CourseId } from "@/lib/data";

export type EnrollState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const REQUIRED_FIELDS = ["name", "whatsapp", "email", "course"] as const;

type SupabaseEnrollmentRow = {
  form_type: "inscricao_clinicare" | "inscricao_unifor";
  course_id: CourseId;
  course_nome: string;
  course_turma?: string | null;
  nome: string;
  whatsapp: string;
  email: string;
  ja_formado: boolean;
  numero_conselho?: string | null;
  previsao_formatura?: string | null;
  origem: string;
  enviado_em: string;
};

function getSupabaseConfig(): { restUrl: string; apiKey: string } | null {
  const apiKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const restUrlRaw =
    process.env.SUPABASE_REST_URL ??
    (process.env.SUPABASE_URL
      ? `${process.env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1`
      : process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/rest/v1`
        : undefined);

  if (!apiKey || !restUrlRaw) return null;
  return { restUrl: restUrlRaw.replace(/\/$/, ""), apiKey };
}

async function insertEnrollmentIntoSupabase(row: SupabaseEnrollmentRow): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    throw new Error("Supabase env vars missing");
  }

  const res = await fetch(`${cfg.restUrl}/enrollments`, {
    method: "POST",
    headers: {
      apikey: cfg.apiKey,
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase insert failed (${res.status}): ${text}`);
  }
}

export async function submitEnrollment(
  _prev: EnrollState,
  formData: FormData,
): Promise<EnrollState> {
  await connection();
  try {
    const data = {
      name: String(formData.get("name") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      formed: String(formData.get("formed") ?? "").trim(), // "sim" | "nao"
      council: String(formData.get("council") ?? "").trim(),
      expectedCroDate: String(formData.get("expectedCroDate") ?? "").trim(),
      course: String(formData.get("course") ?? "").trim() as CourseId,
      source: "cursos.anbro.com.br",
      submittedAt: new Date().toISOString(),
    };

    for (const field of REQUIRED_FIELDS) {
      if (!data[field as keyof typeof data]) {
        return { status: "error", message: `Campo obrigatório: ${field}` };
      }
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      return { status: "error", message: "E-mail inválido" };
    }

    if (data.course !== "clinicare" && data.course !== "unifor") {
      return { status: "error", message: "Curso inválido" };
    }
    if (data.formed !== "sim" && data.formed !== "nao") {
      return { status: "error", message: "Informe se já é formado" };
    }

    const jaFormado = data.formed === "sim";
    if (jaFormado && !data.council) {
      return { status: "error", message: "Informe o número do conselho" };
    }
    if (!jaFormado && !data.expectedCroDate) {
      return { status: "error", message: "Informe a previsão de formatura" };
    }

    const courseInfo = courses.find((c) => c.id === data.course);
    const supabaseRow: SupabaseEnrollmentRow = {
      form_type: data.course === "unifor" ? "inscricao_unifor" : "inscricao_clinicare",
      course_id: data.course,
      course_nome: courseInfo?.title ?? data.course,
      course_turma: courseInfo?.startDate ?? null,
      nome: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      ja_formado: jaFormado,
      numero_conselho: jaFormado ? data.council : null,
      previsao_formatura: jaFormado ? null : data.expectedCroDate,
      origem: data.source,
      enviado_em: data.submittedAt,
    };

    const supabaseConfigured = !!getSupabaseConfig();
    const sheetsConfigured =
      !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      !!process.env.GOOGLE_PRIVATE_KEY &&
      !!(data.course === "unifor" ? process.env.SHEETS_UNIFOR_ID : process.env.SHEETS_CLINICARE_ID);

    let savedSomewhere = false;
    const failures: Array<{ target: string; error: unknown }> = [];

    if (supabaseConfigured) {
      try {
        await insertEnrollmentIntoSupabase(supabaseRow);
        savedSomewhere = true;
      } catch (err) {
        failures.push({ target: "supabase", error: err });
      }
    }

    if (sheetsConfigured) {
      try {
        const sheetId =
          data.course === "unifor"
            ? process.env.SHEETS_UNIFOR_ID
            : process.env.SHEETS_CLINICARE_ID;

        const auth = new google.auth.JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "Inscrições!A:I",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[
              data.submittedAt,
              data.name,
              data.whatsapp,
              data.email,
              data.formed,
              data.council,
              data.expectedCroDate,
              data.course,
              data.source,
            ]],
          },
        });

        savedSomewhere = true;
      } catch (err) {
        failures.push({ target: "google_sheets", error: err });
      }
    }

    if (!savedSomewhere) {
      console.error("Enrollment persistence failed", {
        course: data.course,
        supabaseConfigured,
        sheetsConfigured,
        failures,
      });

      return {
        status: "error",
        message: "Inscrição indisponível no momento. Tente novamente em instantes.",
      };
    }

    return {
      status: "success",
      message: "Inscrição recebida. Nossa equipe entrará em contato em breve com os valores e detalhes.",
    };
  } catch (err) {
    console.error("submitEnrollment failed", err);
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente." };
  }
}
