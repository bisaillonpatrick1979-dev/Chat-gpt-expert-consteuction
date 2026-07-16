const $ = (selector) => document.querySelector(selector);

const E = {
  status: $("#apiStatus"),
  statusText: $("#apiStatusText"),
  settingsBtn: $("#settingsButton"),
  contextBtn: $("#contextButton"),
  welcomeContextBtn: $("#welcomeContextButton"),
  contextLanguage: $("#contextLanguage"),
  contextLocation: $("#contextLocation"),
  panel: $("#settingsPanel"),
  close: $("#closeSettingsButton"),
  save: $("#saveSettingsButton"),
  newChat: $("#newChatButton"),
  lang: $("#languageSelect"),
  country: $("#countrySelect"),
  regionSelect: $("#regionSelect"),
  regionInput: $("#regionInput"),
  regionLabel: $("#regionLabel"),
  city: $("#cityInput"),
  autoVoice: $("#autoVoiceToggle"),
  location: $("#locationSummary"),
  activeContextValue: $("#activeContextValue"),
  welcomeContextValue: $("#welcomeContextValue"),
  chat: $("#chatArea"),
  welcome: $("#welcomeCard"),
  messages: $("#messages"),
  input: $("#messageInput"),
  send: $("#sendButton"),
  attach: $("#attachButton"),
  file: $("#fileInput"),
  tray: $("#attachmentTray"),
  mic: $("#micButton"),
  template: $("#messageTemplate"),
};

