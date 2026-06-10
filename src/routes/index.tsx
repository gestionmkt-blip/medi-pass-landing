import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reveal } from "@/components/medipass/Reveal";

export const Route = createFileRoute("/")({
  component: MediPassLanding,
  head: () => ({
    meta: [
      { title: "MediPass — Respaldo de salud para tu equipo" },
      {
        name: "description",
        content:
          "Membresía de salud para empresas en México. Orientación médica 24/7, videoconsultas y médico a domicilio desde $450 al año por persona.",
      },
    ],
  }),
});

const CORAL = "#EA6B48";
const BG_DARK = "#111";
const TEXT_MUTED = "#aaa";
const VSL_BG = "#000";
const VSL_BORDER = "#2a2a2a";

function MediPassLanding() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div id="top" className="min-h-screen" style={{ background: BG_DARK }}>
      <Nav />
      <main>
        {submitted ? (
          <ThankYou />
        ) : (
          <>
            <HeroSection />
            <FormSection onSubmit={() => setSubmitted(true)} />
            <TrustSignals />
          </>
        )}
      </main>
      <PageFooter />
    </div>
  );
}

// ── Componentes (se definen en tareas siguientes) ──────────────────────────
function Nav() {
  return (
    <header
      className="sticky top-0 z-40"
      style={{ background: BG_DARK, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
        <a href="#top" aria-label="MediPass inicio">
          <img
            src={`${import.meta.env.BASE_URL}medipass-logo.png`}
            alt="MediPass"
            style={{ height: 30 }}
          />
        </a>
        <button
          onClick={() =>
            document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" })
          }
          type="button"
          className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-transform hover:opacity-90 active:scale-95"
          style={{ background: CORAL }}
        >
          Cotización gratis
        </button>
      </div>
    </header>
  );
}
function HeroSection() {
  return (
    <section className="px-5 pb-8 pt-10 text-center" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-xl">
        <Reveal>
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(234,107,72,0.12)",
              color: CORAL,
              border: "1px solid rgba(234,107,72,0.25)",
            }}
          >
            Para dueños de empresa
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="mt-5 font-black leading-tight tracking-tight text-white"
            style={{ fontSize: "clamp(26px, 7vw, 40px)" }}
          >
            Protege la salud de tu equipo{" "}
            <span style={{ color: CORAL }}>sin pagar un seguro caro</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            Mira el video y descubre cómo más de 1,000 colaboradores ya tienen respaldo médico
            desde $450 al año.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mx-auto mt-7">
            {/* VSL placeholder — reemplazar con <iframe> de YouTube/Vimeo cuando esté listo */}
            <div
              className="relative w-full overflow-hidden rounded-xl"
              style={{ aspectRatio: "16/9", background: VSL_BG, border: `1px solid ${VSL_BORDER}` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: CORAL,
                    boxShadow: "0 0 0 16px rgba(234,107,72,0.12)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                    aria-hidden="true"
                    focusable="false"
                    style={{ marginLeft: "3px" }}
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs" style={{ color: "#555" }}>
              ⏱ Video de 3 minutos — míralo completo antes de cotizar
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function FormSection(_: { onSubmit: () => void }) { return null; }
function ThankYou() { return null; }
function TrustSignals() { return null; }
function PageFooter() { return null; }
