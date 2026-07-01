import { apiFetch } from "./api.js";
import { els } from "./dom.js";
import { getSabotageMeta, renderProfile, renderUserControls } from "./feed.js";
import { openModal, toast } from "./overlays.js";
import { copyProfile, defaultUserProfile, saveUserProfile, state } from "./state.js";
import { escapeHTML } from "./utils.js";

const traitOptions = [
  "Overthinks punctuation", "Needs a little treat", "Says ‘we should’", "Reads menus early",
  "Owns an emotional tote bag", "Will pet every dog", "Replies in 3–5 days", "Has a chair pile",
];

const promptOptions = ["My greatest strength", "A fact about me that surprises people", "Together, we could", "My therapist would say"];
function revokeObjectUrl(url) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

export async function loadProfilePhoto() {
  try {
    const response = await fetch("/api/profile-photo", { headers: { "x-visitor-id": state.visitorId } });
    if (!response.ok) throw new Error("No photo");
    const nextUrl = URL.createObjectURL(await response.blob());
    revokeObjectUrl(state.userPhotoUrl);
    state.userPhotoUrl = nextUrl;
  } catch {
    revokeObjectUrl(state.userPhotoUrl);
    state.userPhotoUrl = null;
  }
  renderUserControls();
}

async function saveDraftPhoto() {
  if (state.draftPhotoRemoved) {
    await apiFetch("/api/profile-photo", { method: "DELETE" });
  } else if (state.draftPhotoFile) {
    await apiFetch("/api/profile-photo", {
      method: "POST",
      headers: { "content-type": state.draftPhotoFile.type },
      body: state.draftPhotoFile,
    });
  }
  await loadProfilePhoto();
}
function onboardingShell(copy, panel) {
  return `
    <div class="onboarding-layout">
      <div class="onboarding-copy">${copy}</div>
      ${panel}
    </div>
  `;
}

function onboardingActions(primaryLabel, { back = true, secondaryLabel = "Back", action = "next" } = {}) {
  return `
    <div class="onboarding-actions ${back ? "split" : ""}">
      ${back ? `<button class="onboarding-secondary" data-onboarding-action="back">${secondaryLabel}</button>` : ""}
      <button class="onboarding-primary" data-onboarding-action="${action}">${primaryLabel}</button>
    </div>
    <div class="onboarding-error" id="onboardingError" role="alert"></div>
  `;
}

