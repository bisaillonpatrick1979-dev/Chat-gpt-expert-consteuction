import { setCommonHeaders } from "./_shared.js";

export default function handler(req, res) {
  setCommonHeaders(res);
  return res.status(200).json({
    ok: true,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || "gpt-5.6",
  });
}
