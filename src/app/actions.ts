"use server";

import { google } from "googleapis";
import type { CourseId } from "@/lib/data";

export type EnrollState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const REQUIRED_FIELDS = ["name", "whatsapp", "email", "course"] as const;

export async function submitEnrollment(
  _prev: EnrollState,
  formData: FormData,
): Promise<EnrollState> {
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

    const sheetId =
      data.course === "unifor"
        ? process.env.SHEETS_UNIFOR_ID
        : process.env.SHEETS_CLINICARE_ID;

    if (!sheetId || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error("Google Sheets env vars missing", { course: data.course });
      return { status: "error", message: "Inscrição indisponível no momento. Tente novamente em instantes." };
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
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

    return {
      status: "success",
      message: "Inscrição recebida. Nossa equipe entrará em contato em breve com os valores e detalhes.",
    };
  } catch (err) {
    console.error("submitEnrollment failed", err);
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente." };
  }
}