function renderOnboarding() {
  els.onboardingStepLabel.textContent = `Evidence ${state.onboardingStep + 1} of 5`;
  els.onboardingProgress.style.width = `${(state.onboardingStep + 1) * 20}%`;

  if (state.onboardingStep === 0) {
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Mandatory self-incrimination</div>
      <h1 id="onboardingTitle">Let’s build your<br><em>alibi.</em></h1>
      <p>Five deeply scientific steps. No soulmates. No refunds. One algorithm with the emotional judgment of a wet receipt.</p>
    `, `
      <section class="onboarding-panel" data-stamp="LEGALLY A WELCOME">
        <h2>Before we lower your standards…</h2>
        <p class="panel-help">We need enough information to misunderstand you at scale.</p>
        <div class="chaos-receipt">
          <div><span>Estimated honesty</span><b>41%</b></div>
          <div><span>Photos from 2019</span><b>Encouraged</b></div>
          <div><span>Emotional readiness</span><b>Not checked</b></div>
        </div>
        ${onboardingActions(state.editingProfile ? "Reopen the case" : "Fine, perceive me", { back: false })}
        <button class="onboarding-secondary" data-onboarding-action="defaults">Use suspicious defaults instead</button>
      </section>
    `);
  }

  if (state.onboardingStep === 1) {
    const evidence = [
      ["flash", "⚡", "Hostile flash"], ["pet", "🐕", "Pet takes your slot"], ["old", "◷", "2018 confidence"],
    ];
    const displayedPhoto = state.draftPhotoPreviewUrl || (!state.draftPhotoRemoved ? state.userPhotoUrl : null);
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Identity, allegedly</div>
      <h1 id="onboardingTitle">Give us a<br><em>usable rumor.</em></h1>
      <p>Your name may be real. Everything after that is between you and whatever “product manager” did this.</p>
    `, `
      <section class="onboarding-panel" data-stamp="PUBLIC INFORMATION">
        <h2>Basic evidence</h2>
        <p class="panel-help">Displayed publicly, judged privately, screenshotted immediately.</p>
        <div class="field-grid">
          <div class="profile-field"><label for="draftName">Name-ish</label><input id="draftName" data-draft="name" maxlength="32" value="${escapeHTML(state.draftProfile.name)}" autocomplete="name"></div>
          <div class="profile-field"><label for="draftAge">Age</label><input id="draftAge" data-draft="age" type="number" min="18" max="99" value="${escapeHTML(state.draftProfile.age)}"></div>
          <div class="profile-field wide"><label for="draftTitle">Occupation / ongoing situation</label><input id="draftTitle" data-draft="title" maxlength="70" value="${escapeHTML(state.draftProfile.title)}"></div>
        </div>
        <div class="choice-label" style="margin-top:18px">Upload photographic evidence</div>
        <div class="profile-photo-editor ${displayedPhoto ? "has-photo" : ""}">
          <input id="draftPhoto" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden>
          <label class="photo-dropzone" for="draftPhoto">
            ${displayedPhoto ? `<img src="${escapeHTML(displayedPhoto)}" alt="Your uploaded profile preview">` : `<span class="photo-placeholder">◎</span>`}
            <span><b>${displayedPhoto ? "Replace this evidence" : "Choose a face-shaped file"}</b><small>JPEG, PNG, WebP, or GIF · 4 MB max · dignity unlimited</small></span>
          </label>
          ${displayedPhoto ? `<button type="button" class="remove-photo" data-remove-photo>Remove photo and create suspicion</button>` : ""}
        </div>
        <div class="choice-label" style="margin-top:16px">Choose backup photo energy</div>
        <div class="evidence-grid">
          ${evidence.map(([value, icon, label]) => `<button type="button" class="evidence-card ${state.draftProfile.evidence === value ? "selected" : ""}" data-evidence="${value}"><span>${icon}</span><small>${label}</small></button>`).join("")}
        </div>
        ${onboardingActions("This seems legally sufficient")}
      </section>
    `);
  }

  if (state.onboardingStep === 2) {
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Curate your warning label</div>
      <h1 id="onboardingTitle">Add some<br><em>texture.</em></h1>
      <p>Pick exactly three traits. Or two. We’re not the census. Then answer one prompt with the confidence of someone who has never been fact-checked.</p>
    `, `
      <section class="onboarding-panel" data-stamp="PERSONALITY SAMPLER">
        <div class="selection-count"><span class="choice-label">Select up to three allegations</span><strong id="traitCount">${state.draftProfile.traits.length}/3 selected</strong></div>
        <div class="chip-cloud">
          ${traitOptions.map((trait) => `<button type="button" class="onboarding-chip ${state.draftProfile.traits.includes(trait) ? "selected" : ""}" data-trait="${escapeHTML(trait)}">${escapeHTML(trait)}</button>`).join("")}
        </div>
        <div class="prompt-editor">
          <div class="profile-field">
            <label for="draftPrompt">Prompt selected by committee</label>
            <select id="draftPrompt" data-draft="prompt">${promptOptions.map((prompt) => `<option ${state.draftProfile.prompt === prompt ? "selected" : ""}>${escapeHTML(prompt)}</option>`).join("")}</select>
          </div>
          <div class="profile-field" style="margin-top:10px">
            <label for="draftAnswer">Your suspiciously polished answer</label>
            <textarea id="draftAnswer" data-draft="answer" maxlength="180">${escapeHTML(state.draftProfile.answer)}</textarea>
          </div>
        </div>
        ${onboardingActions("Weaponize this information")}
      </section>
    `);
  }

  if (state.onboardingStep === 3) {
    const meta = getSabotageMeta(state.draftProfile.sabotage);
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Calibration without oversight</div>
      <h1 id="onboardingTitle">How bad should<br><em>we be?</em></h1>
      <p>This setting is real. It changes the compatibility math and how aggressively we treat your boundaries as fun little dares.</p>
    `, `
      <section class="onboarding-panel" data-stamp="ALGORITHM POISONING">
        <h2>Recommendation sabotage</h2>
        <p class="panel-help">You can make this worse later. Personal growth!</p>
        <div class="sabotage-stage">
          <output id="draftSabotageValue">${state.draftProfile.sabotage}%</output>
          <input id="draftSabotage" data-draft="sabotage" type="range" min="0" max="100" value="${state.draftProfile.sabotage}">
          <div class="sabotage-labels"><span>Occasionally listens</span><span>Actively resents you</span></div>
          <div class="sabotage-verdict" id="draftSabotageVerdict"><strong>${meta.status}:</strong> ${meta.copy}</div>
        </div>
        ${onboardingActions("Ruin my recommendations")}
      </section>
    `);
  }

  if (state.onboardingStep === 4) {
    const evidenceIcon = { flash: "⚡", pet: "🐕", old: "◷" }[state.draftProfile.evidence] || "?";
    const displayedPhoto = state.draftPhotoPreviewUrl || (!state.draftPhotoRemoved ? state.userPhotoUrl : null);
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Ready for public consumption</div>
      <h1 id="onboardingTitle">Unfortunately,<br><em>that’s you.</em></h1>
      <p>Read it once. Regret it briefly. Release it into an ecosystem that has done nothing to deserve this.</p>
    `, `
      <section class="onboarding-panel" data-stamp="${state.editingProfile ? "AMENDED" : "QUESTIONABLY VERIFIED"}">
        <div class="review-card">
          <div class="review-avatar">${displayedPhoto ? `<img src="${escapeHTML(displayedPhoto)}" alt="Your profile photo">` : evidenceIcon}</div>
          <div>
            <h3>${escapeHTML(state.draftProfile.name)}, ${escapeHTML(state.draftProfile.age)}</h3>
            <p>${escapeHTML(state.draftProfile.title)}</p>
            <div class="review-traits">${state.draftProfile.traits.map((trait) => `<span>${escapeHTML(trait)}</span>`).join("")}</div>
          </div>
        </div>
        <div class="chaos-receipt">
          <div><span>${escapeHTML(state.draftProfile.prompt)}</span><b>${escapeHTML(state.draftProfile.answer.slice(0, 34))}${state.draftProfile.answer.length > 34 ? "…" : ""}</b></div>
          <div><span>Algorithm sabotage</span><b>${state.draftProfile.sabotage}%</b></div>
          <div><span>Chance this ends well</span><b>Unsupported</b></div>
        </div>
        ${onboardingActions(state.editingProfile ? "Save these allegations" : "Release me into the feed", { action: "finish" })}
      </section>
    `);
  }

  window.setTimeout(() => els.onboardingContent.querySelector("input, select, textarea, button")?.focus(), 0);
}

function showOnboardingError(message) {
  const error = els.onboardingContent.querySelector("#onboardingError");
  const panel = els.onboardingContent.querySelector(".onboarding-panel");
  if (error) error.textContent = message;
  panel?.classList.add("shake");
  window.setTimeout(() => panel?.classList.remove("shake"), 400);
}

export function startOnboarding(isEditing = false) {
  state.editingProfile = isEditing;
  state.draftProfile = copyProfile(state.userProfile);
  state.draftPhotoFile = null;
  state.draftPhotoRemoved = false;
  revokeObjectUrl(state.draftPhotoPreviewUrl);
  state.draftPhotoPreviewUrl = null;
  state.onboardingStep = isEditing ? 1 : 0;
  els.onboarding.hidden = false;
  document.body.style.overflow = "hidden";
  renderOnboarding();
}

async function finishOnboarding(useDefaults = false) {
  const finishButton = els.onboardingContent.querySelector("[data-onboarding-action='finish']");
  if (finishButton) {
    finishButton.disabled = true;
    finishButton.textContent = "Uploading your alibi…";
  }
  try {
    await saveDraftPhoto();
  } catch (error) {
    if (finishButton) {
      finishButton.disabled = false;
      finishButton.textContent = state.editingProfile ? "Save these allegations" : "Release me into the feed";
    }
    showOnboardingError(error.message || "Your photo refused to become evidence.");
    return;
  }
  state.userProfile = copyProfile(useDefaults ? defaultUserProfile : state.draftProfile);
  saveUserProfile();
  state.draftPhotoFile = null;
  state.draftPhotoRemoved = false;
  revokeObjectUrl(state.draftPhotoPreviewUrl);
  state.draftPhotoPreviewUrl = null;
  els.onboarding.hidden = true;
  document.body.style.overflow = "";
  renderUserControls();
  renderProfile();
  toast(useDefaults ? "A placeholder personality has been assigned." : state.editingProfile ? "Allegations amended." : "Profile live. Dignity pending.");
}

function openAccount() {
  const safeName = escapeHTML(state.userProfile.name);
  const safeTitle = escapeHTML(state.userProfile.title);
  openModal(`
    <span class="modal-kicker">Your public liability</span>
    ${state.userPhotoUrl ? `<img class="account-photo" src="${escapeHTML(state.userPhotoUrl)}" alt="Your profile photo">` : ""}
    <h2>${safeName}, ${escapeHTML(state.userProfile.age)}</h2>
    <p>${safeTitle}</p>
    <div class="review-traits">${state.userProfile.traits.map((trait) => `<span>${escapeHTML(trait)}</span>`).join("")}</div>
    <div class="chaos-receipt">
      <div><span>Profile honesty</span><b>41%</b></div>
      <div><span>Sabotage level</span><b>${state.userProfile.sabotage}%</b></div>
      <div><span>Reviewing raccoons</span><b>Three</b></div>
    </div>
    <div class="modal-actions">
      <button class="modal-action" id="editProfile">Edit my testimony</button>
      <button class="modal-action secondary" id="restartProfile">Erase me emotionally</button>
    </div>
  `);
}

export function initOnboarding() {
els.avatarButton.addEventListener("click", openAccount);

els.onboardingBrand.addEventListener("click", (event) => {
  event.preventDefault();
  showOnboardingError("The logo is not an exit. It is branding.");
});

els.onboarding.addEventListener("click", async (event) => {
  if (event.target.closest("[data-remove-photo]")) {
    state.draftPhotoFile = null;
    state.draftPhotoRemoved = true;
    revokeObjectUrl(state.draftPhotoPreviewUrl);
    state.draftPhotoPreviewUrl = null;
    renderOnboarding();
    return;
  }

  const evidence = event.target.closest("[data-evidence]");
  if (evidence) {
    state.draftProfile.evidence = evidence.dataset.evidence;
    els.onboardingContent.querySelectorAll("[data-evidence]").forEach((card) => card.classList.toggle("selected", card === evidence));
    return;
  }

  const trait = event.target.closest("[data-trait]");
  if (trait) {
    const value = trait.dataset.trait;
    if (state.draftProfile.traits.includes(value)) state.draftProfile.traits = state.draftProfile.traits.filter((item) => item !== value);
    else if (state.draftProfile.traits.length < 3) state.draftProfile.traits.push(value);
    else {
      showOnboardingError("Three allegations maximum. Save something for the second date.");
      return;
    }
    trait.classList.toggle("selected", state.draftProfile.traits.includes(value));
    els.onboardingContent.querySelector("#traitCount").textContent = `${state.draftProfile.traits.length}/3 selected`;
    return;
  }

  const actionButton = event.target.closest("[data-onboarding-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.onboardingAction;

  if (action === "defaults") {
    await finishOnboarding(true);
    return;
  }
  if (action === "back") {
    state.onboardingStep = Math.max(state.editingProfile ? 1 : 0, state.onboardingStep - 1);
    renderOnboarding();
    return;
  }
  if (action === "finish") {
    await finishOnboarding();
    return;
  }

  if (state.onboardingStep === 1) {
    const age = Number(state.draftProfile.age);
    if (!state.draftProfile.name.trim()) return showOnboardingError("Please provide at least one usable syllable.");
    if (!Number.isFinite(age) || age < 18 || age > 99) return showOnboardingError("This app is for adults between 18 and suspiciously immortal.");
    state.draftProfile.age = age;
    state.draftProfile.title = state.draftProfile.title.trim() || "Between eras · Near a charger";
  }
  if (state.onboardingStep === 2) {
    if (state.draftProfile.traits.length < 2) return showOnboardingError("Select at least two warning labels. Transparency matters.");
    if (state.draftProfile.answer.trim().length < 8) return showOnboardingError("Give the group chat at least eight characters to work with.");
    state.draftProfile.answer = state.draftProfile.answer.trim();
  }
  state.onboardingStep = Math.min(4, state.onboardingStep + 1);
  renderOnboarding();
});

els.onboarding.addEventListener("input", (event) => {
  const key = event.target.dataset.draft;
  if (!key) return;
  state.draftProfile[key] = key === "sabotage" ? Number(event.target.value) : event.target.value;
  if (key === "sabotage") {
    const meta = getSabotageMeta(state.draftProfile.sabotage);
    els.onboardingContent.querySelector("#draftSabotageValue").textContent = `${state.draftProfile.sabotage}%`;
    els.onboardingContent.querySelector("#draftSabotageVerdict").innerHTML = `<strong>${meta.status}:</strong> ${meta.copy}`;
  }
});

els.onboarding.addEventListener("change", (event) => {
  if (event.target.id !== "draftPhoto") return;
  const file = event.target.files?.[0];
  if (!file) return;
  const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!acceptedTypes.includes(file.type)) {
    showOnboardingError("That is not a JPEG, PNG, WebP, or GIF. It may be a résumé.");
    return;
  }
  if (file.size > 4 * 1024 * 1024) {
    showOnboardingError("That photo is over 4 MB. Your face has exceeded its storage allocation.");
    return;
  }
  if (!file.size) {
    showOnboardingError("That file contains less evidence than your bio.");
    return;
  }
  state.draftPhotoFile = file;
  state.draftPhotoRemoved = false;
  revokeObjectUrl(state.draftPhotoPreviewUrl);
  state.draftPhotoPreviewUrl = URL.createObjectURL(file);
  renderOnboarding();
});
}
