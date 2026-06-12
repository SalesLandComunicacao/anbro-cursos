"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { CourseId } from "@/lib/data";
import { submitEnrollment, type EnrollState } from "@/app/actions";
import { track, trackCustom } from "@/lib/fpixel";

const initialState: EnrollState = { status: "idle" };

type Props = {
  open: boolean;
  onClose: () => void;
  course: CourseId;
  courseTitle: string;
};

export function EnrollDialog({ open, onClose, course, courseTitle }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, pending] = useActionState(submitEnrollment, initialState);
  const [formed, setFormed] = useState<"sim" | "nao" | "">("");
  const leadFired = useRef(false);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      trackCustom("AbriuFormulario", { course, course_title: courseTitle });
    }
    if (!open && d.open) d.close();
  }, [open, course, courseTitle]);

  useEffect(() => {
    if (state.status === "success") {
      if (!leadFired.current) {
        track("Lead", { content_name: courseTitle, course });
        leadFired.current = true;
      }
      const t = setTimeout(() => onClose(), 3500);
      return () => clearTimeout(t);
    } else {
      leadFired.current = false;
    }
  }, [state.status, onClose, course, courseTitle]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm rounded-2xl p-0 w-full max-w-lg m-auto border-0 shadow-2xl"
    >
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="bg-brand-blue text-white px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase opacity-80">Inscrição</p>
            <h3 className="text-xl mt-1 text-white">{courseTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-white/80 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {state.status === "success" ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-lime flex items-center justify-center text-brand-blue text-2xl mb-4">✓</div>
            <p className="text-foreground">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="p-6 space-y-4">
            <input type="hidden" name="course" value={course} />

            <Field label="Nome completo" name="name" required />
            <Field label="WhatsApp" name="whatsapp" type="tel" required placeholder="(85) 9 9999-9999" />
            <Field label="E-mail" name="email" type="email" required />

            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">Já é formado?</label>
              <div className="flex gap-3">
                {(["sim", "nao"] as const).map((v) => (
                  <label key={v} className="flex-1">
                    <input
                      type="radio"
                      name="formed"
                      value={v}
                      checked={formed === v}
                      onChange={() => setFormed(v)}
                      className="peer sr-only"
                      required
                    />
                    <span className="block text-center px-4 py-2.5 border border-foreground/15 rounded-lg cursor-pointer peer-checked:border-brand-blue peer-checked:bg-brand-blue-soft peer-checked:text-brand-blue text-sm">
                      {v === "sim" ? "Sim" : "Ainda não"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {formed === "sim" && (
              <Field label="Número do conselho (CRO/CRM)" name="council" required />
            )}
            {formed === "nao" && (
              <Field
                label="Previsão de formatura"
                name="expectedCroDate"
                type="month"
                required
              />
            )}

            {state.status === "error" && (
              <p className="text-sm text-red-600">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-brand-blue text-white py-3 rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? "Enviando..." : "Enviar inscrição"}
            </button>
            <p className="text-[11px] text-muted text-center leading-relaxed">
              Ao enviar, você concorda em ser contatado por nossa equipe pelos canais informados.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs tracking-wide uppercase text-muted mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-foreground/15 rounded-lg text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
      />
    </div>
  );
}
