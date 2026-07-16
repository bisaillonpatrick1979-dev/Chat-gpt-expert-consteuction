const $ = (s) => document.querySelector(s);
const E = {
  status: $("#apiStatus"), statusText: $("#apiStatusText"), settingsBtn: $("#settingsButton"),
  panel: $("#settingsPanel"), close: $("#closeSettingsButton"), save: $("#saveSettingsButton"),
  newChat: $("#newChatButton"), lang: $("#languageSelect"), country: $("#countrySelect"),
  regionSelect: $("#regionSelect"), regionInput: $("#regionInput"), regionLabel: $("#regionLabel"),
  city: $("#cityInput"), autoVoice: $("#autoVoiceToggle"), location: $("#locationSummary"),
  chat: $("#chatArea"), welcome: $("#welcomeCard"), messages: $("#messages"), input: $("#messageInput"),
  send: $("#sendButton"), attach: $("#attachButton"), file: $("#fileInput"), tray: $("#attachmentTray"),
  mic: $("#micButton"), template: $("#messageTemplate")
};

const COPY = {
  fr: { online:"IA prête", offline:"Configuration requise", checking:"Vérification…", empty:"Écrivez une question ou joignez une photo.", error:"Impossible d'obtenir une réponse.", saved:"Réglages enregistrés.", cleared:"Conversation effacée.", copied:"Réponse copiée.", transcribing:"Transcription en cours…", file:"Images JPG, PNG, WebP ou PDF seulement, maximum total d'environ 3 Mo.", mic:"Autorisez le microphone pour utiliser la dictée.", audio:"Impossible de générer la voix.", sources:"Sources consultées", placeholder:"Décrivez votre projet ou votre problème…", note:"Vérifiez les exigences importantes auprès de l'autorité locale ou d'un professionnel licencié.", regionCA:"Province", regionUS:"État", regionEU:"Région / département / canton", attachPrompt:"Analyse en détail les fichiers joints et réponds à ma question." },
  en: { online:"AI ready", offline:"Configuration required", checking:"Checking…", empty:"Enter a question or attach a photo.", error:"Unable to get a response.", saved:"Settings saved.", cleared:"Conversation cleared.", copied:"Response copied.", transcribing:"Transcribing…", file:"JPG, PNG, WebP images or PDF only, about 3 MB total.", mic:"Allow microphone access to use dictation.", audio:"Unable to generate speech.", sources:"Sources consulted", placeholder:"Describe your project or problem…", note:"Confirm important requirements with the local authority or a licensed professional.", regionCA:"Province", regionUS:"State", regionEU:"Region / county / canton", attachPrompt:"Analyze the attached files in detail and answer my question." },
  es: { online:"IA lista", offline:"Configuración requerida", checking:"Verificando…", empty:"Escriba una pregunta o adjunte una foto.", error:"No se pudo obtener una respuesta.", saved:"Ajustes guardados.", cleared:"Conversación borrada.", copied:"Respuesta copiada.", transcribing:"Transcribiendo…", file:"Solo JPG, PNG, WebP o PDF, aproximadamente 3 MB en total.", mic:"Autorice el micrófono para usar el dictado.", audio:"No se pudo generar la voz.", sources:"Fuentes consultadas", placeholder:"Describa su proyecto o problema…", note:"Confirme los requisitos importantes con la autoridad local o un profesional autorizado.", regionCA:"Provincia", regionUS:"Estado", regionEU:"Región / provincia / cantón", attachPrompt:"Analiza detalladamente los archivos adjuntos y responde a mi pregunta." }
};