const COPY = {
  fr: {
    online: "IA prête",
    offline: "Configuration requise",
    checking: "Vérification…",
    empty: "Écrivez une question ou joignez une photo.",
    error: "Impossible d'obtenir une réponse.",
    saved: "Langue et emplacement appliqués.",
    cleared: "Conversation effacée.",
    copied: "Réponse copiée.",
    transcribing: "Transcription en cours…",
    file: "Images JPG, PNG, WebP ou PDF seulement, maximum total d'environ 3 Mo.",
    mic: "Autorisez le microphone pour utiliser la dictée.",
    audio: "Impossible de générer la voix.",
    sources: "Sources consultées",
    placeholder: "Décrivez votre projet ou votre problème…",
    note: "Vérifiez les exigences importantes auprès de l'autorité locale ou d'un professionnel licencié.",
    attachPrompt: "Analyse en détail les fichiers joints et réponds à ma question.",
    settingsEyebrow: "Contexte local",
    settingsTitle: "Langue et emplacement",
    settingsIntro: "Ces choix déterminent la langue des réponses, les codes du bâtiment applicables et les fournisseurs recherchés près de vous.",
    activeContextLabel: "Contexte utilisé par l’IA",
    languageLabel: "Langue",
    countryLabel: "Pays",
    cityLabel: "Ville",
    jurisdictionNote: "L’IA utilisera automatiquement ce contexte pour vérifier les codes, permis, règles locales, prix et fournisseurs.",
    autoVoiceTitle: "Réponse vocale automatique",
    autoVoiceDescription: "Lire chaque nouvelle réponse à voix haute",
    saveSettings: "Enregistrer et appliquer",
    welcomeEyebrow: "Assistant technique multilingue",
    welcomeTitle: "Votre expert construction, partout sur le chantier.",
    welcomeText: "Codes du bâtiment, analyse de photos et plans PDF, physique des matériaux, estimation, solutions comparées et recherche de fournisseurs locaux.",
    welcomeContextLabel: "Contexte actif",
    welcomeContextAction: "Modifier",
    capPhotoTitle: "Analyser un problème",
    capPhotoText: "Photo, cause probable et réparation",
    capCodeTitle: "Vérifier le code",
    capCodeText: "Règles locales et sources officielles",
    capPriceTitle: "Estimer un projet",
    capPriceText: "Matériaux, main-d'œuvre et fournisseurs",
    newChat: "Nouvelle conversation",
    changeContext: "Changer la langue et l’emplacement",
  },
  en: {
    online: "AI ready",
    offline: "Configuration required",
    checking: "Checking…",
    empty: "Enter a question or attach a photo.",
    error: "Unable to get a response.",
    saved: "Language and location applied.",
    cleared: "Conversation cleared.",
    copied: "Response copied.",
    transcribing: "Transcribing…",
    file: "JPG, PNG, WebP images or PDF only, about 3 MB total.",
    mic: "Allow microphone access to use dictation.",
    audio: "Unable to generate speech.",
    sources: "Sources consulted",
    placeholder: "Describe your project or problem…",
    note: "Confirm important requirements with the local authority or a licensed professional.",
    attachPrompt: "Analyze the attached files in detail and answer my question.",
    settingsEyebrow: "Local context",
    settingsTitle: "Language and location",
    settingsIntro: "These choices determine the response language, applicable building codes, and nearby suppliers.",
    activeContextLabel: "Context used by the AI",
    languageLabel: "Language",
    countryLabel: "Country",
    cityLabel: "City",
    jurisdictionNote: "The AI will automatically use this context to verify codes, permits, local rules, prices, and suppliers.",
    autoVoiceTitle: "Automatic spoken responses",
    autoVoiceDescription: "Read every new answer aloud",
    saveSettings: "Save and apply",
    welcomeEyebrow: "Multilingual technical assistant",
    welcomeTitle: "Your construction expert, wherever the job takes you.",
    welcomeText: "Building codes, photo and PDF plan analysis, material physics, estimating, compared solutions, and local supplier research.",
    welcomeContextLabel: "Active context",
    welcomeContextAction: "Change",
    capPhotoTitle: "Analyze a problem",
    capPhotoText: "Photo, probable cause, and repair",
    capCodeTitle: "Check the code",
    capCodeText: "Local rules and official sources",
    capPriceTitle: "Estimate a project",
    capPriceText: "Materials, labour, and suppliers",
    newChat: "New conversation",
    changeContext: "Change language and location",
  },
  es: {
    online: "IA lista",
    offline: "Configuración requerida",
    checking: "Verificando…",
    empty: "Escriba una pregunta o adjunte una foto.",
    error: "No se pudo obtener una respuesta.",
    saved: "Idioma y ubicación aplicados.",
    cleared: "Conversación borrada.",
    copied: "Respuesta copiada.",
    transcribing: "Transcribiendo…",
    file: "Solo JPG, PNG, WebP o PDF, aproximadamente 3 MB en total.",
    mic: "Autorice el micrófono para usar el dictado.",
    audio: "No se pudo generar la voz.",
    sources: "Fuentes consultadas",
    placeholder: "Describa su proyecto o problema…",
    note: "Confirme los requisitos importantes con la autoridad local o un profesional autorizado.",
    attachPrompt: "Analiza detalladamente los archivos adjuntos y responde a mi pregunta.",
    settingsEyebrow: "Contexto local",
    settingsTitle: "Idioma y ubicación",
    settingsIntro: "Estas opciones determinan el idioma de las respuestas, los códigos aplicables y los proveedores cercanos.",
    activeContextLabel: "Contexto utilizado por la IA",
    languageLabel: "Idioma",
    countryLabel: "País",
    cityLabel: "Ciudad",
    jurisdictionNote: "La IA utilizará automáticamente este contexto para verificar códigos, permisos, reglas locales, precios y proveedores.",
    autoVoiceTitle: "Respuesta de voz automática",
    autoVoiceDescription: "Leer cada respuesta nueva en voz alta",
    saveSettings: "Guardar y aplicar",
    welcomeEyebrow: "Asistente técnico multilingüe",
    welcomeTitle: "Su experto en construcción, dondequiera que esté la obra.",
    welcomeText: "Códigos de construcción, análisis de fotos y planos PDF, física de materiales, estimaciones, soluciones comparadas y proveedores locales.",
    welcomeContextLabel: "Contexto activo",
    welcomeContextAction: "Cambiar",
    capPhotoTitle: "Analizar un problema",
    capPhotoText: "Foto, causa probable y reparación",
    capCodeTitle: "Verificar el código",
    capCodeText: "Reglas locales y fuentes oficiales",
    capPriceTitle: "Estimar un proyecto",
    capPriceText: "Materiales, mano de obra y proveedores",
    newChat: "Nueva conversación",
    changeContext: "Cambiar idioma y ubicación",
  },
};

