export const FB_PIXEL_ID = "294394365539566";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Evento padrão do Meta (ex: "Lead", "PageView"). */
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined") window.fbq?.("track", event, params);
}

/** Evento personalizado do Meta (ex: "AbriuFormulario"). */
export function trackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined") window.fbq?.("trackCustom", event, params);
}
