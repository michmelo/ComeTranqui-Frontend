"use client";

import { useEffect, useState } from "react";
import AvisoRespaldo from "./AvisoRespaldo";
import {
  buscarOfertas,
  clp,
  listarTiendas,
  RESTRICCIONES_CON_DATOS,
  type Oferta,
  type Tienda,
} from "@/lib/publico";

const TAMANO = 12;

function TarjetaOferta({ o }: { o: Oferta }) {
  return (
    <a
      href={o.urlProducto}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white/80 rounded-2xl border border-[#D1C9C5]/60 overflow-hidden hover:shadow-xl hover:border-[#C3A69A] transition-all duration-300"
    >
      <div className="relative h-40 bg-[#FAF8F5] flex items-center justify-center">
        {o.urlImagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={o.urlImagen} alt={o.nombre} loading="lazy" className="h-full w-full object-contain p-3" />
        ) : (
          <span className="text-5xl opacity-40">🛒</span>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#A46C54] text-white text-xs font-bold">
          -{o.porcentajeDescuento}%
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-[#563B2D] text-xs font-semibold border border-[#D1C9C5]/60">
          {o.supermercadoNombre}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        {o.marca && <p className="text-xs text-[#563B2D]/50 mb-0.5">{o.marca}</p>}
        <h3 className="text-sm font-semibold text-[#563B2D] leading-snug line-clamp-2 mb-2">{o.nombre}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {o.restricciones.map((r) => (
            <span key={r} className="px-2 py-0.5 rounded-full bg-[#C3A69A]/20 text-[#563B2D] text-[11px] font-semibold">
              {r}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xl font-extrabold text-[#A46C54]">{clp(o.precioOferta)}</p>
            <p className="text-xs text-[#563B2D]/40 line-through">{clp(o.precioNormal)}</p>
          </div>
          <span className="text-xs font-bold text-[#563B2D]/60 group-hover:text-[#A46C54] transition-colors">
            Ver en tienda →
          </span>
        </div>
      </div>
    </a>
  );
}

export default function OfertasSection({ restriccionInicial }: { restriccionInicial?: string }) {
  const [restriccion, setRestriccion] = useState(restriccionInicial ?? "");
  const [tienda, setTienda] = useState("");
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  // Resultado asociado al filtro que lo produjo: si no coincide con el filtro actual, está cargando
  const [resultado, setResultado] = useState<{
    clave: string;
    ofertas: Oferta[];
    pagina: number;
    total: number;
    error: string | null;
    respaldo?: string;
  } | null>(null);
  const [cargandoMas, setCargandoMas] = useState(false);

  // El buscador del hero cambia la restricción desde afuera (ajuste de estado durante el render)
  const [inicialPrevia, setInicialPrevia] = useState(restriccionInicial);
  if (restriccionInicial !== inicialPrevia) {
    setInicialPrevia(restriccionInicial);
    if (restriccionInicial !== undefined) setRestriccion(restriccionInicial);
  }

  useEffect(() => {
    listarTiendas().then(setTiendas).catch(() => setTiendas([]));
  }, []);

  const clave = `${restriccion}|${tienda}`;

  // Nuevo filtro: vuelve a la primera página
  useEffect(() => {
    let vigente = true;
    buscarOfertas({ restriccion, supermercado: tienda, page: 0, size: TAMANO })
      .then(
        (p) =>
          vigente &&
          setResultado({ clave, ofertas: p.contenido, pagina: 0, total: p.totalElementos, error: null, respaldo: p.respaldo })
      )
      .catch(() =>
        vigente &&
        setResultado({ clave, ofertas: [], pagina: 0, total: 0, error: "No pudimos cargar las ofertas. Intenta de nuevo en unos minutos." })
      );
    return () => {
      vigente = false;
    };
  }, [clave, restriccion, tienda]);

  const vigente = resultado?.clave === clave ? resultado : null;
  const ofertas = vigente?.ofertas ?? [];
  const total = vigente?.total ?? 0;
  const error = vigente?.error ?? null;
  const cargando = !vigente || cargandoMas;

  const verMas = () => {
    if (!vigente) return;
    setCargandoMas(true);
    buscarOfertas({ restriccion, supermercado: tienda, page: vigente.pagina + 1, size: TAMANO })
      .then((p) =>
        setResultado((r) => (r && r.clave === clave ? { ...r, ofertas: [...r.ofertas, ...p.contenido], pagina: p.pagina } : r))
      )
      .catch(() => setResultado((r) => (r ? { ...r, error: "No pudimos cargar más ofertas." } : r)))
      .finally(() => setCargandoMas(false));
  };

  const sinDatos = restriccion !== "" && !(RESTRICCIONES_CON_DATOS as readonly string[]).includes(restriccion);

  return (
    <section id="ofertas" className="py-24 px-6 bg-[#FAF8F5]/60">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-[#C3A69A]/20 text-xs font-bold text-[#A46C54] uppercase tracking-widest mb-4">
            Buscador de ofertas
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold" style={{ color: "#563B2D" }}>
            Ofertas aptas <span style={{ color: "#A46C54" }}>para ti</span>
          </h2>
          <p className="text-[#563B2D]/55 mt-4 max-w-2xl mx-auto">
            Descuentos de supermercados y tiendas especializadas, actualizados todas las mañanas.
            {total > 0 && ` ${total} ofertas vigentes${tiendas.length ? ` en ${tiendas.length} tiendas` : ""}.`}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2 flex-1">
            {["", ...RESTRICCIONES_CON_DATOS].map((r) => (
              <button
                key={r || "todas"}
                id={`filtro-oferta-${(r || "todas").replace(" ", "-").toLowerCase()}`}
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
          <select
            id="filtro-tienda"
            value={tienda}
            onChange={(e) => setTienda(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#D1C9C5] text-[#563B2D] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A46C54]/30"
          >
            <option value="">Todas las tiendas</option>
            {tiendas.map((t) => (
              <option key={t.codigo} value={t.codigo}>
                {t.nombre} ({t.ofertas})
              </option>
            ))}
          </select>
        </div>

        {sinDatos && (
          <p className="mb-6 text-sm text-[#8B6914] bg-[#8B6914]/10 rounded-xl px-4 py-3">
            Aún no tenemos ofertas clasificadas como &quot;{restriccion}&quot;. Te mostramos todas las ofertas.
          </p>
        )}
        <AvisoRespaldo fecha={vigente?.respaldo} />
        {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

        {!error && ofertas.length === 0 && !cargando && (
          <p className="text-center text-[#563B2D]/50 py-16">No hay ofertas para este filtro por ahora.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ofertas.map((o) => (
            <TarjetaOferta key={o.id} o={o} />
          ))}
        </div>

        {cargando && <p className="text-center text-[#563B2D]/50 text-sm mt-8">Cargando ofertas…</p>}

        {!cargando && ofertas.length < total && (
          <div className="text-center mt-10">
            <button
              id="btn-ver-mas-ofertas"
              onClick={verMas}
              className="px-8 py-3 bg-white border-2 border-[#A46C54] text-[#A46C54] font-bold rounded-xl hover:bg-[#A46C54] hover:text-white transition-all duration-300 text-sm"
            >
              Ver más ofertas
            </button>
          </div>
        )}

        <p className="mt-10 text-xs text-[#563B2D]/45 text-center max-w-3xl mx-auto leading-relaxed">
          Precios referenciales recopilados automáticamente desde los sitios de cada tienda; pueden cambiar.
          La clasificación por restricción se basa en lo que declara la tienda: revisa siempre el etiquetado y
          los sellos del producto antes de consumirlo.
        </p>
      </div>
    </section>
  );
}
