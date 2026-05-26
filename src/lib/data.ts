export type CourseId = "clinicare" | "unifor";

export type Course = {
  id: CourseId;
  badge: string;
  title: string;
  institution: string;
  duration: string;
  workload?: string;
  format: string;
  startDate: string;
  highlights: string[];
  modules?: { title: string; topics: string[]; date?: string }[];
  ctaLabel: string;
  bgImage: string;
};

export const courses: Course[] = [
  {
    id: "clinicare",
    badge: "Curso de Aperfeiçoamento",
    title: "HOF Custom Training",
    institution: "Anbro × Clinicare Training",
    duration: "5 meses",
    workload: "100h de carga horária",
    format: "Presencial · clínica integrada — Fortaleza/CE",
    startDate: "Julho 2026 · T8",
    highlights: [
      "Atendimento clínico a partir do 1º módulo",
      "Prática em pacientes reais em todos os módulos",
      "Clínica integrada — atendimento dentro da Clinicare",
      "Certificado chancelado pela Clinicare",
    ],
    modules: [
      {
        title: "Módulo 1 — Toxina Botulínica & Anatomia",
        date: "09–10 jul",
        topics: ["Análise facial", "Anatomia cervicofacial", "Fotografia HOF", "Toxina botulínica: protocolos individualizados"],
      },
      {
        title: "Módulo 2 — Preenchedores de Ácido Hialurônico",
        date: "29–30 ago",
        topics: ["Reologia", "Malar, lábios, sulco nasolabial e mento", "Estratégias de precificação", "Prática em pacientes"],
      },
      {
        title: "Módulo 3 — Skin & Intradermoterapia",
        date: "26–27 set",
        topics: ["Gerenciamento de pele", "Skinbooster", "Microagulhamento", "Intradermoterapia"],
      },
      {
        title: "Módulo 4 — Bioestimuladores & Fios PDO",
        date: "24–25 out",
        topics: ["Hidroxiapatita de cálcio", "PLLA", "Fios de PDO lisos", "Prática supervisionada"],
      },
      {
        title: "Módulo 5 — Tecnologia em HOF",
        date: "28–29 nov",
        topics: ["Ultrassom macro e microfocado (MPT)", "Laser não ablativo", "Manejo de intercorrências"],
      },
    ],
    ctaLabel: "Quero me inscrever — Clinicare",
    bgImage: "/cursos/clinicare-class.jpg",
  },
  {
    id: "unifor",
    badge: "Pós-graduação",
    title: "Especialização em Harmonização Orofacial",
    institution: "Anbro × Universidade de Fortaleza (UNIFOR)",
    duration: "20 meses",
    format: "Presencial — Fortaleza/CE",
    startDate: "Agosto 2026 · T3",
    highlights: [
      "Certificado chancelado pela UNIFOR",
      "Professores mestres, doutores e pesquisadores",
      "Programa completo de especialização",
      "Base científica, sem fórmulas prontas",
    ],
    ctaLabel: "Quero me inscrever — UNIFOR",
    bgImage: "/cursos/unifor-procedure.jpg",
  },
];

export const teachers = [
  {
    slug: "bruno-frota",
    name: "Bruno Frota",
    photo: "/professores/bruno.jpg",
    titles: [
      "Pós-graduado em Implantodontia e Harmonização Orofacial",
      "Especialista em Cirurgia e Traumatologia Bucomaxilofacial",
      "Mestre em Ciências Médicas",
      "Doutorando em Ciências Farmacêuticas",
      "Professor do Curso de Odontologia da UNIFOR e de cursos de pós-graduação em HOF da UNIFOR, ABO-CE e Clinicare Training",
    ],
  },
  {
    slug: "andre-viana",
    name: "André Viana",
    photo: "/professores/andre.jpg",
    titles: [
      "Especialista em Harmonização Orofacial",
      "Especialista em Oncologia",
      "Mestre e Doutor em Farmacologia",
      "Professor do Curso de Odontologia da UNIFOR e de cursos de pós-graduação em HOF da UNIFOR, ABO-CE e Clinicare Training",
    ],
  },
  {
    slug: "jose-romulo",
    name: "José Rômulo",
    photo: "/professores/romulo.jpg",
    titles: [
      "Residência em Cirurgia e Traumatologia Bucomaxilofacial",
      "Mestre e Doutor em Odontologia",
      "Pós-graduado em Harmonização Orofacial",
      "Professor dos cursos de graduação e pós-graduação da UNIFOR",
      "Professor dos cursos de Harmonização Orofacial da Clinicare Training",
    ],
  },
] as const;

export const testimonials = [
  { name: "Felipe", video: "/depoimentos/felipe.mp4", poster: "/depoimentos/felipe.jpg" },
  { name: "Renata", video: "/depoimentos/renata.mp4", poster: "/depoimentos/renata.jpg" },
  { name: "Catarina", video: "/depoimentos/catarina.mp4", poster: "/depoimentos/catarina.jpg" },
];

export const brand = {
  whatsapp: "5585981850390",
  whatsappDisplay: "(85) 98185-0390",
  whatsappClinicare: "5585992066459",
  instagram: "https://www.instagram.com/anbro.hof/",
  diferencial:
    "Nesse momento onde o conhecimento parece ser cada vez mais raso, queremos ser a ponte que une teoria e prática, que trata nossa profissão com excelência, humanidade e acima de tudo, ética. Para profissionais que queiram se destacar através de conteúdo científico, de forma clara, sem midiatismos ou fórmulas mágicas.",
};
