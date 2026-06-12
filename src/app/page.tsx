import Image from "next/image";
import Script from "next/script";
import { brand, courses, teachers, testimonials } from "@/lib/data";
import { CourseCarousel } from "@/components/course-carousel";

export default function Home() {
  const courseSchema = courses.map((c) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.title,
    description: c.highlights.join(". "),
    provider: {
      "@type": "EducationalOrganization",
      name: c.institution,
      sameAs: "https://anbro.com.br",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Presencial",
      location: { "@type": "Place", name: "Fortaleza, CE" },
      startDate: c.startDate,
    },
  }));

  return (
    <>
      <Script
        id="ld-courses"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <Header />

      <main className="flex-1">
        <Hero />
        <Section
          eyebrow="Cursos disponíveis"
          title="Duas trilhas, uma só excelência"
          intro="Você escolhe entre UNIFOR e Clinicare — especialização longa pela Universidade ou aperfeiçoamento intensivo pela Clinicare Training. Na Clinicare, você atende pacientes já a partir do 1º módulo; na UNIFOR, a prática clínica começa a partir do 3º módulo."
          id="cursos"
        >
          <CourseCarousel autoplayMs={7000} />
        </Section>

        <Testimonials />

        <Section
          eyebrow="Inscreva-se já"
          title="Próximas turmas — T3"
          intro="Vagas limitadas em ambas as turmas. Comece agora seu processo e fale com nossa equipe."
          variant="muted"
          id="inscricao"
        >
          <CourseCarousel autoplayMs={9000} />
        </Section>

        <MoreInfo />

        <About />

        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}

/* ──────────── Header ──────────── */
function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-foreground/5">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <Image src="/logo-anbro.png" alt="ANBRO — Harmonização Orofacial" width={1500} height={540} priority className="h-12 lg:h-14 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-foreground/70">
          <a href="#cursos" className="hover:text-brand-blue transition-colors">Cursos</a>
          <a href="#depoimentos" className="hover:text-brand-blue transition-colors">Depoimentos</a>
          <a href="#programa" className="hover:text-brand-blue transition-colors">Programa</a>
          <a href="#quem-somos" className="hover:text-brand-blue transition-colors">Quem somos</a>
        </nav>
        <a
          href="#cursos"
          className="text-sm bg-brand-blue text-white px-5 py-2 rounded-full hover:bg-brand-dark transition-colors"
        >
          Quero me inscrever
        </a>
      </div>
    </header>
  );
}