const COUNTRIES = [["Canada","CA"],["United States","US"],["France","FR"],["Spain","ES"],["United Kingdom","GB"],["Germany","DE"],["Italy","IT"],["Belgium","BE"],["Switzerland","CH"],["Portugal","PT"],["Netherlands","NL"],["Ireland","IE"],["Austria","AT"],["Sweden","SE"],["Norway","NO"],["Denmark","DK"],["Finland","FI"],["Poland","PL"]];
const CA = ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"];
const US = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
const defaults = { language:"fr", country:"Canada", countryCode:"CA", region:"Alberta", city:"Calgary", autoVoice:false };
const load = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } };
const state = { settings: load("cec-settings-v1", defaults), messages: load("cec-messages-v1", []), attachments: [], busy:false, recorder:null, chunks:[], audio:null };
const tr = (k) => COPY[state.settings.language]?.[k] || COPY.fr[k] || k;
const saveLocal = () => {
  localStorage.setItem("cec-settings-v1", JSON.stringify(state.settings));
  localStorage.setItem("cec-messages-v1", JSON.stringify(state.messages.slice(-24)));
};

function escapeHtml(v) {
  return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
function inline(v) {
  return v.replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
}
function markdown(text) {
  const out=[]; let list="";
  const close=()=>{ if(list){ out.push(`</${list}>`); list=""; } };
  for(const raw of escapeHtml(text).split("\n")){
    const line=raw.trimEnd(); if(!line.trim()){ close(); continue; }
    const h=line.match(/^(#{2,4})\s+(.+)$/); if(h){ close(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }
    const u=line.match(/^\s*[-*]\s+(.+)$/), o=line.match(/^\s*\d+[.)]\s+(.+)$/);
    if(u||o){ const need=u?"ul":"ol"; if(list!==need){ close(); list=need; out.push(`<${list}>`); } out.push(`<li>${inline((u||o)[1])}</li>`); continue; }
    close(); out.push(`<p>${inline(line)}</p>`);
  }
  close(); return out.join("");
}
function toast(message) {
  let el=$(".toast"); if(!el){ el=document.createElement("div"); el.className="toast"; document.body.appendChild(el); }
  el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2600);
}
function resize(){ E.input.style.height="auto"; E.input.style.height=`${Math.min(E.input.scrollHeight,180)}px`; }
function scroll(){ requestAnimationFrame(()=>E.chat.scrollTop=E.chat.scrollHeight); }
function busy(v){ state.busy=v; [E.send,E.attach,E.mic,E.input].forEach(el=>el.disabled=v); }

function countries() {
  E.country.innerHTML=COUNTRIES.map(([n,c])=>`<option value="${escapeHtml(n)}" data-code="${c}">${escapeHtml(n)}</option>`).join("");
}
function regions() {
  const code=E.country.selectedOptions[0]?.dataset.code || "CA";
  const items=code==="CA"?CA:code==="US"?US:null;
  if(items){
    E.regionSelect.hidden=false; E.regionInput.hidden=true; E.regionLabel.textContent=code==="CA"?tr("regionCA"):tr("regionUS");
    E.regionSelect.innerHTML=items.map(n=>`<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
    if(items.includes(state.settings.region)) E.regionSelect.value=state.settings.region;
  } else {
    E.regionSelect.hidden=true; E.regionInput.hidden=false; E.regionLabel.textContent=tr("regionEU");
    E.regionInput.value=state.settings.region || ""; E.regionInput.placeholder=tr("regionEU");
  }
}
function form() {
  countries(); E.lang.value=state.settings.language;
  [...E.country.options].find(o=>o.value===state.settings.country)?.setAttribute("selected","");
  E.city.value=state.settings.city; E.autoVoice.checked=state.settings.autoVoice; regions();
}
function ui() {
  document.documentElement.lang=state.settings.language; E.input.placeholder=tr("placeholder"); $("#composerNote").textContent=tr("note");
  E.location.textContent=[state.settings.city,state.settings.region,state.settings.country].filter(Boolean).join(" · ");
  regions();
}
function openSettings(){ form(); E.panel.classList.add("open"); E.panel.setAttribute("aria-hidden","false"); }
function closeSettings(){ E.panel.classList.remove("open"); E.panel.setAttribute("aria-hidden","true"); }
function storeSettings(){
  const code=E.country.selectedOptions[0]?.dataset.code || "CA";
  state.settings={ language:E.lang.value, country:E.country.value, countryCode:code, region:code==="CA"||code==="US"?E.regionSelect.value:E.regionInput.value.trim(), city:E.city.value.trim(), autoVoice:E.autoVoice.checked };
  saveLocal(); ui(); closeSettings(); toast(tr("saved"));
}

function iconButton(kind,label,fn){
  const b=document.createElement("button"); b.type="button"; b.className="message-action"; b.title=label; b.setAttribute("aria-label",label);
  b.innerHTML=kind==="copy"?'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>':'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/></svg>';
  b.addEventListener("click",fn); return b;
}
function messageEl(message,pending=false){
  const frag=E.template.content.cloneNode(true), article=frag.querySelector(".message"), avatar=frag.querySelector(".message-avatar"), bubble=frag.querySelector(".message-bubble"), actions=frag.querySelector(".message-actions");
  article.classList.add(message.role); avatar.textContent=message.role==="assistant"?"AI":"VOUS";
  if(pending) bubble.innerHTML='<div class="typing"><span></span><span></span><span></span></div>';
  else if(message.role==="assistant"){
    bubble.innerHTML=markdown(message.content);
    if(message.sources?.length){
      const box=document.createElement("div"); box.className="sources"; const title=document.createElement("strong"); title.textContent=tr("sources"); box.appendChild(title);
      message.sources.forEach(s=>{ const a=document.createElement("a"); a.className="source-link"; a.href=s.url; a.target="_blank"; a.rel="noopener"; a.textContent=s.title||s.url; box.appendChild(a); }); bubble.appendChild(box);
    }
    actions.append(iconButton("copy","Copier",async()=>{ await navigator.clipboard.writeText(message.content); toast(tr("copied")); }),iconButton("voice","Écouter",()=>speak(message.content)));
  } else bubble.textContent=message.content;
  return article;
}
function renderMessages(){
  E.messages.innerHTML=""; E.welcome.hidden=state.messages.length>0; state.messages.forEach(m=>E.messages.appendChild(messageEl(m))); scroll();
}

async function send(prefill){
  if(state.busy) return;
  const text=(typeof prefill==="string"?prefill:E.input.value.trim()) || (state.attachments.length?tr("attachPrompt"):"");
  if(!text){ toast(tr("empty")); return; }
  const user={role:"user",content:text}; state.messages.push(user); saveLocal(); E.input.value=""; resize(); E.welcome.hidden=true; E.messages.appendChild(messageEl(user));
  const pending=messageEl({role:"assistant",content:""},true); E.messages.appendChild(pending); scroll(); busy(true);
  const attachments=state.attachments.map(({name,type,dataUrl})=>({name,type,dataUrl})); state.attachments=[]; renderAttachments();
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      messages:state.messages.map(({role,content})=>({role,content})), attachments, language:state.settings.language,
      location:{...state.settings,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"America/Edmonton"}
    })});
    const data=await res.json().catch(()=>({})); if(!res.ok) throw new Error(data.error||tr("error"));
    const answer={role:"assistant",content:data.text,sources:data.sources||[]}; state.messages.push(answer); saveLocal(); pending.replaceWith(messageEl(answer)); scroll();
    if(state.settings.autoVoice) await speak(answer.content);
  }catch(err){ pending.remove(); toast(err.message||tr("error")); }finally{ busy(false); E.input.focus(); }
}

function fileData(file){ return new Promise((ok,no)=>{ const r=new FileReader(); r.onload=()=>ok(r.result); r.onerror=no; r.readAsDataURL(file); }); }
async function files(list){
  for(const file of [...list].slice(0,4-state.attachments.length)){
    const allowed=["image/jpeg","image/png","image/webp","application/pdf"];
    const projected=state.attachments.reduce((n,a)=>n+a.dataUrl.length,0)+Math.ceil(file.size*4/3);
    if(!allowed.includes(file.type)||file.size>3*1024*1024||projected>4_000_000){ toast(tr("file")); continue; }
    state.attachments.push({id:crypto.randomUUID(),name:file.name,type:file.type,dataUrl:await fileData(file)});
  }
  E.file.value=""; renderAttachments();
}
function renderAttachments(){
  E.tray.innerHTML=""; E.tray.hidden=!state.attachments.length;
  state.attachments.forEach(a=>{
    const chip=document.createElement("div"); chip.className="attachment-chip";
    const visual=a.type.startsWith("image/")?Object.assign(document.createElement("img"),{src:a.dataUrl,alt:""}):Object.assign(document.createElement("div"),{textContent:"PDF"}); visual.className="attachment-thumb";
    const name=document.createElement("span"); name.textContent=a.name;
    const x=document.createElement("button"); x.type="button"; x.textContent="✕"; x.onclick=()=>{ state.attachments=state.attachments.filter(v=>v.id!==a.id); renderAttachments(); };
    chip.append(visual,name,x); E.tray.appendChild(chip);
  });
}

async function record(){
  if(state.recorder?.state==="recording"){ state.recorder.stop(); return; }
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){ toast(tr("mic")); return; }
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true}), mime=MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":"audio/webm";
    state.chunks=[]; state.recorder=new MediaRecorder(stream,{mimeType:mime}); state.recorder.ondataavailable=e=>e.data.size&&state.chunks.push(e.data);
    state.recorder.onstop=async()=>{ stream.getTracks().forEach(t=>t.stop()); E.mic.classList.remove("recording"); await transcribe(new Blob(state.chunks,{type:mime})); };
    state.recorder.start(); E.mic.classList.add("recording");
  }catch{ toast(tr("mic")); }
}
async function transcribe(blob){
  busy(true); toast(tr("transcribing"));
  try{
    const res=await fetch("/api/transcribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dataUrl:await fileData(blob),mimeType:blob.type,language:state.settings.language})});
    const data=await res.json().catch(()=>({})); if(!res.ok) throw new Error(data.error||tr("error"));
    E.input.value=[E.input.value,data.text].filter(Boolean).join(" "); resize(); E.input.focus();
  }catch(err){ toast(err.message||tr("error")); }finally{ busy(false); }
}
async function speak(text){
  try{
    if(state.audio){ state.audio.pause(); URL.revokeObjectURL(state.audio.src); }
    const res=await fetch("/api/speech",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text,language:state.settings.language})});
    if(!res.ok){ const d=await res.json().catch(()=>({})); throw new Error(d.error||tr("audio")); }
    const url=URL.createObjectURL(await res.blob()); state.audio=new Audio(url); state.audio.onended=()=>{URL.revokeObjectURL(url);state.audio=null;}; await state.audio.play();
  }catch(err){ toast(err.message||tr("audio")); }
}
async function health(){
  E.statusText.textContent=tr("checking");
  try{ const r=await fetch("/api/health",{cache:"no-store"}),d=await r.json(); if(!r.ok||!d.openaiConfigured) throw 0; E.status.classList.add("online"); E.status.classList.remove("error"); E.statusText.textContent=tr("online"); }
  catch{ E.status.classList.add("error"); E.status.classList.remove("online"); E.statusText.textContent=tr("offline"); }
}

E.settingsBtn.onclick=openSettings; E.close.onclick=closeSettings; E.panel.onclick=e=>e.target===E.panel&&closeSettings(); E.save.onclick=storeSettings;
E.country.onchange=regions; E.newChat.onclick=()=>{state.messages=[];saveLocal();renderMessages();toast(tr("cleared"));};
E.send.onclick=()=>send(); E.input.oninput=resize; E.input.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};
E.attach.onclick=()=>E.file.click(); E.file.onchange=e=>files(e.target.files); E.mic.onclick=record;
document.querySelectorAll(".prompt-card").forEach(b=>b.onclick=()=>{E.input.value=b.dataset.prompt||"";resize();E.input.focus();});

form(); ui(); renderMessages(); renderAttachments(); resize(); health();
