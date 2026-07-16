(() => {
  const NativeAudio = window.Audio;
  const nativeFetch = window.fetch.bind(window);
  const supportsSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  let lastSpeechText = "";
  let lastLanguage = "fr";
  let fallbackAlreadyStarted = false;
  let audioContext = null;

  const LABELS = {
    fr: {
      test: "Tester la voix",
      testing: "Test en cours…",
      success: "La voix fonctionne",
      fallback: "Voix du téléphone activée",
      failed: "La voix ne peut pas démarrer. Vérifiez le volume multimédia.",
      sample: "Test réussi. La voix de votre expert construction fonctionne correctement.",
      enabled: "La réponse vocale automatique est activée.",
    },
    en: {
      test: "Test voice",
      testing: "Testing…",
      success: "Voice is working",
      fallback: "Device voice enabled",
      failed: "Voice could not start. Check the media volume.",
      sample: "Test successful. Your construction expert voice is working correctly.",
      enabled: "Automatic spoken responses are enabled.",
    },
    es: {
      test: "Probar la voz",
      testing: "Probando…",
      success: "La voz funciona",
      fallback: "Voz del dispositivo activada",
      failed: "No se pudo iniciar la voz. Verifique el volumen multimedia.",
      sample: "Prueba correcta. La voz de su experto en construcción funciona correctamente.",
      enabled: "La respuesta de voz automática está activada.",
    },
  };

  function language() {
    return document.querySelector("#languageSelect")?.value || lastLanguage || "fr";
  }

  function copy() {
    return LABELS[language()] || LABELS.fr;
  }

  function languageTag(lang) {
    return lang === "en" ? "en-CA" : lang === "es" ? "es-MX" : "fr-CA";
  }

  function splitForSpeech(text) {
    const clean = String(text || "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/[#*_>`~\[\]()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!clean) return [];
    const sentences = clean.match(/[^.!?;:]+[.!?;:]?|[^.!?;:]+$/g) || [clean];
    const chunks = [];
    let current = "";

    sentences.forEach((sentence) => {
      const value = sentence.trim();
      if (!value) return;
      if (`${current} ${value}`.trim().length <= 220) {
        current = `${current} ${value}`.trim();
      } else {
        if (current) chunks.push(current);
        current = value;
      }
    });
    if (current) chunks.push(current);
    return chunks;
  }

  function preferredVoice(lang) {
    const tag = languageTag(lang).toLowerCase();
    const base = tag.slice(0, 2);
    const voices = speechSynthesis.getVoices();
    return voices.find((voice) => voice.lang.toLowerCase() === tag)
      || voices.find((voice) => voice.lang.toLowerCase().startsWith(base))
      || null;
  }

  function speakWithDevice(text, lang = language()) {
    if (!supportsSpeech) return Promise.reject(new Error("Speech synthesis unavailable"));
    const chunks = splitForSpeech(text);
    if (!chunks.length) return Promise.resolve();

    speechSynthesis.cancel();
    fallbackAlreadyStarted = true;

    return new Promise((resolve, reject) => {
      let index = 0;
      const next = () => {
        if (index >= chunks.length) {
          fallbackAlreadyStarted = false;
          resolve();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(chunks[index++]);
        utterance.lang = languageTag(lang);
        utterance.rate = 0.96;
        utterance.pitch = 1;
        utterance.volume = 1;
        const voice = preferredVoice(lang);
        if (voice) utterance.voice = voice;
        utterance.onend = next;
        utterance.onerror = (event) => {
          fallbackAlreadyStarted = false;
          reject(event.error || new Error("Speech synthesis failed"));
        };
        speechSynthesis.speak(utterance);
      };
      next();
    });
  }

  async function unlockAudio() {
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      audioContext ||= new Context();
      if (audioContext.state === "suspended") await audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      gain.gain.value = 0.00001;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.02);
    } catch {
      // The device speech fallback remains available.
    }
  }

  function makeSilentWav() {
    const buffer = new ArrayBuffer(46);
    const view = new DataView(buffer);
    const write = (offset, value) => [...value].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
    write(0, "RIFF");
    view.setUint32(4, 38, true);
    write(8, "WAVE");
    write(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 8000, true);
    view.setUint32(28, 16000, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    write(36, "data");
    view.setUint32(40, 2, true);
    view.setInt16(44, 0, true);
    return new Blob([buffer], { type: "audio/wav" });
  }

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const isSpeech = url.includes("/api/speech");

    if (isSpeech) {
      try {
        const payload = JSON.parse(init.body || "{}");
        lastSpeechText = payload.text || lastSpeechText;
        lastLanguage = payload.language || lastLanguage;
      } catch {
        // Keep the last known speech request.
      }
    }

    try {
      const response = await nativeFetch(input, init);
      if (isSpeech && !response.ok && lastSpeechText && supportsSpeech) {
        await speakWithDevice(lastSpeechText, lastLanguage).catch(() => {});
        return new Response(makeSilentWav(), { status: 200, headers: { "Content-Type": "audio/wav" } });
      }
      return response;
    } catch (error) {
      if (isSpeech && lastSpeechText && supportsSpeech) {
        await speakWithDevice(lastSpeechText, lastLanguage).catch(() => {});
        return new Response(makeSilentWav(), { status: 200, headers: { "Content-Type": "audio/wav" } });
      }
      throw error;
    }
  };

  function AudioWithFallback(src) {
    const audio = new NativeAudio(src);
    const nativePlay = audio.play.bind(audio);
    audio.play = async () => {
      await unlockAudio();
      try {
        return await nativePlay();
      } catch (error) {
        if (!fallbackAlreadyStarted && lastSpeechText && supportsSpeech) {
          return speakWithDevice(lastSpeechText, lastLanguage);
        }
        throw error;
      }
    };
    return audio;
  }
  AudioWithFallback.prototype = NativeAudio.prototype;
  window.Audio = AudioWithFallback;

  async function testVoice(button, status) {
    const labels = copy();
    button.disabled = true;
    button.textContent = labels.testing;
    status.textContent = "";
    await unlockAudio();

    try {
      lastSpeechText = labels.sample;
      lastLanguage = language();
      const response = await window.fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: labels.sample, language: lastLanguage }),
      });
      if (!response.ok) throw new Error("Speech endpoint unavailable");
      const url = URL.createObjectURL(await response.blob());
      const audio = new NativeAudio(url);
      try {
        await audio.play();
        status.textContent = labels.success;
      } catch {
        await speakWithDevice(labels.sample, lastLanguage);
        status.textContent = labels.fallback;
      } finally {
        audio.onended = () => URL.revokeObjectURL(url);
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      }
    } catch {
      try {
        await speakWithDevice(labels.sample, language());
        status.textContent = labels.fallback;
      } catch {
        status.textContent = labels.failed;
      }
    } finally {
      button.disabled = false;
      button.textContent = copy().test;
    }
  }

  function installControls() {
    const voiceSetting = document.querySelector(".voice-setting");
    const toggle = document.querySelector("#autoVoiceToggle");
    if (!voiceSetting || !toggle || document.querySelector("#testVoiceButton")) return;

    const controls = document.createElement("div");
    controls.className = "voice-test-controls";
    const button = document.createElement("button");
    button.id = "testVoiceButton";
    button.type = "button";
    button.className = "voice-test-button";
    button.textContent = copy().test;
    const status = document.createElement("small");
    status.className = "voice-test-status";
    controls.append(button, status);
    voiceSetting.insertAdjacentElement("afterend", controls);

    button.addEventListener("click", () => testVoice(button, status));
    toggle.addEventListener("change", async () => {
      if (!toggle.checked) {
        speechSynthesis?.cancel();
        return;
      }
      await unlockAudio();
      lastSpeechText = copy().enabled;
      lastLanguage = language();
      try {
        await speakWithDevice(lastSpeechText, lastLanguage);
        status.textContent = copy().success;
      } catch {
        status.textContent = copy().failed;
      }
    });

    document.querySelector("#languageSelect")?.addEventListener("change", () => {
      button.textContent = copy().test;
      status.textContent = "";
    });
  }

  const style = document.createElement("style");
  style.textContent = `
    .voice-test-controls { display:flex; align-items:center; gap:10px; margin:10px 0 18px; }
    .voice-test-button { min-height:44px; padding:0 16px; border:1px solid rgba(96,165,250,.5); border-radius:12px; background:rgba(37,99,235,.16); color:#dbeafe; font-weight:800; }
    .voice-test-button:disabled { opacity:.65; }
    .voice-test-status { color:#9fb1c7; line-height:1.35; }
    @media (max-width:520px) { .voice-test-controls { align-items:flex-start; flex-direction:column; } .voice-test-button { width:100%; } }
  `;
  document.head.appendChild(style);

  ["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, unlockAudio, { once: true, passive: true });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installControls);
  } else {
    installControls();
  }
})();