/* ──────────── Hero ──────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      <Image
        src="/hero/clinicare-room.jpg"
        alt="Sala de treinamento Clinicare durante curso da Anbro"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center -z-20"
      />
      {/* Layered overlays for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark/92 via-brand-dark/70 to-brand-dark/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-dark/60 via-transparent to-brand-dark/30" />

      <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 w-full">
        <div className="max-w-3xl text-white">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-brand-lime fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
            Harmonização Orofacial · desde 2021
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] fade-up delay-100">
            A ponte entre <em className="text-brand-lime">teoria e prática</em> — sem midiatismos, sem fórmulas mágicas.
          </h1>
          <p className="mt-7 text-lg text-white/85 leading-relaxed max-w-2xl fade-up delay-200">
            {brand.diferencial}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 fade-up delay-300">
            <a
              href="#cursos"
              className="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-7 py-3.5 rounded-full font-medium hover:bg-white transition-colors shadow-lg shadow-black/30"
            >
              Ver cursos disponíveis
              <span aria-hidden>→</span>
            </a>
            <a
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full font-medium hover:border-white hover:bg-white/5 transition-colors backdrop-blur-sm"
            >
              Falar no WhatsApp
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl fade-up delay-300">
            <Stat value="+13" label="anos de experiência" />
            <Stat value="+25" label="turmas formadas" />
            <Stat value="2" label="chancelas - UNIFOR/Clinicare" />
            <Stat value="100%" label="base científica" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl text-brand-lime font-display">{value}</p>
      <p className="text-xs text-white/70 mt-1 leading-snug">{label}</p>
    </div>
  );
}

/* ──────────── Section wrapper ──────────── */
function Section({
  eyebrow,
  title,
  intro,
  children,
  variant = "default",
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  variant?: "default" | "muted" | "dark";
  id?: string;
}) {
  const bg =
    variant === "muted"
      ? "bg-brand-cream"
      : variant === "dark"
        ? "bg-brand-dark text-white"
        : "bg-white";
  return (
    <section id={id} className={`${bg} py-24 lg:py-32`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-sm tracking-[0.24em] uppercase font-semibold text-brand-blue">{eyebrow}</p>
          <h2 className="mt-3 text-3xl lg:text-5xl leading-tight">{title}</h2>
          {intro && <p className="mt-5 text-muted text-lg leading-relaxed">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ──────────── Testimonials ──────────── */
function Testimonials() {
  return (
    <section id="depoimentos" className="bg-brand-blue text-white py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-sm tracking-[0.24em] uppercase font-semibold text-brand-lime">Depoimentos</p>
          <h2 className="mt-3 text-3xl lg:text-5xl text-white leading-tight">
            Quem passou pela ANBRO, fala por nós.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="bg-white/5 backdrop-blur rounded-2xl overflow-hidden border border-white/10">
              <div className="aspect-[9/16] bg-black/20 flex items-center justify-center relative">
                <video
                  src={t.video}
                  poster={t.poster}
                  controls
                  preload="none"
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="px-5 py-4">
                <p className="text-white">{t.name}</p>
                <p className="text-xs text-white/60 mt-0.5">{t.org}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────── More info (curriculum) ──────────── */
function MoreInfo() {
  const clinicare = courses.find((c) => c.id === "clinicare")!;
  return (
    <Section
      eyebrow="Mais informações"
      title="O que você vai aprender no HOF Custom Training"
      intro="Cinco módulos com clínica integrada — você atende pacientes em todos eles. A partir do segundo módulo, cada encontro soma novos procedimentos ao que já vinha sendo praticado; ao final, você atende em todas as frentes da grade."
      variant="muted"
      id="programa"
    >
      <ol className="space-y-4">
        {clinicare.modules?.map((m, i) => (
          <li key={m.title} className="bg-white border border-foreground/8 rounded-2xl p-6 lg:p-7">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-xs tracking-[0.2em] uppercase text-brand-blue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl lg:text-2xl text-foreground">{m.title.replace(/^Módulo \d+ — /, "")}</h3>
              <span className="text-[10px] tracking-[0.16em] uppercase bg-brand-lime/40 text-brand-dark px-2.5 py-1 rounded-full font-medium">
                Prática clínica
              </span>
              {m.date && (
                <span className="ml-auto text-xs text-muted bg-brand-blue-soft px-3 py-1 rounded-full">
                  {m.date}
                </span>
              )}
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {m.topics.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand-blue" />
                  {t}
                </li>
              ))}
            </ul>
            {m.practice && (
              <div className="mt-5 flex flex-wrap items-baseline gap-2 text-sm border-t border-brand-blue/10 pt-4">
                <span className="text-[10px] tracking-[0.18em] uppercase text-brand-blue font-medium">
                  Atendimento clínico no mês:
                </span>
                <span className="text-foreground/85">{m.practice}</span>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 p-6 lg:p-8 bg-brand-blue text-white rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-lime">Especialização UNIFOR</p>
          <p className="mt-2 text-lg text-white">
            Pós-graduação completa em 20 meses — programa estendido, certificado universitário.
          </p>
        </div>
        <a
          href="https://unifor.br/web/pos-graduacao/especializacao-em-harmonizacao-orofacial"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-white text-brand-blue px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-lime transition-colors"
        >
          Ver grade na UNIFOR
          <span aria-hidden>↗</span>
        </a>
      </div>
    </Section>
  );
}

/* ──────────── About / Teachers ──────────── */
function About() {
  return (
    <Section
      eyebrow="Quem somos"
      title="Professores universitários, pesquisadores, mestres e doutores."
      intro="A ANBRO nasceu para tratar a Harmonização Orofacial com a profundidade científica que ela merece. Conheça o corpo docente."
      id="quem-somos"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((t) => (
          <article key={t.slug} className="bg-white border border-foreground/8 rounded-2xl overflow-hidden">
            <div className="aspect-[4/5] bg-brand-blue-soft relative">
              <Image
                src={t.photo}
                alt={t.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover object-[center_top]"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl text-foreground">{t.name}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted leading-relaxed">
                {t.titles.map((title) => (
                  <li key={title} className="flex gap-2">
                    <span className="text-brand-blue mt-1.5 w-1 h-1 rounded-full bg-brand-blue flex-shrink-0" />
                    <span>{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ──────────── Final CTA ──────────── */
function FinalCTA() {
  return (
    <section className="bg-brand-dark text-white py-24 lg:py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-5xl text-white leading-tight">
          Próximas turmas começam em julho e agosto.
        </h2>
        <p className="mt-5 text-white/70 text-lg max-w-2xl mx-auto">
          Vagas limitadas. Fale com nossa equipe para conhecer valores, condições e processo seletivo.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="#cursos"
            className="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-7 py-3.5 rounded-full font-medium hover:bg-white transition-colors"
          >
            Quero me inscrever
            <span aria-hidden>→</span>
          </a>
          <a
            href={`https://wa.me/${brand.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-white/25 text-white px-7 py-3.5 rounded-full hover:border-white transition-colors"
          >
            WhatsApp {brand.whatsappDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ──────────── Footer ──────────── */
function Footer() {
  return (
    <footer className="bg-white border-t border-foreground/5 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between text-sm text-muted">
        <div>
          <p className="font-display text-brand-blue text-lg">ANBRO Cursos</p>
          <p className="mt-1">© {new Date().getFullYear()} ANBRO Harmonização Orofacial</p>
        </div>
        <div className="flex gap-6">
          <a href={brand.instagram} target="_blank" rel="noreferrer" className="hover:text-brand-blue">
            Instagram
          </a>
          <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-brand-blue">
            WhatsApp
          </a>
          <a href="https://anbro.com.br" className="hover:text-brand-blue">anbro.com.br</a>
        </div>
      </div>
    </footer>
  );
}
