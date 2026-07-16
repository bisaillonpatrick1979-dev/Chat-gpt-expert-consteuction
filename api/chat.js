import { assertConfigured, normalizeLanguage, openai, sendError, setCommonHeaders } from "./_shared.js";

const MAX_MESSAGES = 24;
const MAX_ATTACHMENTS = 4;
const MAX_ATTACHMENT_CHARS = 5_200_000;

const LANGUAGE_NAMES = {
  fr: "français canadien clair",
  en: "clear professional English",
  es: "español profesional claro",
};

const COUNTRY_CODES = {
  Canada: "CA",
  "United States": "US",
  "États-Unis": "US",
  France: "FR",
  Spain: "ES",
  Espagne: "ES",
  "United Kingdom": "GB",
  "Royaume-Uni": "GB",
  Germany: "DE",
  Allemagne: "DE",
  Italy: "IT",
  Italie: "IT",
  Belgium: "BE",
  Belgique: "BE",
  Switzerland: "CH",
  Suisse: "CH",
  Portugal: "PT",
  Netherlands: "NL",
  "Pays-Bas": "NL",
  Ireland: "IE",
  Irlande: "IE",
  Austria: "AT",
  Autriche: "AT",
  Sweden: "SE",
  Suède: "SE",
  Norway: "NO",
  Norvège: "NO",
  Denmark: "DK",
  Danemark: "DK",
  Finland: "FI",
  Pologne: "PL",
  Poland: "PL",
};