const LANG_NAMES = {
  fr: { fr: "Français", en: "English", es: "Español" },
  en: { fr: "French", en: "English", es: "Spanish" },
  es: { fr: "Francés", en: "Inglés", es: "Español" },
};

const COUNTRIES = [
  { code: "CA", value: "Canada", names: { fr: "Canada", en: "Canada", es: "Canadá" } },
  { code: "US", value: "United States", names: { fr: "États-Unis", en: "United States", es: "Estados Unidos" } },
  { code: "FR", value: "France", names: { fr: "France", en: "France", es: "Francia" } },
  { code: "ES", value: "Spain", names: { fr: "Espagne", en: "Spain", es: "España" } },
  { code: "GB", value: "United Kingdom", names: { fr: "Royaume-Uni", en: "United Kingdom", es: "Reino Unido" } },
  { code: "DE", value: "Germany", names: { fr: "Allemagne", en: "Germany", es: "Alemania" } },
  { code: "IT", value: "Italy", names: { fr: "Italie", en: "Italy", es: "Italia" } },
  { code: "BE", value: "Belgium", names: { fr: "Belgique", en: "Belgium", es: "Bélgica" } },
  { code: "CH", value: "Switzerland", names: { fr: "Suisse", en: "Switzerland", es: "Suiza" } },
  { code: "PT", value: "Portugal", names: { fr: "Portugal", en: "Portugal", es: "Portugal" } },
  { code: "NL", value: "Netherlands", names: { fr: "Pays-Bas", en: "Netherlands", es: "Países Bajos" } },
  { code: "IE", value: "Ireland", names: { fr: "Irlande", en: "Ireland", es: "Irlanda" } },
  { code: "AT", value: "Austria", names: { fr: "Autriche", en: "Austria", es: "Austria" } },
  { code: "SE", value: "Sweden", names: { fr: "Suède", en: "Sweden", es: "Suecia" } },
  { code: "NO", value: "Norway", names: { fr: "Norvège", en: "Norway", es: "Noruega" } },
  { code: "DK", value: "Denmark", names: { fr: "Danemark", en: "Denmark", es: "Dinamarca" } },
  { code: "FI", value: "Finland", names: { fr: "Finlande", en: "Finland", es: "Finlandia" } },
  { code: "PL", value: "Poland", names: { fr: "Pologne", en: "Poland", es: "Polonia" } },
];

