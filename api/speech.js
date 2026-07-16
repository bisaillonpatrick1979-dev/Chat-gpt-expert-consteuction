import { assertConfigured, normalizeLanguage, openai, sendError, setCommonHeaders } from "./_shared.js";

const VOICE_INSTRUCTIONS = {
  fr: "Parle en français canadien naturel, avec une voix calme, claire et professionnelle. Ne lis pas les symboles Markdown.",
  en: "Speak in clear, natural professional English. Do not read Markdown symbols aloud.",
  es: "Habla en español claro, natural y profesional. No leas los símbolos de Markdown.",
};

function cleanForSpeech(text) {
  return String(text || "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*#>`_~[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

export default async function handler(req, res) {
  setCommonHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non permise." });
  }

  try {
    assertConfigured();
    const language = normalizeLanguage(req.body?.language);
    const input = cleanForSpeech(req.body?.text);

    if (!input) {
      return res.status(400).json({ error: "Aucun texte à lire." });
    }

    const audio = await openai.audio.speech.create({
      model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
      voice: process.env.OPENAI_TTS_VOICE || "cedar",
      input,
      instructions: VOICE_INSTRUCTIONS[language],
      response_format: "mp3",
    });

    const buffer = Buffer.from(await audio.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    return sendError(res, error);
  }
}