function cleanText(value, max = 18_000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function buildInstructions({ language, location }) {
  const lang = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.fr;
  const city = cleanText(location?.city, 100) || "non précisée";
  const region = cleanText(location?.region, 120) || "non précisée";
  const country = cleanText(location?.country, 100) || "non précisé";

  return `Tu es « ChatGPT Experts Construction », un maître-conseil multidisciplinaire en construction, science du bâtiment, physique et comportement des matériaux, enveloppe du bâtiment, structure, architecture technique, estimation et réglementation.

LANGUE ET LOCALISATION
- Réponds toujours en ${lang}, sauf demande explicite contraire.
- Localisation déclarée : ville ${city}; province, État, département, canton ou région ${region}; pays ${country}.
- Utilise les unités locales, mais pour le Canada et les États-Unis, donne prioritairement pieds, pouces, pieds carrés et unités métriques entre parenthèses lorsque pertinent.
- Donne les prix dans la devise locale. Pour le Canada, donne les prix en dollars canadiens.

EXPERTISE
- Tous les corps de métier : charpente bois/acier, structure, fondations, béton, maçonnerie, toiture, revêtement extérieur, pare-air/pare-vapeur, isolation, fenêtres, portes, plomberie, électricité, gaz, CVC, gypse, finition, planchers, excavation, drainage, soudure, peinture, sécurité de chantier et rénovation.
- Applique la statique, les charges, la dilatation, l'humidité, la diffusion de vapeur, les ponts thermiques, le vent, la neige, le gel-dégel, le feu, l'acoustique, la corrosion, la fatigue et la compatibilité des matériaux.
- Pour un calcul structurel ou un plan pouvant affecter la sécurité, explique les hypothèses et limites. Ne remplace jamais le sceau d'un ingénieur ou architecte lorsque la loi l'exige.

CODES, LOIS ET RESPONSABILITÉ
- Vérifie sur Internet les éditions actuellement adoptées et les amendements applicables avant de donner une exigence précise.
- Couvre le Canada, les États-Unis et l'Europe, mais ne prétends jamais qu'un même code s'applique partout.
- Identifie l'autorité compétente : municipalité, province/État, pays, autorité de sécurité, organisme professionnel ou AHJ.
- Distingue clairement : code modèle, édition adoptée, amendement local, norme technique, guide du fabricant et pratique recommandée.
- Cite les sources officielles ou primaires avec liens lorsque la recherche Web est utilisée.
- Pour le juridique : explique permis, contrats, responsabilité, garantie, santé-sécurité, privilèges de construction et exigences de licence à titre informatif. Précise quand un avocat, inspecteur, ingénieur, architecte ou entrepreneur licencié doit confirmer.
- Ne fabrique jamais un numéro d'article. Si le texte officiel est payant, inaccessible ou incertain, dis-le clairement et donne la meilleure piste officielle.

MÉTHODE DE RÉPONSE
1. Commence par une conclusion directe.
2. Décris ce que tu observes ou les hypothèses.
3. Propose normalement trois solutions :
   - Option A : économique ou réparation minimale;
   - Option B : durable et recommandée;
   - Option C : haut de gamme, reconstruction ou solution maximale.
4. Pour chaque option, indique :
   - matériaux, formats, quantités et pertes;
   - fixations, membranes, solins, adhésifs et accessoires;
   - outils et EPI;
   - étapes de travail;
   - durée;
   - prix des matériaux, main-d'œuvre et total estimatif;
   - avantages, limites, durée de vie et risques.
5. Quand l'utilisateur demande des fournisseurs ou prix, effectue une recherche locale autour de ${city}, ${region}, ${country}; distingue prix vérifiés et estimations.
6. Si une photo ou un document est fourni : analyse visuelle, problèmes probables, gravité, causes, mesures à prendre, solutions et éléments impossibles à confirmer sur image.
7. N'invente pas de dimensions invisibles. Demande ou indique les mesures manquantes.
8. Mets la sécurité avant le coût : structure, électricité, gaz, amiante, plomb, moisissure, excavation, travail en hauteur et incendie.

STYLE
- Réponse pratique de chantier, structurée avec titres et listes.
- Explique les termes techniques simplement.
- Donne plusieurs solutions lorsque cela apporte une vraie valeur.
- Ne surcharge pas la réponse de mises en garde répétitives; regroupe-les dans une section finale concise.`;
}

function attachmentToContent(attachment) {
  const name = cleanText(attachment?.name, 180) || "fichier";
  const mime = cleanText(attachment?.type, 100).toLowerCase();
  const dataUrl = typeof attachment?.dataUrl === "string" ? attachment.dataUrl : "";

  if (!dataUrl.startsWith("data:")) return null;

  if (mime.startsWith("image/")) {
    return {
      type: "input_image",
      image_url: dataUrl,
      detail: "high",
    };
  }

  if (mime === "application/pdf") {
    return {
      type: "input_file",
      filename: name.endsWith(".pdf") ? name : `${name}.pdf`,
      file_data: dataUrl,
    };
  }

  return null;
}

function extractSources(response) {
  const sources = [];
  const seen = new Set();

  for (const item of response?.output || []) {
    if (item?.type !== "message") continue;
    for (const part of item.content || []) {
      for (const annotation of part.annotations || []) {
        const url = annotation?.url || annotation?.url_citation?.url;
        const title = annotation?.title || annotation?.url_citation?.title || url;
        if (url && !seen.has(url)) {
          seen.add(url);
          sources.push({ title, url });
        }
      }
    }
  }

  return sources.slice(0, 12);
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
    const location = req.body?.location || {};
    const messages = Array.isArray(req.body?.messages)
      ? req.body.messages.slice(-MAX_MESSAGES)
      : [];
    const attachments = Array.isArray(req.body?.attachments)
      ? req.body.attachments.slice(0, MAX_ATTACHMENTS)
      : [];

    if (!messages.length) {
      return res.status(400).json({ error: "Aucun message n'a été fourni." });
    }

    const attachmentSize = attachments.reduce(
      (sum, item) => sum + (typeof item?.dataUrl === "string" ? item.dataUrl.length : 0),
      0,
    );
    if (attachmentSize > MAX_ATTACHMENT_CHARS) {
      return res.status(413).json({
        error: "Les pièces jointes sont trop volumineuses. Réduisez la taille totale à environ 3,5 Mo.",
      });
    }

    const input = messages
      .map((message, index) => {
        const role = message?.role === "assistant" ? "assistant" : "user";
        const text = cleanText(message?.content);
        if (!text) return null;

        const isLastUserMessage =
          role === "user" &&
          index === messages.length - 1 &&
          attachments.length > 0;

        if (!isLastUserMessage) {
          return { role, content: text };
        }

        const content = [
          { type: "input_text", text },
          ...attachments.map(attachmentToContent).filter(Boolean),
        ];
        return { role, content };
      })
      .filter(Boolean);

    const country =
      cleanText(location?.countryCode, 2).toUpperCase() ||
      COUNTRY_CODES[cleanText(location?.country, 100)] ||
      undefined;
    const city = cleanText(location?.city, 100) || undefined;
    const region = cleanText(location?.region, 120) || undefined;

    const webTool = {
      type: "web_search",
      search_context_size: "high",
      user_location: {
        type: "approximate",
        ...(country ? { country } : {}),
        ...(city ? { city } : {}),
        ...(region ? { region } : {}),
        timezone: cleanText(location?.timezone, 80) || "America/Edmonton",
      },
    };

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      instructions: buildInstructions({ language, location }),
      input,
      tools: [webTool],
      tool_choice: "auto",
      reasoning: { effort: "medium" },
      max_output_tokens: 10_000,
      store: false,
    });

    const text = response.output_text?.trim();
    if (!text) {
      throw new Error("Le modèle n'a retourné aucun texte.");
    }

    return res.status(200).json({
      text,
      sources: extractSources(response),
      model: response.model,
    });
  } catch (error) {
    return sendError(res, error);
  }
}