const ADMIN_AREAS = {
  CA: {
    labels: { fr: "Province ou territoire", en: "Province or territory", es: "Provincia o territorio" },
    items: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"],
  },
  US: {
    labels: { fr: "État ou district", en: "State or district", es: "Estado o distrito" },
    items: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
  },
  FR: {
    labels: { fr: "Région", en: "Region", es: "Región" },
    items: ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d’Azur", "Guadeloupe", "Guyane", "Martinique", "La Réunion", "Mayotte"],
  },
  ES: {
    labels: { fr: "Communauté autonome", en: "Autonomous community", es: "Comunidad autónoma" },
    items: ["Andalucía", "Aragón", "Asturias", "Illes Balears", "Canarias", "Cantabria", "Castilla-La Mancha", "Castilla y León", "Cataluña", "Comunitat Valenciana", "Extremadura", "Galicia", "Comunidad de Madrid", "Región de Murcia", "Navarra", "País Vasco", "La Rioja", "Ceuta", "Melilla"],
  },
  GB: {
    labels: { fr: "Nation", en: "Nation", es: "Nación" },
    items: ["England", "Scotland", "Wales", "Northern Ireland"],
  },
  DE: {
    labels: { fr: "Land (État fédéré)", en: "Federal state (Land)", es: "Estado federado (Land)" },
    items: ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"],
  },
  IT: {
    labels: { fr: "Région", en: "Region", es: "Región" },
    items: ["Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "Trentino-Alto Adige/Südtirol", "Umbria", "Valle d’Aosta/Vallée d’Aoste", "Veneto"],
  },
  BE: {
    labels: { fr: "Région", en: "Region", es: "Región" },
    items: ["Brussels-Capital Region", "Flemish Region", "Walloon Region"],
  },
  CH: {
    labels: { fr: "Canton", en: "Canton", es: "Cantón" },
    items: ["Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", "Basel-Stadt", "Bern", "Fribourg", "Genève", "Glarus", "Graubünden", "Jura", "Luzern", "Neuchâtel", "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau", "Ticino", "Uri", "Valais", "Vaud", "Zug", "Zürich"],
  },
  PT: {
    labels: { fr: "District ou région autonome", en: "District or autonomous region", es: "Distrito o región autónoma" },
    items: ["Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu", "Açores", "Madeira"],
  },
  NL: {
    labels: { fr: "Province", en: "Province", es: "Provincia" },
    items: ["Drenthe", "Flevoland", "Fryslân", "Gelderland", "Groningen", "Limburg", "Noord-Brabant", "Noord-Holland", "Overijssel", "Utrecht", "Zeeland", "Zuid-Holland"],
  },
  IE: {
    labels: { fr: "Comté", en: "County", es: "Condado" },
    items: ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"],
  },
  AT: {
    labels: { fr: "Land (État fédéré)", en: "Federal state (Land)", es: "Estado federado (Land)" },
    items: ["Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich", "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien"],
  },
  SE: {
    labels: { fr: "Comté (län)", en: "County (län)", es: "Condado (län)" },
    items: ["Blekinge", "Dalarna", "Gotland", "Gävleborg", "Halland", "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Skåne", "Stockholm", "Södermanland", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland", "Örebro", "Östergötland"],
  },
  NO: {
    labels: { fr: "Comté (fylke)", en: "County (fylke)", es: "Condado (fylke)" },
    items: ["Agder", "Akershus", "Buskerud", "Finnmark", "Innlandet", "Møre og Romsdal", "Nordland", "Oslo", "Rogaland", "Telemark", "Troms", "Trøndelag", "Vestfold", "Vestland", "Østfold"],
  },
  DK: {
    labels: { fr: "Région", en: "Region", es: "Región" },
    items: ["Capital Region of Denmark", "Central Denmark Region", "North Denmark Region", "Region Zealand", "Region of Southern Denmark"],
  },
  FI: {
    labels: { fr: "Région", en: "Region", es: "Región" },
    items: ["Åland", "Central Finland", "Central Ostrobothnia", "Kainuu", "Kanta-Häme", "Kymenlaakso", "Lapland", "North Karelia", "North Ostrobothnia", "North Savo", "Ostrobothnia", "Päijät-Häme", "Pirkanmaa", "Satakunta", "South Karelia", "South Ostrobothnia", "South Savo", "Southwest Finland", "Uusimaa"],
  },
  PL: {
    labels: { fr: "Voïvodie", en: "Voivodeship", es: "Voivodato" },
    items: ["Dolnośląskie", "Kujawsko-Pomorskie", "Lubelskie", "Lubuskie", "Łódzkie", "Małopolskie", "Mazowieckie", "Opolskie", "Podkarpackie", "Podlaskie", "Pomorskie", "Śląskie", "Świętokrzyskie", "Warmińsko-Mazurskie", "Wielkopolskie", "Zachodniopomorskie"],
  },
};

const CA_ABBREVIATIONS = {
  Alberta: "AB", "British Columbia": "BC", Manitoba: "MB", "New Brunswick": "NB", "Newfoundland and Labrador": "NL", "Northwest Territories": "NT", "Nova Scotia": "NS", Nunavut: "NU", Ontario: "ON", "Prince Edward Island": "PE", Quebec: "QC", Saskatchewan: "SK", Yukon: "YT",
};
const US_ABBREVIATIONS = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};

const defaults = {
  language: "fr",
  country: "Canada",
  countryCode: "CA",
  region: "Alberta",
  city: "Calgary",
  autoVoice: false,
};

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const state = {
  settings: { ...defaults, ...load("cec-settings-v1", defaults) },
  messages: load("cec-messages-v1", []),
  attachments: [],
  busy: false,
  recorder: null,
  chunks: [],
  audio: null,
};

const tr = (key, language = state.settings.language) => COPY[language]?.[key] || COPY.fr[key] || key;
const saveLocal = () => {
  localStorage.setItem("cec-settings-v1", JSON.stringify(state.settings));
  localStorage.setItem("cec-messages-v1", JSON.stringify(state.messages.slice(-24)));
};

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function inline(value) {
  return value
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function markdown(text) {
  const output = [];
  let list = "";
  const closeList = () => {
    if (list) {
      output.push(`</${list}>`);
      list = "";
    }
  };

  for (const raw of escapeHtml(text).split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      closeList();
      output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
      continue;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      const required = unordered ? "ul" : "ol";
      if (list !== required) {
        closeList();
        list = required;
        output.push(`<${list}>`);
      }
      output.push(`<li>${inline((unordered || ordered)[1])}</li>`);
      continue;
    }
    closeList();
    output.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return output.join("");
}

function toast(message) {
  let element = $(".toast");
  if (!element) {
    element = document.createElement("div");
    element.className = "toast";
    document.body.appendChild(element);
  }
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 2600);
}

function resize() {
  E.input.style.height = "auto";
  E.input.style.height = `${Math.min(E.input.scrollHeight, 180)}px`;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    E.chat.scrollTop = E.chat.scrollHeight;
  });
}

