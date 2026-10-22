import { fechaRespaldo } from "@/lib/publico";

/** Aviso cuando el backend (AWS Learner Lab) está apagado y se muestran los últimos datos publicados. */
export default function AvisoRespaldo({ fecha }: { fecha?: string }) {
  if (!fecha) return null;
  return (
    <p className="mb-6 text-sm text-[#8B6914] bg-[#8B6914]/10 rounded-xl px-4 py-3">
      El servidor está en pausa en este momento. Te mostramos la última actualización disponible, del{" "}
      <strong>{fechaRespaldo(fecha)}</strong>; los precios pueden haber cambiado.
    </p>
  );
}
