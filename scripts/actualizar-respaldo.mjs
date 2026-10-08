// Descarga ofertas, tiendas y locales de la API en vivo y los guarda en public/datos/respaldo.json.
// El sitio usa ese archivo cuando el backend (AWS Learner Lab) está apagado.
// Si la API no responde, no toca el respaldo existente.
//
// Uso: node scripts/actualizar-respaldo.mjs   (API_URL opcional; por defecto NEXT_PUBLIC_API_URL de .env.local)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function apiUrl() {
  if (process.env.API_URL) return process.env.API_URL;
  try {
    const env = readFileSync(join(raiz, ".env.local"), "utf8");
    const m = env.match(/^NEXT_PUBLIC_API_URL=(.+)$/m);
    if (m) return m[1].trim();
  } catch {}
  return "https://d8ae57sdjk.execute-api.us-east-1.amazonaws.com";
}

const API = apiUrl();

async function get(ruta) {
  const res = await fetch(`${API}/public/${ruta}`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${ruta}`);
  return res.json();
}

async function todasLasPaginas(ruta, tamano) {
  const items = [];
  for (let page = 0; ; page++) {
    const p = await get(`${ruta}${ruta.includes("?") ? "&" : "?"}page=${page}&size=${tamano}`);
    items.push(...p.contenido);
    if (page + 1 >= p.totalPaginas) return items;
  }
}

const [ofertas, tiendas, locales] = await Promise.all([
  todasLasPaginas("ofertas", 100),
  get("ofertas/supermercados"),
  todasLasPaginas("locales", 200),
]);

if (ofertas.length === 0 && locales.length === 0) {
  console.error("La API respondió sin datos: no se actualiza el respaldo.");
  process.exit(1);
}

const destino = join(raiz, "public", "datos", "respaldo.json");
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, JSON.stringify({ generadoEn: new Date().toISOString(), ofertas, tiendas, locales }));
console.log(`Respaldo actualizado: ${ofertas.length} ofertas, ${tiendas.length} tiendas, ${locales.length} locales -> ${destino}`);
