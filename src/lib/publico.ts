// Endpoints públicos del backend (sin token): API Gateway GET /public/{proxy+} -> /api/public/{proxy}
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/** Restricciones que el backend conoce (mismas etiquetas que el resto de la web). */
export const RESTRICCIONES_CON_DATOS = ["Sin Gluten", "Sin Lactosa", "APLV", "Vegano"] as const;

export type Pagina<T> = {
  contenido: T[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
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

async function getJson<T>(ruta: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") query.set(k, String(v));
  });
  const qs = query.toString();
  const res = await fetch(`${API_URL}/public/${ruta}${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

/** Si la restricción no tiene datos en el backend (ej. "Vegetariano") no se envía. */
function filtroRestriccion(restriccion?: string) {
  return restriccion && (RESTRICCIONES_CON_DATOS as readonly string[]).includes(restriccion) ? restriccion : undefined;
}

export function buscarOfertas(f: { restriccion?: string; supermercado?: string; page?: number; size?: number }) {
  return getJson<Pagina<Oferta>>("ofertas", {
    restriccion: filtroRestriccion(f.restriccion),
    supermercado: f.supermercado,
    page: f.page ?? 0,
    size: f.size ?? 12,
  });
}

export function listarTiendas() {
  return getJson<Tienda[]>("ofertas/supermercados");
}

export function buscarLocales(f: { restriccion?: string; nivel?: number; comuna?: string }) {
  return getJson<Pagina<Local>>("locales", {
    restriccion: filtroRestriccion(f.restriccion),
    nivel: f.nivel ?? 3,
    comuna: f.comuna,
    size: 200,
  });
}

export const clp = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