function setBusy(value) {
  state.busy = value;
  [E.send, E.attach, E.mic, E.input].forEach((element) => {
    element.disabled = value;
  });
}

function countryByCode(code) {
  return COUNTRIES.find((country) => country.code === code) || COUNTRIES[0];
}

function localizedCountry(countryValue, language = state.settings.language) {
  const country = COUNTRIES.find((item) => item.value === countryValue) || countryByCode(state.settings.countryCode);
  return country.names[language] || country.names.fr || country.value;
}

function contextText(settings = state.settings, language = state.settings.language) {
  return [LANG_NAMES[language]?.[settings.language] || settings.language.toUpperCase(), settings.city, settings.region, localizedCountry(settings.country, language)].filter(Boolean).join(" · ");
}

function shortLocation(settings = state.settings) {
  const abbreviation = settings.countryCode === "CA" ? CA_ABBREVIATIONS[settings.region] : settings.countryCode === "US" ? US_ABBREVIATIONS[settings.region] : settings.countryCode;
  return [settings.city, abbreviation].filter(Boolean).join(", ");
}

function populateCountries(selectedValue = state.settings.country) {
  const language = E.lang.value || state.settings.language;
  E.country.innerHTML = COUNTRIES.map((country) => `<option value="${escapeHtml(country.value)}" data-code="${country.code}">${escapeHtml(country.names[language] || country.value)}</option>`).join("");
  const matching = [...E.country.options].find((option) => option.value === selectedValue);
  E.country.value = matching ? selectedValue : COUNTRIES[0].value;
}

function selectedCountryCode() {
  return E.country.selectedOptions[0]?.dataset.code || "CA";
}

