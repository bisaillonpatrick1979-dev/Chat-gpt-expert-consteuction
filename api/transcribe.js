import { toFile } from "openai";
import { assertConfigured, normalizeLanguage, openai, sendError, setCommonHeaders, stripDataUrl } from "./_shared.js";

const MIME_EXTENSIONS = {
  "audio/webm": "webm",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
};

export default async function handler(req, res) {
  setCommonHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non permise." });
  }

  try {
    assertConfigured();

    const language = normalizeLanguage(req.body?.language);
    const mimeType = String(req.body?.mimeType || "audio/webm").split(";")[0];
    const base64 = stripDataUrl(req.body?.dataUrl);

    if (!base64) {
      return res.status(400).json({ error: "Aucun enregistrement audio reçu." });
    }

    if (base64.length > 8_000_000) {
      return res.status(413).json({ error: "L'enregistrement est trop long." });
    }

    const buffer = Buffer.from(base64, "base64");
    const extension = MIME_EXTENSIONS[mimeType] || "webm";
    const file = await toFile(buffer, `dictée.${extension}`, { type: mimeType });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe",
      language,
      response_format: "json",
      prompt:
        language === "fr"
          ? "Contexte : construction, revêtement extérieur, toiture, charpente, mesures en pieds et pouces, matériaux et codes du bâtiment."
          : undefined,
    });

    return res.status(200).json({ text: transcription.text?.trim() || "" });
  } catch (error) {
    return sendError(res, error);
  }
}
