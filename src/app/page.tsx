"use client";

import { useEffect, useState } from "react";
import { LoginTeaserModal } from "@/components/LoginTeaserModal";
import {
  Dumbbell,
  Clipboard,
  IWFPlate,
  HeartPulse,
  MapPin,
  Instagram,
  Facebook,
  ArrowRight,
  User,
  Phone,
} from "@/components/icons/GymIcons";

function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");

    if (typeof IntersectionObserver === "undefined") return;

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const toObserve: HTMLElement[] = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < vh && rect.bottom > 0;
      if (!alreadyVisible) {
        el.classList.add("reveal-pending");
        toObserve.push(el);
      }
    });

    if (toObserve.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("reveal-pending");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -18% 0px" }
    );

    toObserve.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

const SERVICES = [
  {
    num: "01",
    Icon: Dumbbell,
    name: "Musculación",
    desc: "Máquinas para todos los grupos. Desde el primer día sabés qué hacer y cómo hacerlo bien.",
  },
  {
    num: "02",
    Icon: Clipboard,
    name: "Asistencia",
    desc: "Renovamos rutinas cada 15 días o seguí la tuya. Profes siempre atentos para ayudarte.",
  },
  {
    num: "03",
    Icon: IWFPlate,
    name: "Peso libre",
    desc: "Barras olímpicas, mancuernas, discos y pesas rusas. Donde se progresa de verdad, plato a plato.",
  },
  {
    num: "04",
    Icon: HeartPulse,
    name: "Cardio",
    desc: "Cintas, bicis y elípticos. Para calentar, para cerrar, o como eje del entrenamiento. Vos elegís.",
  },
];

const LEDGER = [
  {
    date: "14·03·1997",
    label: "Apertura",
    detail: "Primera sesión. Mismo barrio, mismo dueño, misma forma de entrenar en serio.",
  },
  {
    date: "27 años",
    label: "Sin mudanzas",
    detail: "Tres décadas en Río de la Plata 7462. Miles de vidas transformadas entre estas paredes.",
  },
  {
    date: "3 generaciones",
    label: "Bajo el mismo techo",
    detail: "Padres que trajeron a los hijos. Hijos que hoy traen a los nietos. Así se mide un gym de barrio.",
  },
  {
    date: "5.455",
    label: "Nos siguen en Instagram",
    detail: "Siguen el día a día desde @gimnasiocris1997. Cada récord, cada cumpleaños, cada rutina nueva.",
  },
  {
    date: "1 dueño",
    label: "Al frente desde el día uno",
    detail: "El mismo que abrió en el '97. Sigue caminando el salón todos los días, mirando series y corrigiendo posturas.",
  },
];

const PLANS = [
  {
    name: "Clase suelta",
    price: "$7.000",
    desc: "Venite a probar un día. Si te gusta el fierro y la gente, hablamos.",
    featured: false,
  },
  {
    name: "Semanal",
    price: "$12.000",
    desc: "Siete días de acceso completo. Ideal para testear antes de comprometerte al mes.",
    featured: false,
  },
  {
    name: "Mensual",
    price: "$33.000",
    desc: "El plan que usa la mayoría. Acceso libre todo el mes.",
    featured: true,
  },
];