function renderRegionControl(preferredValue = "") {
  const language = E.lang.value || state.settings.language;
  const code = selectedCountryCode();
  const definition = ADMIN_AREAS[code];
  E.regionLabel.textContent = definition?.labels?.[language] || (language === "en" ? "Region / administrative area" : language === "es" ? "Región / división administrativa" : "Région / division administrative");

  if (definition?.items?.length) {
    E.regionSelect.hidden = false;
    E.regionInput.hidden = true;
    E.regionSelect.innerHTML = definition.items.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
    E.regionSelect.value = definition.items.includes(preferredValue) ? preferredValue : definition.items[0];
  } else {
    E.regionSelect.hidden = true;
    E.regionInput.hidden = false;
    E.regionInput.value = preferredValue;
    E.regionInput.placeholder = E.regionLabel.textContent;
  }
  updateDialogPreview();
}

function pendingSettings() {
  const code = selectedCountryCode();
  return {
    language: E.lang.value,
    country: E.country.value,
    countryCode: code,
    region: E.regionSelect.hidden ? E.regionInput.value.trim() : E.regionSelect.value,
    city: E.city.value.trim(),
    autoVoice: E.autoVoice.checked,
  };
}

function updateDialogPreview() {
  if (!E.activeContextValue || !E.lang.value || !E.country.value) return;
  const pending = pendingSettings();
  E.activeContextValue.textContent = contextText(pending, pending.language);
}

function applyUiText() {
  const assignments = {
    settingsEyebrow: "settingsEyebrow",
    settingsTitle: "settingsTitle",
    settingsIntro: "settingsIntro",
    activeContextLabel: "activeContextLabel",
    languageLabel: "languageLabel",
    countryLabel: "countryLabel",
    cityLabel: "cityLabel",
    jurisdictionNote: "jurisdictionNote",
    autoVoiceTitle: "autoVoiceTitle",
    autoVoiceDescription: "autoVoiceDescription",
    saveSettingsButton: "saveSettings",
    welcomeEyebrow: "welcomeEyebrow",
    welcomeTitle: "welcomeTitle",
    welcomeText: "welcomeText",
    welcomeContextLabel: "welcomeContextLabel",
    welcomeContextAction: "welcomeContextAction",
    capPhotoTitle: "capPhotoTitle",
    capPhotoText: "capPhotoText",
    capCodeTitle: "capCodeTitle",
    capCodeText: "capCodeText",
    capPriceTitle: "capPriceTitle",
    capPriceText: "capPriceText",
  };
  Object.entries(assignments).forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = tr(key);
  });
  E.input.placeholder = tr("placeholder");
  $("#composerNote").textContent = tr("note");
  E.contextBtn.title = tr("changeContext");
  E.contextBtn.setAttribute("aria-label", tr("changeContext"));
  E.settingsBtn.setAttribute("aria-label", tr("changeContext"));
  E.newChat.title = tr("newChat");
  E.newChat.setAttribute("aria-label", tr("newChat"));
}

function updateContextDisplays() {
  const full = contextText();
  E.location.textContent = [state.settings.city, state.settings.region, localizedCountry(state.settings.country)].filter(Boolean).join(" · ");
  E.contextLanguage.textContent = state.settings.language.toUpperCase();
  E.contextLocation.textContent = shortLocation();
  E.welcomeContextValue.textContent = full;
  E.activeContextValue.textContent = full;
}

function fillForm() {
  E.lang.value = state.settings.language;
  populateCountries(state.settings.country);
  E.city.value = state.settings.city;
  E.autoVoice.checked = state.settings.autoVoice;
  renderRegionControl(state.settings.region);
  updateDialogPreview();
}

function updateUi() {
  document.documentElement.lang = state.settings.language;
  applyUiText();
  updateContextDisplays();
}

function openSettings() {
  fillForm();
  E.panel.classList.add("open");
  E.panel.setAttribute("aria-hidden", "false");
  setTimeout(() => E.lang.focus(), 50);
}

function closeSettings() {
  E.panel.classList.remove("open");
  E.panel.setAttribute("aria-hidden", "true");
}

function storeSettings() {
  const next = pendingSettings();
  if (!next.city) next.city = state.settings.city || defaults.city;
  if (!next.region) next.region = state.settings.region || "";
  state.settings = next;
  saveLocal();
  updateUi();
  closeSettings();
  toast(tr("saved"));
}

