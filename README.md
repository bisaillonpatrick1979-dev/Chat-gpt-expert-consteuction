# ChatGPT Experts Construction

Application Web mobile-first reliée à l'API OpenAI et déployée sur Vercel.

## Fonctions incluses

- Assistant expert en construction, science du bâtiment et physique des matériaux
- Recherche Web avec localisation (pays, province/État/région et ville)
- Canada, États-Unis et plusieurs pays européens
- Français, anglais et espagnol
- Analyse d'images et de PDF
- Dictée vocale avec OpenAI Speech-to-Text
- Lecture vocale avec OpenAI Text-to-Speech
- Solutions comparées, listes de matériaux, estimation et fournisseurs locaux
- Historique local dans le navigateur

## Variables Vercel

Obligatoire :

- `OPENAI_API_KEY`

Optionnelles :

- `OPENAI_MODEL` (défaut : `gpt-5.6`)
- `OPENAI_TTS_MODEL` (défaut : `gpt-4o-mini-tts`)
- `OPENAI_TTS_VOICE` (défaut : `cedar`)
- `OPENAI_TRANSCRIBE_MODEL` (défaut : `gpt-4o-mini-transcribe`)

## Développement local

```bash
npm install
vercel dev
```

Ne jamais enregistrer une clé API dans GitHub.
