import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function assertConfigured() {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OPENAI_API_KEY n'est pas configurée sur Vercel.");
    error.statusCode = 503;
    throw error;
  }
}

export function setCommonHeaders(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

export function sendError(res, error) {
  const status = Number(error?.statusCode || error?.status || 500);
  const safeMessage =
    status === 401
      ? "La clé OpenAI est invalide ou n'a pas accès au modèle demandé."
      : status === 429
        ? "La limite d'utilisation OpenAI est atteinte. Vérifiez la facturation ou réessayez plus tard."
        : status >= 500
          ? "Le service IA est temporairement indisponible."
          : error?.message || "Une erreur est survenue.";

  console.error("API error", {
    status,
    name: error?.name,
    message: error?.message,
    code: error?.code,
  });

  res.status(status).json({ error: safeMessage });
}

export function normalizeLanguage(value) {
  return ["fr", "en", "es"].includes(value) ? value : "fr";
}

export function stripDataUrl(data) {
  if (typeof data !== "string") return "";
  const comma = data.indexOf(",");
  return comma >= 0 ? data.slice(comma + 1) : data;
}
