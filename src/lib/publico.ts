// Endpoints públicos del backend (sin token): API Gateway GET /public/{proxy+} -> /api/public/{proxy}
//
// Modo respaldo: el backend corre en AWS Academy Learner Lab, que se apaga al cerrar cada sesión. Si la API no
// responde, se usan los datos de /datos/*.json (última actualización publicada junto al sitio, ver
// scripts/actualizar-respaldo.mjs) y se aplican los mismos filtros en el navegador.
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const TIMEOUT_MS = 6000;

/** Restricciones que el backend conoce (mismas etiquetas que el resto de la web). */
export const RESTRICCIONES_CON_DATOS = ["Sin Gluten", "Sin Lactosa", "APLV", "Vegano"] as const;

export type Pagina<T> = {
  contenido: T[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
  /** Fecha ISO de los datos de respaldo; ausente cuando vienen en vivo de la API. */
  respaldo?: string;
};

export type Oferta = {
  id: number;
  supermercado: string;
  supermercadoNombre: string;
  sku: string;
  nombre: string;
  marca: string | null;
  categoria: string | null;
  restricciones: string[];
  precioNormal: number;
  precioOferta: number;
  porcentajeDescuento: number;
  urlProducto: string;
  urlImagen: string | null;
  actualizadoEn: string | null;
};

export type Tienda = { codigo: string; nombre: string; ofertas: number };

export type Local = {
  id: string;
  nombre: string;
  tipo: string | null;
  comuna: string | null;
  direccion: string | null;
  latitud: number;
  longitud: number;
  restricciones: string[];
  nivel: number;
  nivelNombre: string;
  nivelesPorRestriccion: Record<string, number>;
  sitioWeb: string | null;
  telefono: string | null;
  horario: string | null;
  urlFuente: string | null;
  atribucion: string | null;
};

type Respaldo = { generadoEn: string; ofertas: Oferta[]; tiendas: Tienda[]; locales: Local[] };

async function getJson<T>(ruta: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") query.set(k, String(v));
  });
  const qs = query.toString();
  const res = await fetch(`${API_URL}/public/${ruta}${qs ? `?${qs}` : ""}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Respaldo ────────────────────────────────────────────────────────────────
let respaldoPromesa: Promise<Respaldo> | null = null;

function cargarRespaldo(): Promise<Respaldo> {
  respaldoPromesa ??= fetch("/datos/respaldo.json").then((r) => {
    if (!r.ok) throw new Error("Sin datos de respaldo");
    return r.json() as Promise<Respaldo>;
  });
  return respaldoPromesa;
}

/** Si la API falló una vez en esta visita, no se vuelve a esperar el timeout en cada filtro. */
let apiCaida = false;

async function conRespaldo<T>(enVivo: () => Promise<T>, local: (r: Respaldo) => T): Promise<T> {
  if (!apiCaida) {
    try {
      return await enVivo();
    } catch {
      apiCaida = true;
    }
  }
  return local(await cargarRespaldo());
}

function paginar<T>(items: T[], page: number, size: number, respaldo: string): Pagina<T> {
  return {
    contenido: items.slice(page * size, page * size + size),
    pagina: page,
    tamano: size,
    totalElementos: items.length,
    totalPaginas: Math.ceil(items.length / size),
    respaldo,
  };
}

/** Si la restricción no tiene datos en el backend (ej. "Vegetariano") no se envía. */
function filtroRestriccion(restriccion?: string) {
  return restriccion && (RESTRICCIONES_CON_DATOS as readonly string[]).includes(restriccion) ? restriccion : undefined;
}

const sinTildes = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// ── API pública ─────────────────────────────────────────────────────────────
export function buscarOfertas(f: { restriccion?: string; supermercado?: string; page?: number; size?: number }) {
  const restriccion = filtroRestriccion(f.restriccion);
  const page = f.page ?? 0;
  const size = f.size ?? 12;
  return conRespaldo(
    () => getJson<Pagina<Oferta>>("ofertas", { restriccion, supermercado: f.supermercado, page, size }),
    (r) =>
      paginar(
        r.ofertas.filter(
          (o) => (!restriccion || o.restricciones.includes(restriccion)) && (!f.supermercado || o.supermercado === f.supermercado)
        ),
        page,
        size,
        r.generadoEn
      )
  );
}

export function listarTiendas() {
  return conRespaldo(
    () => getJson<Tienda[]>("ofertas/supermercados"),
    (r) => r.tiendas
  );
}

export function buscarLocales(f: { restriccion?: string; nivel?: number; comuna?: string }) {
  const restriccion = filtroRestriccion(f.restriccion);
  const nivel = f.nivel ?? 3;
  return conRespaldo(
    () => getJson<Pagina<Local>>("locales", { restriccion, nivel, comuna: f.comuna, size: 200 }),
    (r) =>
      paginar(
        r.locales
          .filter((l) => {
            const nivelLocal = restriccion ? l.nivelesPorRestriccion[restriccion] : l.nivel;
            return nivelLocal !== undefined && nivelLocal <= nivel;
          })
          .filter((l) => !f.comuna || sinTildes(l.comuna ?? "").includes(sinTildes(f.comuna)))
          .map((l) => (restriccion ? { ...l, nivel: l.nivelesPorRestriccion[restriccion], nivelNombre: nombreNivel(l.nivelesPorRestriccion[restriccion]) } : l)),
        0,
        200,
        r.generadoEn
      )
  );
}

const nombreNivel = (n: number) => ({ 1: "Exclusivo / Certificado", 2: "Opción Segura", 3: "Opción Básica" })[n] ?? "";

/** Locales con el formato de /user/locales, para cuando el backend no responde. */
export async function localesDeRespaldo() {
  const r = await cargarRespaldo();
  return r.locales.map((l) => ({
    id: l.id,
    nombre: l.nombre,
    comuna: l.comuna ?? "",
    restricciones: l.restricciones,
    nivel: l.nivel,
    nivelNombre: l.nivelNombre,
  }));
}

export const clp = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export const fechaRespaldo = (iso: string) =>
  new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeStyle: "short", timeZone: "America/Santiago" }).format(
    new Date(iso)
  );