export default function Home() {
  useRevealOnScroll();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      {/* ===== NAV ===== */}
      <header className="fixed top-0 w-full z-50 bg-gym-bg/85 backdrop-blur-md border-b border-gym-border">
        <nav className="flex justify-between items-center w-full max-w-7xl mx-auto px-6 py-4 md:py-5">
          <a
            href="#inicio"
            className="flex items-center gap-2 text-xl md:text-2xl font-heading tracking-tight text-gym-gold uppercase"
          >
            <IWFPlate className="w-5 h-5 md:w-6 md:h-6" />
            GymCris
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: "Gimnasio", href: "#nosotros" },
              { label: "Servicios", href: "#servicios" },
              { label: "Precios", href: "#precios" },
              { label: "Horarios", href: "#horarios" },
              { label: "Contacto", href: "#contacto" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gym-text-tertiary hover:text-gym-gold transition-colors uppercase text-[10px] tracking-[0.3em] font-bold"
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="group flex items-center gap-2 bg-gym-gold text-gym-gold-text font-black px-5 md:px-6 py-2.5 text-[11px] uppercase tracking-[0.15em] hover:bg-gym-tungsten transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Ingresar</span>
          </button>
        </nav>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section
          id="inicio"
          className="relative min-h-screen max-h-[1100px] flex flex-col justify-between overflow-hidden grain"
        >
          {/* Cinematic background — real Gym Cris photo + tungsten overlays for legibility */}
          <div className="absolute inset-0 z-0">
            {/* Base surface (fallback while image loads) */}
            <div className="absolute inset-0 bg-gym-surface" />
            {/* Real gym photo — Gym Cris interior with "EL DOLOR ES TEMPORAL" wall text */}
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/hero-gym.jpg')",
                filter: "grayscale(0.25) contrast(1.08) brightness(0.65) saturate(0.95)",
              }}
            />
            {/* Tungsten warm glow from upper center — ties photo to brand gold */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 75% 55% at 50% 38%, rgba(255,215,0,0.18) 0%, transparent 60%)",
              }}
            />
            {/* Darker secondary pool on lower right */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 40% 30% at 85% 75%, rgba(232,184,74,0.1) 0%, transparent 70%)",
              }}
            />
            {/* Side vignette — focus the eye on center */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 130% 100% at 50% 50%, transparent 20%, rgba(5,5,5,0.88) 100%)",
              }}
            />
            {/* Bottom-to-top fade — anchors the title block on a readable dark base */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.3) 35%, rgba(5,5,5,0.75) 75%, rgba(5,5,5,0.95) 100%)",
              }}
            />
            {/* Vertical cinematic fade */}
            <div className="absolute inset-0 cinematic-overlay" />
            <div className="absolute inset-0 cinematic-overlay-top" />
          </div>

          {/* Top kicker — "EST. 1997" ledger badge */}
          <div className="relative z-10 w-full px-6 md:px-12 pt-28 md:pt-32">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <span className="w-8 h-px bg-gym-gold" />
              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-gym-gold">
                EST. 1997 · Río de la Plata 7462
              </span>
            </div>
          </div>

          {/* Title block */}
          <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24 min-[2560px]:my-auto min-[2560px]:pb-0">
            <div className="max-w-7xl mx-auto w-full">
              <h1 className="text-bleed font-heading uppercase mb-8 md:mb-12 gold-glow text-gym-chalk">
                Templo
                <br />
                <span className="text-gym-gold italic">del fierro.</span>
              </h1>

              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-end">
                <p className="text-lg md:text-2xl lg:text-3xl font-light text-gym-text-secondary leading-snug max-w-2xl border-l-2 border-gym-gold pl-6 md:pl-8 flex-1">
                  27 años transformando vidas en González Catán. Sin modas, sin promesas inventadas.
                  <span className="block mt-2 text-gym-text-tertiary text-base md:text-lg italic">
                    Hierro de verdad y gente que te conoce por el nombre.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href="#contacto"
                    className="group flex items-center justify-center gap-2 bg-gym-gold text-gym-gold-text px-8 md:px-10 py-5 md:py-6 font-black text-sm md:text-base tracking-wide uppercase hover:bg-gym-tungsten transition-colors"
                  >
                    Venite a entrenar
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#precios"
                    className="flex items-center justify-center gap-2 border border-gym-border-strong text-gym-chalk px-8 md:px-10 py-5 md:py-6 font-black text-sm md:text-base tracking-wide uppercase hover:bg-gym-surface-2 transition-colors"
                  >
                    Ver planes
                  </a>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ===== LIBRO DEL GIMNASIO ===== */}
        <section className="reveal w-full bg-gym-surface border-y border-gym-border">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 grid lg:grid-cols-[0.9fr_1.3fr] gap-16 lg:gap-24">
            {/* Left: title block */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-gym-gold" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gym-gold">
                  Libro del gimnasio
                </span>
              </div>
              <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.88] tracking-tight text-gym-chalk mb-8">
                Las marcas
                <br />
                <span className="text-gym-gold">de la casa.</span>
              </h2>
              <p className="text-gym-text-secondary text-base md:text-lg font-light leading-relaxed max-w-md">
                Cada renglón de esta lista tiene nombre y apellido. Un vecino
                que entró por primera vez, una máquina que compramos con
                esfuerzo, un récord que costó meses de insistencia.
              </p>
            </div>

            {/* Right: ledger entries */}
            <ol className="divide-y divide-gym-border reveal stagger-children">
              {LEDGER.map((entry, i) => (
                <li
                  key={entry.label}
                  className="py-6 md:py-7 grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-baseline group"
                >
                  <span className="font-mono text-[10px] md:text-xs text-gym-text-tertiary tabular-nums pt-2 shrink-0 w-8">
                    №{String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-1">
                      <span className="font-heading text-3xl md:text-4xl lg:text-5xl text-gym-gold tracking-tight leading-none">
                        {entry.date}
                      </span>
                      <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-gym-text-tertiary">
                        {entry.label}
                      </span>
                    </div>
                    <p className="text-gym-text-secondary text-sm md:text-base font-light italic mt-2 max-w-lg">
                      {entry.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section id="nosotros" className="reveal relative py-24 md:py-36 overflow-hidden grain">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gym-surface-2" />
            {/* Warm tungsten sweep from right */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(255,215,0,0.1) 0%, transparent 60%)",
              }}
            />
            {/* Darkening from left */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(100deg, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.9) 30%, rgba(5,5,5,0.5) 70%, rgba(5,5,5,0.3) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 w-full px-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gym-gold" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gym-gold">
                Nosotros
              </span>
            </div>

            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.88] tracking-tight text-gym-chalk mb-12 md:mb-16 max-w-3xl">
              Más que un gimnasio.
              <br />
              <span className="text-gym-gold italic">Un pedazo del barrio.</span>
            </h2>

            <div className="max-w-2xl space-y-6 text-gym-text-secondary">
              <p className="text-xl md:text-2xl font-light leading-relaxed text-gym-chalk">
                Abrimos en el '97 con una idea simple: un lugar donde al
                esfuerzo se lo nota y a la constancia se la respeta. Ni más ni
                menos que eso.
              </p>
              <p className="text-base md:text-lg leading-relaxed font-light">
                Somos un gym de barrio. Nada más, nada menos. Río de la Plata
                7462, 27 años de historia y el mismo dueño que abrió las
                puertas en el '97. Nuestras paredes son testigos de miles de
                historias de esfuerzo y superación. Acá no sos un número más,
                estás en casa.
              </p>
              <p className="text-base md:text-lg leading-relaxed font-light italic text-gym-text-tertiary">
                Los alumnos vuelven de grandes con sus hijos. Algunos, con los
                nietos. Así se mide un gym de verdad.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section
          id="servicios"
          className="reveal w-full bg-gym-bg border-t border-gym-border"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-20 md:pb-28">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gym-gold" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gym-gold">
                Servicios
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.88] tracking-tight text-gym-chalk mb-16 max-w-3xl">
              Hierro, rutina y
              <br />
              <span className="text-gym-gold">alguien que te corrija.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-gym-border reveal stagger-children">
              {SERVICES.map((s, i) => {
                const Icon = s.Icon;
                return (
                  <div
                    key={s.name}
                    className={`p-8 md:p-10 relative group hover:bg-gym-surface transition-colors ${
                      i < SERVICES.length - 1
                        ? "border-b sm:border-b-0 sm:border-r border-gym-border last:border-r-0 sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r"
                        : ""
                    }`}
                  >
                    <div className="absolute top-4 right-5 font-heading text-5xl md:text-6xl text-gym-gold/10 leading-none select-none">
                      {s.num}
                    </div>

                    <Icon
                      className="w-10 h-10 md:w-12 md:h-12 text-gym-gold mb-8 md:mb-10 transition-transform group-hover:scale-105"
                      strokeWidth={1.5}
                    />

                    <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-gym-chalk mb-3">
                      {s.name}
                    </h3>
                    <p className="text-gym-text-tertiary text-sm md:text-[15px] font-light leading-relaxed max-w-xs">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section
          id="precios"
          className="reveal w-full bg-gym-bg border-t border-gym-border"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gym-gold" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gym-gold">
                Planes
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.88] tracking-tight text-gym-chalk mb-6 md:mb-8 max-w-3xl">
              Tres formas
              <br />
              <span className="text-gym-gold">de empezar.</span>
            </h2>
            <p className="text-gym-text-secondary text-base md:text-lg font-light leading-relaxed max-w-2xl mb-16 md:mb-20">
              Probá una clase, probá una semana, o arrancá directo con el mes.
              No hay matrícula ni contrato de permanencia. Si no te sentís
              cómodo, no volvés y listo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-gym-border reveal stagger-children">
              {PLANS.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`relative p-8 md:p-10 lg:p-12 flex flex-col ${
                    i < PLANS.length - 1
                      ? "border-b md:border-b-0 md:border-r border-gym-border"
                      : ""
                  } ${plan.featured ? "bg-gym-surface" : ""}`}
                >
                  {plan.featured && (
                    <span className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-[0.3em] text-gym-gold-text bg-gym-gold px-2.5 py-1 font-bold">
                      Recomendado
                    </span>
                  )}

                  <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-gym-gold font-bold mb-5 md:mb-6">
                    {plan.name}
                  </span>

                  <div className="font-heading text-5xl md:text-6xl lg:text-7xl tracking-tight leading-none text-gym-chalk mb-8 md:mb-10">
                    {plan.price}
                  </div>

                  <p className="text-gym-text-tertiary text-sm md:text-[15px] font-light leading-relaxed mb-8 flex-1 max-w-xs">
                    {plan.desc}
                  </p>

                  <a
                    href="#contacto"
                    className={`group inline-flex items-center gap-2 border-t pt-5 font-black text-xs md:text-sm uppercase tracking-[0.15em] transition-colors ${
                      plan.featured
                        ? "border-gym-gold text-gym-gold hover:text-gym-tungsten"
                        : "border-gym-border-strong text-gym-chalk hover:text-gym-gold"
                    }`}
                  >
                    Venite a probar
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ===== SCHEDULE ===== */}
        <section
          id="horarios"
          className="reveal w-full bg-gym-bg border-y border-gym-border"
        >
          <div className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gym-gold" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gym-gold">
                Horarios
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.88] tracking-tight text-gym-chalk mb-14 md:mb-16 max-w-3xl">
              Horarios grandes.
              <br />
              <span className="text-gym-gold">Excusas chicas.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-gym-border reveal stagger-children">
              {[
                {
                  days: "Lunes a Viernes",
                  time: "06:30 — 23:30",
                  caption: "17 horas por día. Elegí la tuya.",
                  closed: false,
                },
                {
                  days: "Sábados",
                  time: "08:00 — 18:00",
                  caption: "10 horas para ponerte al día.",
                  closed: false,
                },
                {
                  days: "Domingos",
                  time: "Cerrado",
                  caption: "El único día que descansan los fierros. Aprovechalo vos también.",
                  closed: true,
                },
              ].map((slot, i) => (
                <div
                  key={slot.days}
                  className={`p-8 md:p-10 lg:p-12 ${
                    i < 2 ? "border-b md:border-b-0 md:border-r border-gym-border" : ""
                  } ${slot.closed ? "bg-gym-surface" : ""}`}
                >
                  <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-gym-gold block mb-5 font-bold">
                    {slot.days}
                  </span>
                  <span
                    className={`block font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight leading-none ${
                      slot.closed
                        ? "text-gym-text-tertiary italic"
                        : "text-gym-chalk"
                    }`}
                  >
                    {slot.time}
                  </span>
                  <p className="mt-5 text-gym-text-tertiary text-sm md:text-[15px] font-light leading-snug max-w-[240px]">
                    {slot.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contacto" className="reveal w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid md:grid-cols-2 border border-gym-border">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-gym-surface md:border-r border-gym-border">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-gym-gold" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gym-gold">
                  Contacto
                </span>
              </div>
              <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.88] text-gym-chalk mb-8 md:mb-10">
                Veníte
                <br />
                <span className="text-gym-gold">a entrenar.</span>
              </h2>

              <p className="text-gym-text-secondary text-base md:text-lg font-light leading-relaxed mb-10 md:mb-12 max-w-md">
                Acá no hay turnos ni recepcionistas. Venite sin anunciarte — los
                fierros están esperando y siempre hay alguien para mostrarte el lugar.
              </p>

              <ul className="space-y-7 md:space-y-9">
                <li className="flex items-start gap-5">
                  <div className="border border-gym-border-strong p-3 shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-gym-gold" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl md:text-2xl uppercase text-gym-chalk tracking-tight mb-1">
                      Dónde estamos
                    </h4>
                    <a
                      href="https://www.google.com/maps/place/GYM+CRIS/@-34.8123366,-58.6369609,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcdbe8ad8a0f47:0xc0b69d7f04ed5378!8m2!3d-34.812341!4d-58.634386!16s%2Fg%2F11f66gc2sl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 text-gym-text-secondary text-base md:text-lg font-light hover:text-gym-gold transition-colors"
                    >
                      <span>
                        Río de la Plata 7462
                        <br />
                        González Catán · La Matanza, Buenos Aires
                      </span>
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-5">
                  <div className="border border-gym-border-strong p-3 shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-gym-gold" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl md:text-2xl uppercase text-gym-chalk tracking-tight mb-1">
                      WhatsApp
                    </h4>
                    <a
                      href="https://wa.me/5491162522431"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gym-gold text-base md:text-lg font-semibold hover:text-gym-tungsten transition-colors"
                    >
                      +54 11 6252-2431
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <p className="text-gym-text-tertiary text-sm font-light italic mt-1">
                      Escribinos si querés, pero no hace falta.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-5">
                  <div className="border border-gym-border-strong p-3 shrink-0">
                    <Instagram className="w-5 h-5 md:w-6 md:h-6 text-gym-gold" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl md:text-2xl uppercase text-gym-chalk tracking-tight mb-1">
                      Instagram
                    </h4>
                    <a
                      href="https://www.instagram.com/gimnasiocris1997/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gym-gold text-base md:text-lg font-semibold hover:text-gym-tungsten transition-colors"
                    >
                      @gimnasiocris1997
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <p className="text-gym-text-tertiary text-sm font-light italic mt-1">
                      Mirá el día a día antes de venir.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-5">
                  <div className="border border-gym-border-strong p-3 shrink-0">
                    <Facebook className="w-5 h-5 md:w-6 md:h-6 text-gym-gold" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl md:text-2xl uppercase text-gym-chalk tracking-tight mb-1">
                      Facebook
                    </h4>
                    <a
                      href="https://web.facebook.com/profile.php?id=100063726812998"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gym-gold text-base md:text-lg font-semibold hover:text-gym-tungsten transition-colors"
                    >
                      Gimnasio Cris
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right: kettlebell product shot — isolated, no people */}
            <div className="relative min-h-[400px] md:min-h-[600px] overflow-hidden bg-gym-surface-2 grain">
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/kettlebell.jpg')",
                  filter: "grayscale(0.3) contrast(1.1) brightness(0.7)",
                }}
              />
              {/* Tungsten warm wash */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,215,0,0.15) 0%, transparent 65%)",
                }}
              />
              {/* Edge vignette */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(5,5,5,0.7) 100%)",
                }}
              />
              {/* Bottom caption strip — real wall text from the gym */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 bg-gradient-to-t from-gym-bg via-gym-bg/80 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-gym-gold" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gym-gold">
                    Lo que dice la pared
                  </span>
                </div>
                <p className="font-heading text-2xl md:text-3xl lg:text-4xl uppercase text-gym-chalk leading-[0.95] tracking-tight">
                  El dolor es temporal.
                  <br />
                  <span className="text-gym-gold italic">La gloria es eterna.</span>
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="w-full bg-gym-bg border-t border-gym-border relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-10 -bottom-20 font-heading text-[12rem] md:text-[22rem] text-gym-chalk/[0.015] select-none leading-none pointer-events-none"
        >
          CRIS
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
            <a
              href="#inicio"
              className="flex items-center gap-3 text-3xl md:text-4xl font-heading text-gym-gold uppercase tracking-tight gold-glow"
            >
              <IWFPlate className="w-8 h-8 md:w-10 md:h-10" />
              GymCris
            </a>
            <div className="flex flex-wrap gap-6 md:gap-10">
              {[
                "Nosotros",
                "Servicios",
                "Precios",
                "Horarios",
                "Contacto",
              ].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-gym-text-tertiary hover:text-gym-gold transition-colors font-bold text-[10px] uppercase tracking-[0.3em]"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-gym-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gym-text-muted text-[10px] font-bold uppercase tracking-[0.3em]">
              © 2026 Gimnasio Cris · Desde 1997
            </p>
            <p className="text-gym-text-muted text-[10px] uppercase tracking-[0.3em]">
              Río de la Plata 7462 · González Catán, Buenos Aires
            </p>
          </div>
        </div>
      </footer>

      <LoginTeaserModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
