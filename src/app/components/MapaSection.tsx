"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { buscarLocales, RESTRICCIONES_CON_DATOS, type Local } from "@/lib/publico";
import AvisoRespaldo from "./AvisoRespaldo";

/** Colores de la sección "Niveles de seguridad". */
const COLOR_NIVEL: Record<number, string> = { 1: "#2D7A4A", 2: "#A46C54", 3: "#8B6914" };

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function popup(l: Local) {
  const niveles = Object.entries(l.nivelesPorRestriccion)
    .map(([r, n]) => `<li>${escapar(r)}: <b>Nivel ${n}</b></li>`)
    .join("");
  const enlaces = [
    l.sitioWeb && /^https?:\/\//.test(l.sitioWeb)
      ? `<a href="${escapar(l.sitioWeb)}" target="_blank" rel="noopener noreferrer">Sitio web</a>`
      : null,
    l.urlFuente ? `<a href="${escapar(l.urlFuente)}" target="_blank" rel="noopener noreferrer">Ver en OSM</a>` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return `<div style="font-family:inherit;min-width:180px">
    <p style="font-weight:700;color:#563B2D;margin:0">${escapar(l.nombre)}</p>
    <p style="font-size:12px;color:#563B2D99;margin:2px 0 6px">${escapar(
      [l.tipo, l.direccion, l.comuna].filter(Boolean).join(" · ")
    )}</p>
    <ul style="font-size:12px;margin:0 0 6px;padding-left:16px">${niveles}</ul>
    ${l.horario ? `<p style="font-size:11px;margin:0 0 4px">🕒 ${escapar(l.horario)}</p>` : ""}
    <p style="font-size:12px;margin:0">${enlaces}</p>
  </div>`;
}

export default function MapaSection({
  restriccionInicial,
  comunaInicial,
}: {
  restriccionInicial?: string;
  comunaInicial?: string;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<LeafletMap | null>(null);
  const capa = useRef<LayerGroup | null>(null);
  const [restriccion, setRestriccion] = useState(restriccionInicial ?? "");
  const [soloExclusivos, setSoloExclusivos] = useState(false);
  const [locales, setLocales] = useState<Local[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [respaldo, setRespaldo] = useState<string | undefined>();

  // El buscador del hero cambia la restricción desde afuera (ajuste de estado durante el render)
  const [inicialPrevia, setInicialPrevia] = useState(restriccionInicial);
  if (restriccionInicial !== inicialPrevia) {
    setInicialPrevia(restriccionInicial);
    if (restriccionInicial !== undefined) setRestriccion(restriccionInicial);
  }

  // Leaflet usa window: se carga solo en el navegador
  useEffect(() => {
    let cancelado = false;
    import("leaflet").then((L) => {
      if (cancelado || !contenedor.current || mapa.current) return;
      mapa.current = L.map(contenedor.current, { scrollWheelZoom: false }).setView([-33.45, -70.65], 11);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapa.current);
      capa.current = L.layerGroup().addTo(mapa.current);
    });
    return () => {
      cancelado = true;
      mapa.current?.remove();
      mapa.current = null;
    };
  }, []);

  useEffect(() => {
    let vigente = true;
    buscarLocales({ restriccion, nivel: soloExclusivos ? 1 : 3, comuna: comunaInicial })
      .then((p) => {
        if (!vigente) return;
        setLocales(p.contenido);
        setRespaldo(p.respaldo);
        setError(null);
      })
      .catch(() => vigente && setError("No pudimos cargar los locales."));
    return () => {
      vigente = false;
    };
  }, [restriccion, soloExclusivos, comunaInicial]);

  // Pinta los marcadores cuando cambian los datos (o cuando el mapa termina de cargar)
  useEffect(() => {
    let intentos = 0;
    const pintar = () => {
      if (!capa.current || !mapa.current) {
        if (intentos++ < 20) setTimeout(pintar, 150);
        return;
      }
      import("leaflet").then((L) => {
        capa.current!.clearLayers();
        locales.forEach((l) => {
          L.circleMarker([l.latitud, l.longitud], {
            radius: l.nivel === 1 ? 9 : 7,
            color: "#ffffff",
            weight: 2,
            fillColor: COLOR_NIVEL[l.nivel] ?? "#8B6914",
            fillOpacity: 0.9,
          })
            .bindPopup(popup(l))
            .addTo(capa.current!);
        });
        if (comunaInicial && locales.length > 0) {
          mapa.current!.fitBounds(L.latLngBounds(locales.map((l) => [l.latitud, l.longitud])), { maxZoom: 14 });
        }
      });
    };
    pintar();
  }, [locales, comunaInicial]);

  const exclusivos = locales.filter((l) => l.nivel === 1).length;

  return (
    <section id="mapa" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-[#C3A69A]/20 text-xs font-bold text-[#A46C54] uppercase tracking-widest mb-4">
            Mapa de locales
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold" style={{ color: "#563B2D" }}>
            Dónde comer <span style={{ color: "#A46C54" }}>tranquilo</span>
          </h2>
          <p className="text-[#563B2D]/55 mt-4 max-w-2xl mx-auto">
            {locales.length} locales en Chile{exclusivos > 0 && `, ${exclusivos} exclusivos para su dieta`}.
            {comunaInicial && ` Filtrando por "${comunaInicial}".`}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2 flex-1">
            {["", ...RESTRICCIONES_CON_DATOS].map((r) => (
              <button
                key={r || "todas"}
                id={`filtro-mapa-${(r || "todas").replace(" ", "-").toLowerCase()}`}
                onClick={() => setRestriccion(r)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  restriccion === r
                    ? "bg-[#A46C54] text-white shadow"
                    : "bg-white text-[#563B2D] border border-[#D1C9C5] hover:border-[#A46C54]"
                }`}
              >
                {r || "Todas"}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-[#563B2D] cursor-pointer select-none">
            <input
              id="filtro-solo-exclusivos"
              type="checkbox"
              checked={soloExclusivos}
              onChange={(e) => setSoloExclusivos(e.target.checked)}
              className="w-4 h-4 accent-[#2D7A4A]"
            />
            Solo Nivel 1 (exclusivos)
          </label>
        </div>

        <AvisoRespaldo fecha={respaldo} />
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div
          ref={contenedor}
          className="h-[480px] w-full rounded-3xl overflow-hidden border border-[#D1C9C5]/60 shadow-lg z-0"
        />

        <div className="flex flex-wrap gap-6 justify-center mt-5 text-xs text-[#563B2D]/70">
          {[
            [1, "Nivel 1 · Exclusivo"],
            [3, "Nivel 3 · Tiene opciones, sin garantía de trazas"],
          ].map(([n, texto]) => (
            <span key={n} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_NIVEL[n as number] }} />
              {texto}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#563B2D]/45 text-center max-w-3xl mx-auto leading-relaxed">
          Datos de locales: © OpenStreetMap contributors (ODbL). El Nivel 2 (cocinas separadas) requiere
          verificación presencial y no se asigna automáticamente. Confirma siempre con el local antes de pedir.
        </p>
      </div>
    </section>
  );
}
