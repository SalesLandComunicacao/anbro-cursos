"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { courses, type CourseId } from "@/lib/data";
import { EnrollDialog } from "./enroll-dialog";

type Props = { autoplayMs?: number };

export function CourseCarousel({ autoplayMs = 6000 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [dialog, setDialog] = useState<{ open: boolean; course: CourseId; title: string }>({
    open: false,
    course: "clinicare",
    title: "",
  });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % courses.length);
    }, autoplayMs);
    return () => clearInterval(t);
  }, [autoplayMs, paused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.children[index] as HTMLElement | undefined;
    if (item) {
      track.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
    }
  }, [index]);

  function openEnroll(course: CourseId, title: string) {
    setDialog({ open: true, course, title });
  }

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div ref={trackRef} className="carousel-track flex overflow-x-auto gap-6 pb-2 -mx-6 px-6 lg:mx-0 lg:px-0">
        {courses.map((c) => (
          <article
            key={c.id}
            className="carousel-item flex-shrink-0 w-[88%] sm:w-[70%] lg:w-full lg:max-w-2xl mx-auto bg-white border border-brand-blue/10 rounded-3xl overflow-hidden shadow-sm"
          >
            <div className="relative text-white p-8 lg:p-10 overflow-hidden isolate">
              <Image
                src={c.bgImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover -z-20"
                aria-hidden
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-blue/95 via-brand-blue/85 to-brand-dark/92" />
              <span className="inline-block text-[11px] tracking-[0.2em] uppercase bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                {c.badge}
              </span>
              <h3 className="mt-4 text-2xl lg:text-3xl text-white leading-tight">{c.title}</h3>
              <p className="mt-2 text-white/85 text-sm">{c.institution}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <Info label="Duração" value={c.duration} />
                <Info label="Início" value={c.startDate} />
                <Info label="Formato" value={c.format} />
                {c.workload && <Info label="Carga horária" value={c.workload} />}
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <p className="text-xs tracking-[0.18em] uppercase text-brand-blue mb-4">Destaques</p>
              <ul className="space-y-3 mb-8">
                {c.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                    <span className="text-brand-blue mt-0.5">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openEnroll(c.id, c.title)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-7 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors"
              >
                {c.ctaLabel}
                <span aria-hidden>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {courses.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setIndex(i)}
            aria-label={`Ir para ${c.title}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-brand-blue" : "w-1.5 bg-brand-blue/25"
            }`}
          />
        ))}
      </div>

      <EnrollDialog
        open={dialog.open}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
        course={dialog.course}
        courseTitle={dialog.title}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.18em] uppercase text-white/60">{label}</p>
      <p className="text-white mt-1">{value}</p>
    </div>
  );
}