function iconButton(kind, label, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "message-action";
  button.title = label;
  button.setAttribute("aria-label", label);
  button.innerHTML = kind === "copy"
    ? '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/></svg>';
  button.addEventListener("click", handler);
  return button;
}

function messageElement(message, pending = false) {
  const fragment = E.template.content.cloneNode(true);
  const article = fragment.querySelector(".message");
  const avatar = fragment.querySelector(".message-avatar");
  const bubble = fragment.querySelector(".message-bubble");
  const actions = fragment.querySelector(".message-actions");
  article.classList.add(message.role);
  avatar.textContent = message.role === "assistant" ? "AI" : "VOUS";

  if (pending) {
    bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  } else if (message.role === "assistant") {
    bubble.innerHTML = markdown(message.content);
    if (message.sources?.length) {
      const box = document.createElement("div");
      box.className = "sources";
      const title = document.createElement("strong");
      title.textContent = tr("sources");
      box.appendChild(title);
      message.sources.forEach((source) => {
        const link = document.createElement("a");
        link.className = "source-link";
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = source.title || source.url;
        box.appendChild(link);
      });
      bubble.appendChild(box);
    }
    actions.append(
      iconButton("copy", "Copier", async () => {
        await navigator.clipboard.writeText(message.content);
        toast(tr("copied"));
      }),
      iconButton("voice", "Écouter", () => speak(message.content)),
    );
  } else {
    bubble.textContent = message.content;
  }
  return article;
}

function renderMessages() {
  E.messages.innerHTML = "";
  E.welcome.hidden = state.messages.length > 0;
  state.messages.forEach((message) => E.messages.appendChild(messageElement(message)));
  scrollToBottom();
}

async function send(prefill) {
  if (state.busy) return;
  const text = (typeof prefill === "string" ? prefill : E.input.value.trim()) || (state.attachments.length ? tr("attachPrompt") : "");
  if (!text) {
    toast(tr("empty"));
    return;
  }

  const user = { role: "user", content: text };
  state.messages.push(user);
  saveLocal();
  E.input.value = "";
  resize();
  E.welcome.hidden = true;
  E.messages.appendChild(messageElement(user));
  const pending = messageElement({ role: "assistant", content: "" }, true);
  E.messages.appendChild(pending);
  scrollToBottom();
  setBusy(true);

  const attachments = state.attachments.map(({ name, type, dataUrl }) => ({ name, type, dataUrl }));
  state.attachments = [];
  renderAttachments();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: state.messages.map(({ role, content }) => ({ role, content })),
        attachments,
        language: state.settings.language,
        location: {
          ...state.settings,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Edmonton",
        },
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || tr("error"));
    const answer = { role: "assistant", content: data.text, sources: data.sources || [] };
    state.messages.push(answer);
    saveLocal();
    pending.replaceWith(messageElement(answer));
    scrollToBottom();
    if (state.settings.autoVoice) await speak(answer.content);
  } catch (error) {
    pending.remove();
    toast(error.message || tr("error"));
  } finally {
    setBusy(false);
    E.input.focus();
  }
}

function fileData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function addFiles(list) {
  for (const file of [...list].slice(0, 4 - state.attachments.length)) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const projected = state.attachments.reduce((total, attachment) => total + attachment.dataUrl.length, 0) + Math.ceil(file.size * 4 / 3);
    if (!allowed.includes(file.type) || file.size > 3 * 1024 * 1024 || projected > 4_000_000) {
      toast(tr("file"));
      continue;
    }
    state.attachments.push({ id: crypto.randomUUID(), name: file.name, type: file.type, dataUrl: await fileData(file) });
  }
  E.file.value = "";
  renderAttachments();
}

function renderAttachments() {
  E.tray.innerHTML = "";
  E.tray.hidden = !state.attachments.length;
  state.attachments.forEach((attachment) => {
    const chip = document.createElement("div");
    chip.className = "attachment-chip";
    const visual = attachment.type.startsWith("image/")
      ? Object.assign(document.createElement("img"), { src: attachment.dataUrl, alt: "" })
      : Object.assign(document.createElement("div"), { textContent: "PDF" });
    visual.className = "attachment-thumb";
    const name = document.createElement("span");
    name.textContent = attachment.name;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "✕";
    remove.onclick = () => {
      state.attachments = state.attachments.filter((item) => item.id !== attachment.id);
      renderAttachments();
    };
    chip.append(visual, name, remove);
    E.tray.appendChild(chip);
  });
}

async function record() {
  if (state.recorder?.state === "recording") {
    state.recorder.stop();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    toast(tr("mic"));
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
    state.chunks = [];
    state.recorder = new MediaRecorder(stream, { mimeType: mime });
    state.recorder.ondataavailable = (event) => event.data.size && state.chunks.push(event.data);
    state.recorder.onstop = async () => {
      stream.getTracks().forEach((track) => track.stop());
      E.mic.classList.remove("recording");
      await transcribe(new Blob(state.chunks, { type: mime }));
    };
    state.recorder.start();
    E.mic.classList.add("recording");
  } catch {
    toast(tr("mic"));
  }
}

async function transcribe(blob) {
  setBusy(true);
  toast(tr("transcribing"));
  try {
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl: await fileData(blob), mimeType: blob.type, language: state.settings.language }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || tr("error"));
    E.input.value = [E.input.value, data.text].filter(Boolean).join(" ");
    resize();
    E.input.focus();
  } catch (error) {
    toast(error.message || tr("error"));
  } finally {
    setBusy(false);
  }
}

async function speak(text) {
  try {
    if (state.audio) {
      state.audio.pause();
      URL.revokeObjectURL(state.audio.src);
    }
    const response = await fetch("/api/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language: state.settings.language }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || tr("audio"));
    }
    const url = URL.createObjectURL(await response.blob());
    state.audio = new Audio(url);
    state.audio.onended = () => {
      URL.revokeObjectURL(url);
      state.audio = null;
    };
    await state.audio.play();
  } catch (error) {
    toast(error.message || tr("audio"));
  }
}

async function health() {
  E.statusText.textContent = tr("checking");
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.openaiConfigured) throw new Error("Not configured");
    E.status.classList.add("online");
    E.status.classList.remove("error");
    E.statusText.textContent = tr("online");
  } catch {
    E.status.classList.add("error");
    E.status.classList.remove("online");
    E.statusText.textContent = tr("offline");
  }
}

E.settingsBtn.onclick = openSettings;
E.contextBtn.onclick = openSettings;
E.welcomeContextBtn.onclick = openSettings;
E.close.onclick = closeSettings;
E.panel.onclick = (event) => event.target === E.panel && closeSettings();
E.save.onclick = storeSettings;
E.lang.onchange = () => {
  const selectedCountry = E.country.value;
  populateCountries(selectedCountry);
  renderRegionControl(E.regionSelect.hidden ? E.regionInput.value : E.regionSelect.value);
  updateDialogPreview();
};
E.country.onchange = () => renderRegionControl("");
E.regionSelect.onchange = updateDialogPreview;
E.regionInput.oninput = updateDialogPreview;
E.city.oninput = updateDialogPreview;
E.newChat.onclick = () => {
  state.messages = [];
  saveLocal();
  renderMessages();
  toast(tr("cleared"));
};
E.send.onclick = () => send();
E.input.oninput = resize;
E.input.onkeydown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    send();
  }
};
E.attach.onclick = () => E.file.click();
E.file.onchange = (event) => addFiles(event.target.files);
E.mic.onclick = record;
document.querySelectorAll(".prompt-card").forEach((button) => {
  button.onclick = () => {
    E.input.value = button.dataset.prompt || "";
    resize();
    E.input.focus();
  };
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && E.panel.classList.contains("open")) closeSettings();
});

fillForm();
updateUi();
renderMessages();
renderAttachments();
resize();
health();
