const profiles = [
  {
    name: "Marina",
    age: 29,
    image: "assets/marina.png",
    alt: "Marina in a red coat holding a baguette in a laundromat",
    distance: "0.8",
    title: "Professional overthinker · Amateur locksmith",
    sticker: "Your ex would hate them",
    traits: ["♨ Steals your fries", "↺ Replies eventually", "☁ Has a podcast idea"],
    promptLabel: "My most irrational fear",
    promptAnswer: "A waiter saying ‘enjoy’ before I've decided if I will.",
    compatibility: 14,
    reason: "Based on both of you owning a chair.",
    badReasons: ["They own a chair. You once sat down.", "You said ‘no podcasters.’ We heard ‘more podcasters.’", "Their red flags match your accent color."],
    accent: "#ff5a36",
    positions: ["50% 32%", "30% 45%", "68% 54%"],
  },
  {
    name: "Theo",
    age: 31,
    image: "assets/theo.png",
    alt: "Theo holding a watermelon and tiny espresso in a supermarket",
    distance: "3.1",
    title: "Freelance cartographer · Full-time indoor boy",
    sticker: "Owns one fitted sheet",
    traits: ["☕ Says ‘expresso’", "◒ Calls mom weekly", "⌘ Can parallel park"],
    promptLabel: "Together, we could",
    promptAnswer: "Open a restaurant with no clear theme and terrible acoustics.",
    compatibility: 97,
    reason: "Both skipped the terms and conditions.",
    badReasons: ["You both tolerate produce sections.", "He is three dealbreakers in a sweater.", "The model confused eye contact with tax compatibility."],
    accent: "#294bff",
    positions: ["50% 22%", "38% 46%", "72% 50%"],
  },
  {
    name: "Jules",
    age: 27,
    image: "assets/jules.png",
    alt: "Jules in a cobalt suit holding a plant and bowling ball",
    distance: "1.4",
    title: "Ceramicist · Recovering astrology skeptic",
    sticker: "Liked by your therapist",
    traits: ["♧ Keeps plants alive", "♬ Bad aux etiquette", "✦ Has ‘a guy’"],
    promptLabel: "A boundary of mine",
    promptAnswer: "Do not speak to me while the microwave is counting down from three.",
    compatibility: 43,
    reason: "You use the same amount of punctuation.",
    badReasons: ["You both know a plant, statistically.", "Your stated boundaries were used as search filters.", "They are exactly your type, according to your worst friend."],
    accent: "#ff5a36",
    positions: ["50% 24%", "32% 48%", "70% 50%"],
  },
  {
    name: "Ravi",
    age: 32,
    image: "assets/ravi.png",
    alt: "Ravi holding a tiny plant and an enormous paintbrush in a hardware store",
    distance: "6.6",
    title: "Municipal gardener · Unlicensed color theorist",
    sticker: "Has read half a book",
    traits: ["♨ Owns seven mugs", "↯ Apologizes to furniture", "⌂ Calls errands adventures"],
    promptLabel: "My simple pleasure",
    promptAnswer: "Walking into a hardware store with no project and leaving with a new identity.",
    compatibility: 8,
    reason: "Your favorite colors share a zip code.",
    badReasons: ["The plant tested well with your demographic.", "You asked for emotional availability. He has store hours.", "Our model liked the size of that paintbrush."],
    accent: "#ffd52f",
    positions: ["50% 31%", "42% 42%", "65% 50%"],
  },
  {
    name: "Sloane",
    age: 28,
    image: "assets/sloane.png",
    alt: "Sloane holding a plush lobster and coffee at an aquarium gift shop",
    distance: "12",
    title: "Brand strategist · Deep-sea gossip",
    sticker: "Knows what ‘per my last email’ means",
    traits: ["✦ Returns library books", "☕ Judges your order", "♒ Befriends bartenders"],
    promptLabel: "The quickest way to my heart",
    promptAnswer: "Arrive with a strong opinion about aquariums and no evidence whatsoever.",
    compatibility: 91,
    reason: "You both looked at the moon this week.",
    badReasons: ["You have each consumed a beverage.", "Your profiles both contain nouns.", "She meets none of your filters, which felt refreshing to the server."],
    accent: "#294bff",
    positions: ["50% 26%", "37% 43%", "68% 53%"],
  },
  {
    name: "Beck",
    age: 33,
    image: "assets/beck.png",
    alt: "Beck holding a roller skate and giant cookbook between library shelves",
    distance: "0.3",
    title: "Archivist · Weeknight roller menace",
    sticker: "Your group chat is typing…",
    traits: ["▣ Alphabetizes snacks", "↺ Leaves parties early", "♬ Owns a tiny keyboard"],
    promptLabel: "A life goal of mine",
    promptAnswer: "To master one recipe so completely that no one asks about the other meals.",
    compatibility: 39,
    reason: "You both prefer plans that get canceled.",
    badReasons: ["The cookbook contains food. You need food.", "You dislike roller skating, so we prioritized it.", "Their sleep schedule overlaps with your screen time by four minutes."],
    accent: "#ff5a36",
    positions: ["50% 26%", "35% 45%", "67% 50%"],
  },
  {
    name: "Nia",
    age: 35,
    image: "assets/nia.png",
    alt: "Nia holding flowers and a yellow bucket at a car wash",
    distance: "23",
    title: "Emergency florist · Car-wash romantic",
    sticker: "Technically in your area",
    traits: ["☂ Carries hot sauce", "✿ Buys herself flowers", "⌁ Has exact change"],
    promptLabel: "We'll get along if",
    promptAnswer: "You understand that every errand improves with flowers and unnecessary urgency.",
    compatibility: 62,
    reason: "You both have unfinished laundry nearby.",
    badReasons: ["Distance is a social construct we monetized.", "She likes flowers. You have seen a flower.", "Your location permissions flickered at the same frequency."],
    accent: "#ffd52f",
    positions: ["50% 28%", "39% 43%", "66% 52%"],
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const els = {
  card: $("#profileCard"),
  photoWrap: $("#photoWrap"),
  photo: $("#profilePhoto"),
  dots: $("#photoDots"),
  name: $("#profileName"),
  age: $("#profileAge"),
  title: $("#profileTitle"),
  sticker: $("#cardSticker"),
  distance: $("#distance"),
  traits: $("#traitRow"),
  promptLabel: $("#promptLabel"),
  promptAnswer: $("#promptAnswer"),
  compatibilityValue: $("#compatibilityValue"),
  compatibilityBar: $("#compatibilityBar"),
  compatibilityReason: $("#compatibilityReason"),
  decisionButtons: $("#decisionButtons"),
  swapTimer: $("#swapTimer"),
  dignityValue: $("#dignityValue"),
  dignityBar: $("#dignityBar"),
  modalBackdrop: $("#modalBackdrop"),
  modalContent: $("#modalContent"),
  modalClose: $("#modalClose"),
  toastRegion: $("#toastRegion"),
  drawer: $("#drawer"),
  onboarding: $("#onboarding"),
  onboardingContent: $("#onboardingContent"),
  onboardingProgress: $("#onboardingProgress"),
  onboardingStepLabel: $("#onboardingStepLabel"),
  sabotageDial: $("#sabotageDial"),
  sabotageStatus: $("#sabotageStatus"),
  sabotageCopy: $("#sabotageCopy"),
  avatarInitials: $("#avatarInitials"),
  conversationList: $("#conversationList"),
  messageThread: $("#messageThread"),
  threadMessages: $("#threadMessages"),
  replyOptions: $("#replyOptions"),
  gifPicker: $("#gifPicker"),
  replyStatus: $("#replyStatus"),
  drawerTitle: $("#drawerTitle"),
  drawerKicker: $("#drawerKicker"),
  drawerNote: $("#drawerNote"),
  threadBack: $("#threadBack"),
};

const defaultUserProfile = {
  name: "Mysterious Liability",
  age: 30,
  title: "Between eras · Near a charger",
  evidence: "flash",
  traits: ["Overthinks punctuation", "Needs a little treat", "Says ‘we should’"],
  prompt: "My greatest strength",
  answer: "I can make any neutral interaction feel historically significant.",
  sabotage: 66,
};

const traitOptions = [
  "Overthinks punctuation", "Needs a little treat", "Says ‘we should’", "Reads menus early",
  "Owns an emotional tote bag", "Will pet every dog", "Replies in 3–5 days", "Has a chair pile",
];

const promptOptions = ["My greatest strength", "A fact about me that surprises people", "Together, we could", "My therapist would say"];

function copyProfile(profile = defaultUserProfile) {
  return { ...profile, traits: [...profile.traits] };
}

function loadUserProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem("dealbreaker-profile-v1"));
    return stored ? { ...copyProfile(), ...stored, traits: Array.isArray(stored.traits) ? stored.traits : [...defaultUserProfile.traits] } : null;
  } catch {
    return null;
  }
}

function saveUserProfile() {
  try { localStorage.setItem("dealbreaker-profile-v1", JSON.stringify(userProfile)); } catch {}
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function clamp(number, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, number));
}

let profileIndex = 0;
let photoIndex = 0;
let dignity = 73;
let secondsToSwap = 8;
let buttonsSwapped = false;
let lastFocused = null;
const storedUserProfile = loadUserProfile();
let userProfile = copyProfile(storedUserProfile || defaultUserProfile);
let draftProfile = copyProfile(userProfile);
let onboardingStep = 0;
let editingProfile = false;
let conversations = [];
let activeConversation = null;
let sendingMessage = false;

function getVisitorId() {
  try {
    const stored = localStorage.getItem("dealbreaker-visitor-v1");
    if (stored) return stored;
    const generated = crypto.randomUUID();
    localStorage.setItem("dealbreaker-visitor-v1", generated);
    return generated;
  } catch {
    return "00000000-0000-4000-8000-000000000001";
  }
}

const visitorId = getVisitorId();

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  els.toastRegion.append(node);
  window.setTimeout(() => node.remove(), 3000);
}

function updateDignity(amount) {
  dignity = Math.max(3, Math.min(100, dignity + amount));
  els.dignityValue.textContent = `${dignity}%`;
  els.dignityBar.style.width = `${dignity}%`;
}

function getSabotageMeta(value = userProfile.sabotage) {
  if (value < 20) return { status: "MERELY BAD", copy: "Occasionally checking the information you gave us." };
  if (value < 50) return { status: "NEGLIGENT", copy: "Prioritizing vibes over basic compatibility." };
  if (value < 80) return { status: "HOSTILE", copy: "Confusing proximity with chemistry." };
  return { status: "VENDETTA", copy: "Treating every dealbreaker as a personal challenge." };
}

function recommendationFor(profile) {
  const sabotage = clamp(Number(userProfile.sabotage) || 0, 0, 100);
  const ratio = sabotage / 100;
  const inverseScore = 100 - profile.compatibility;
  const jitter = (([...profile.name].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) + sabotage) % 13) - 6;
  const score = clamp(Math.round(profile.compatibility * (1 - ratio) + inverseScore * ratio + jitter * ratio), 3, 99);
  if (sabotage < 20) return { score, reason: profile.reason };
  const reasonIndex = sabotage < 50 ? 0 : sabotage < 80 ? 1 : 2;
  const personalFailure = userProfile.traits[0] || "having a personality";
  const reason = sabotage > 92
    ? `You admitted to “${personalFailure.toLowerCase()}.” We punished everyone.`
    : profile.badReasons[reasonIndex];
  return { score, reason };
}

function renderUserControls() {
  const sabotage = clamp(Number(userProfile.sabotage) || 0, 0, 100);
  const meta = getSabotageMeta(sabotage);
  els.sabotageDial.value = sabotage;
  els.sabotageStatus.textContent = meta.status;
  els.sabotageCopy.textContent = meta.copy;
  const initials = userProfile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  els.avatarInitials.textContent = initials || "YOU";
}

function renderProfile() {
  const profile = profiles[profileIndex];
  const recommendation = recommendationFor(profile);
  photoIndex = 0;
  els.photo.src = profile.image;
  els.photo.alt = profile.alt;
  els.photo.style.objectPosition = profile.positions[0];
  els.photo.classList.remove("blurry");
  els.photoWrap.classList.remove("blurry");
  els.name.textContent = profile.name;
  els.age.textContent = profile.age;
  els.title.textContent = profile.title;
  els.sticker.textContent = profile.sticker;
  els.distance.textContent = profile.distance;
  els.traits.innerHTML = profile.traits.map((trait) => `<span>${trait}</span>`).join("");
  els.promptLabel.textContent = profile.promptLabel;
  els.promptAnswer.textContent = profile.promptAnswer;
  els.compatibilityValue.textContent = `${recommendation.score}%`;
  els.compatibilityBar.style.width = `${recommendation.score}%`;
  els.compatibilityBar.style.background = profile.accent;
  els.compatibilityReason.textContent = recommendation.reason;
  updateDots();
}

function updateDots() {
  $$("#photoDots span").forEach((dot, index) => dot.classList.toggle("active", index === photoIndex));
  els.dots.setAttribute("aria-label", `Photo ${photoIndex + 1} of 3`);
}

function changePhoto(direction) {
  photoIndex = (photoIndex + direction + 3) % 3;
  els.photo.style.opacity = ".45";
  window.setTimeout(() => {
    els.photo.style.objectPosition = profiles[profileIndex].positions[photoIndex];
    els.photo.style.opacity = "1";
    updateDots();
  }, 120);
  if (photoIndex === 2) toast("Same photo, different crop. Our servers are tired.");
}

function nextProfile(direction = "right") {
  els.card.classList.add(direction === "left" ? "exit-left" : "exit-right");
  window.setTimeout(() => {
    profileIndex = (profileIndex + 1) % profiles.length;
    renderProfile();
    els.card.className = "profile-card enter";
    window.setTimeout(() => els.card.classList.remove("enter"), 520);
  }, 280);
}

function openModal(content) {
  lastFocused = document.activeElement;
  els.modalContent.innerHTML = content;
  els.modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  els.modalClose.focus();
}

function closeModal() {
  els.modalBackdrop.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

function acceptProfile() {
  const profile = profiles[profileIndex];
  updateDignity(-7);
  openModal(`
    <span class="modal-kicker">Mandatory compatibility trial</span>
    <h2>Prove you're wrong for ${profile.name}.</h2>
    <p>Behind one door is a match. Behind the others: emotional growth. Choose carelessly.</p>
    <div class="door-grid">
      <button class="door" data-door="1">?</button>
      <button class="door" data-door="2">?</button>
      <button class="door" data-door="3">?</button>
    </div>
    <p style="font-size:8px;opacity:.55;text-align:center">The correct answer changes when you hover. Legally, this is a game.</p>
  `);

  $$(".door").forEach((door) => {
    door.addEventListener("mouseenter", () => {
      door.style.order = String(Math.ceil(Math.random() * 3));
    });
    door.addEventListener("click", () => {
      els.modalContent.innerHTML = `
        <span class="modal-kicker">It's alarmingly mutual</span>
        <h2>You and ${profile.name} both chose poorly.</h2>
        <p>We've opened a chat and pre-filled it with “haha wow”. The rest of your life is your responsibility.</p>
        <div class="modal-actions">
          <button class="modal-action" id="sendHaha">Send “haha wow”</button>
          <button class="modal-action secondary" id="panicButton">Panic gracefully</button>
        </div>
      `;
      $("#sendHaha").addEventListener("click", () => {
        closeModal();
        toast(`“haha wow” sent to ${profile.name}. No edits.`);
        nextProfile("right");
      });
      $("#panicButton").addEventListener("click", () => {
        closeModal();
        toast("Panic recorded. Algorithm delighted.");
        nextProfile("right");
      });
    });
  });
}

function rejectProfile() {
  const profile = profiles[profileIndex];
  updateDignity(-2);
  openModal(`
    <span class="modal-kicker">Wow. Harsh.</span>
    <h2>But ${profile.name} already told their mom about you.</h2>
    <p>Would you like to crush two people at once, or reconsider based on guilt—the foundation of every healthy relationship?</p>
    <div class="modal-actions">
      <button class="modal-action" id="guiltLike">Fine, like them</button>
      <button class="modal-action secondary" id="doubleCrush">Crush two people</button>
    </div>
  `);
  $("#guiltLike").addEventListener("click", () => {
    closeModal();
    toast("Guilt converted into romance. Beautiful.");
    acceptProfile();
  });
  $("#doubleCrush").addEventListener("click", () => {
    closeModal();
    toast(`${profile.name} has been released back into the ecosystem.`);
    nextProfile("left");
  });
}

function handleDecision(event) {
  const visualSide = event.currentTarget === $("#rejectButton") ? "left" : "right";
  const intendedAction = visualSide === "left" ? "reject" : "accept";
  const action = buttonsSwapped ? (intendedAction === "reject" ? "accept" : "reject") : intendedAction;
  if (buttonsSwapped) toast("We swapped the consequences too. Tiny print!");
  action === "accept" ? acceptProfile() : rejectProfile();
}

function swapButtons() {
  buttonsSwapped = !buttonsSwapped;
  els.decisionButtons.classList.toggle("swapped", buttonsSwapped);
  secondsToSwap = 8;
  toast(buttonsSwapped ? "Buttons swapped. Muscle memory is the enemy." : "Buttons restored. Trust remains damaged.");
}

function askMom() {
  const profile = profiles[profileIndex];
  openModal(`
    <span class="modal-kicker">Calling mom…</span>
    <h2>She says ${profile.name} seems “nice.”</h2>
    <p>She based this on posture, lighting, and whether they look like they own a raincoat. She also wants to know if you're eating enough.</p>
    <div class="modal-actions"><button class="modal-action" id="momOkay">Tell her I'm fine</button></div>
  `);
  $("#momOkay").addEventListener("click", () => {
    closeModal();
    updateDignity(1);
    toast("She does not believe you.");
  });
}

async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "x-visitor-id": visitorId,
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "The server declined to elaborate.");
  return payload;
}

function relativeTime(timestamp) {
  const elapsed = Math.max(0, Date.now() - new Date(timestamp).getTime());
  if (elapsed < 60_000) return "now";
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m`;
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h`;
  return `${Math.floor(elapsed / 86_400_000)}d`;
}

function renderConversationList() {
  if (!conversations.length) {
    els.conversationList.innerHTML = `<div class="inbox-loading">No bad decisions yet. Suspicious.</div>`;
    return;
  }
  els.conversationList.innerHTML = conversations.map((conversation, index) => `
    <button class="message ${index < 2 ? "unread" : ""}" data-conversation-id="${escapeHTML(conversation.id)}">
      <span class="message-avatar ${escapeHTML(conversation.color)}">${escapeHTML(conversation.avatar)}</span>
      <span><b>${escapeHTML(conversation.name)}</b><small>${escapeHTML(conversation.lastMessage)}</small></span>
      <i>${relativeTime(conversation.lastMessageAt)}</i>
    </button>
  `).join("");
}

async function loadConversations() {
  els.conversationList.innerHTML = `<div class="inbox-loading"><span></span> Loading previous mistakes…</div>`;
  try {
    ({ conversations } = await apiFetch("/api/conversations"));
    renderConversationList();
  } catch (error) {
    els.conversationList.innerHTML = `<div class="inbox-loading">Inbox unavailable. ${escapeHTML(error.message)}</div>`;
  }
}

function messageMarkup(message) {
  const media = message.mediaUrl ? `<img class="chat-media" src="${escapeHTML(message.mediaUrl)}" alt="${escapeHTML(message.mediaAlt || "A reaction with no useful context")}">` : "";
  const body = message.type === "gif" ? "A GIF was deployed instead of a thought." : escapeHTML(message.body);
  return `
    <article class="chat-message ${message.sender === "you" ? "you" : "match"} ${escapeHTML(message.type || "text")}">
      ${media}
      <div class="chat-message-bubble">${body}</div>
      <small>${message.sender === "you" ? "you, under constraint" : "them, allegedly"} · ${relativeTime(message.createdAt)}</small>
    </article>
  `;
}

function renderThread(payload) {
  els.threadMessages.innerHTML = payload.messages.map(messageMarkup).join("");
  els.replyOptions.innerHTML = payload.replyOptions.map((option) => `
    <button class="reply-choice" data-reply-option="${escapeHTML(option.id)}">${escapeHTML(option.body)}</button>
  `).join("");
  els.gifPicker.innerHTML = payload.gifOptions.map((gif) => `
    <button class="gif-choice" data-gif-option="${escapeHTML(gif.id)}" aria-label="Send GIF: ${escapeHTML(gif.label)}">
      <img src="${escapeHTML(gif.url)}" alt="${escapeHTML(gif.label)}" loading="lazy">
      <span>${escapeHTML(gif.label)}</span>
    </button>
  `).join("");
  els.replyStatus.textContent = "Original thought has been disabled for quality assurance.";
  window.setTimeout(() => { els.threadMessages.scrollTop = els.threadMessages.scrollHeight; }, 0);
}

async function openConversation(conversationId) {
  const conversation = conversations.find((item) => item.id === conversationId);
  if (!conversation) return;
  activeConversation = conversation;
  els.drawer.classList.add("thread-open");
  els.conversationList.hidden = true;
  els.messageThread.hidden = false;
  els.threadBack.hidden = false;
  els.drawerKicker.textContent = "LIVE LIABILITY";
  els.drawerTitle.textContent = conversation.name;
  els.threadMessages.innerHTML = `<div class="inbox-loading"><span></span> Retrieving evidence…</div>`;
  els.replyOptions.innerHTML = "";
  try {
    renderThread(await apiFetch(`/api/conversations/${conversationId}/messages`));
  } catch (error) {
    els.threadMessages.innerHTML = `<div class="inbox-loading">Conversation unavailable. ${escapeHTML(error.message)}</div>`;
  }
}

function showConversationList() {
  activeConversation = null;
  els.drawer.classList.remove("thread-open");
  els.conversationList.hidden = false;
  els.messageThread.hidden = true;
  els.threadBack.hidden = true;
  els.drawerKicker.textContent = "INBOX";
  els.drawerTitle.textContent = "Bad decisions";
  els.gifPicker.hidden = true;
}

async function sendSelection(selection) {
  if (!activeConversation || sendingMessage) return;
  sendingMessage = true;
  $$(".reply-choice, .gif-choice").forEach((button) => { button.disabled = true; });
  els.replyStatus.textContent = "Sending the least defensible option…";
  try {
    const payload = await apiFetch(`/api/conversations/${activeConversation.id}/messages`, {
      method: "POST",
      body: JSON.stringify(selection),
    });
    renderThread(payload);
    const refreshed = await apiFetch("/api/conversations");
    conversations = refreshed.conversations;
  } catch (error) {
    els.replyStatus.textContent = error.message;
    $$(".reply-choice, .gif-choice").forEach((button) => { button.disabled = false; });
  } finally {
    sendingMessage = false;
  }
}

function openDrawer() {
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
  showConversationList();
  loadConversations();
  $("#drawerClose").focus();
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  showConversationList();
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
  els.onboardingStepLabel.textContent = `Evidence ${onboardingStep + 1} of 5`;
  els.onboardingProgress.style.width = `${(onboardingStep + 1) * 20}%`;

  if (onboardingStep === 0) {
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
        ${onboardingActions(editingProfile ? "Reopen the case" : "Fine, perceive me", { back: false })}
        <button class="onboarding-secondary" data-onboarding-action="defaults">Use suspicious defaults instead</button>
      </section>
    `);
  }

  if (onboardingStep === 1) {
    const evidence = [
      ["flash", "⚡", "Hostile flash"], ["pet", "🐕", "Pet takes your slot"], ["old", "◷", "2018 confidence"],
    ];
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Identity, allegedly</div>
      <h1 id="onboardingTitle">Give us a<br><em>usable rumor.</em></h1>
      <p>Your name may be real. Everything after that is between you and whatever “product manager” did this.</p>
    `, `
      <section class="onboarding-panel" data-stamp="PUBLIC INFORMATION">
        <h2>Basic evidence</h2>
        <p class="panel-help">Displayed publicly, judged privately, screenshotted immediately.</p>
        <div class="field-grid">
          <div class="profile-field"><label for="draftName">Name-ish</label><input id="draftName" data-draft="name" maxlength="32" value="${escapeHTML(draftProfile.name)}" autocomplete="name"></div>
          <div class="profile-field"><label for="draftAge">Age</label><input id="draftAge" data-draft="age" type="number" min="18" max="99" value="${escapeHTML(draftProfile.age)}"></div>
          <div class="profile-field wide"><label for="draftTitle">Occupation / ongoing situation</label><input id="draftTitle" data-draft="title" maxlength="70" value="${escapeHTML(draftProfile.title)}"></div>
        </div>
        <div class="choice-label" style="margin-top:18px">Choose your photographic defense</div>
        <div class="evidence-grid">
          ${evidence.map(([value, icon, label]) => `<button type="button" class="evidence-card ${draftProfile.evidence === value ? "selected" : ""}" data-evidence="${value}"><span>${icon}</span><small>${label}</small></button>`).join("")}
        </div>
        ${onboardingActions("This seems legally sufficient")}
      </section>
    `);
  }

  if (onboardingStep === 2) {
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Curate your warning label</div>
      <h1 id="onboardingTitle">Add some<br><em>texture.</em></h1>
      <p>Pick exactly three traits. Or two. We’re not the census. Then answer one prompt with the confidence of someone who has never been fact-checked.</p>
    `, `
      <section class="onboarding-panel" data-stamp="PERSONALITY SAMPLER">
        <div class="selection-count"><span class="choice-label">Select up to three allegations</span><strong id="traitCount">${draftProfile.traits.length}/3 selected</strong></div>
        <div class="chip-cloud">
          ${traitOptions.map((trait) => `<button type="button" class="onboarding-chip ${draftProfile.traits.includes(trait) ? "selected" : ""}" data-trait="${escapeHTML(trait)}">${escapeHTML(trait)}</button>`).join("")}
        </div>
        <div class="prompt-editor">
          <div class="profile-field">
            <label for="draftPrompt">Prompt selected by committee</label>
            <select id="draftPrompt" data-draft="prompt">${promptOptions.map((prompt) => `<option ${draftProfile.prompt === prompt ? "selected" : ""}>${escapeHTML(prompt)}</option>`).join("")}</select>
          </div>
          <div class="profile-field" style="margin-top:10px">
            <label for="draftAnswer">Your suspiciously polished answer</label>
            <textarea id="draftAnswer" data-draft="answer" maxlength="180">${escapeHTML(draftProfile.answer)}</textarea>
          </div>
        </div>
        ${onboardingActions("Weaponize this information")}
      </section>
    `);
  }

  if (onboardingStep === 3) {
    const meta = getSabotageMeta(draftProfile.sabotage);
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Calibration without oversight</div>
      <h1 id="onboardingTitle">How bad should<br><em>we be?</em></h1>
      <p>This setting is real. It changes the compatibility math and how aggressively we treat your boundaries as fun little dares.</p>
    `, `
      <section class="onboarding-panel" data-stamp="ALGORITHM POISONING">
        <h2>Recommendation sabotage</h2>
        <p class="panel-help">You can make this worse later. Personal growth!</p>
        <div class="sabotage-stage">
          <output id="draftSabotageValue">${draftProfile.sabotage}%</output>
          <input id="draftSabotage" data-draft="sabotage" type="range" min="0" max="100" value="${draftProfile.sabotage}">
          <div class="sabotage-labels"><span>Occasionally listens</span><span>Actively resents you</span></div>
          <div class="sabotage-verdict" id="draftSabotageVerdict"><strong>${meta.status}:</strong> ${meta.copy}</div>
        </div>
        ${onboardingActions("Ruin my recommendations")}
      </section>
    `);
  }

  if (onboardingStep === 4) {
    const evidenceIcon = { flash: "⚡", pet: "🐕", old: "◷" }[draftProfile.evidence] || "?";
    els.onboardingContent.innerHTML = onboardingShell(`
      <div class="eyebrow"><span></span> Ready for public consumption</div>
      <h1 id="onboardingTitle">Unfortunately,<br><em>that’s you.</em></h1>
      <p>Read it once. Regret it briefly. Release it into an ecosystem that has done nothing to deserve this.</p>
    `, `
      <section class="onboarding-panel" data-stamp="${editingProfile ? "AMENDED" : "QUESTIONABLY VERIFIED"}">
        <div class="review-card">
          <div class="review-avatar">${evidenceIcon}</div>
          <div>
            <h3>${escapeHTML(draftProfile.name)}, ${escapeHTML(draftProfile.age)}</h3>
            <p>${escapeHTML(draftProfile.title)}</p>
            <div class="review-traits">${draftProfile.traits.map((trait) => `<span>${escapeHTML(trait)}</span>`).join("")}</div>
          </div>
        </div>
        <div class="chaos-receipt">
          <div><span>${escapeHTML(draftProfile.prompt)}</span><b>${escapeHTML(draftProfile.answer.slice(0, 34))}${draftProfile.answer.length > 34 ? "…" : ""}</b></div>
          <div><span>Algorithm sabotage</span><b>${draftProfile.sabotage}%</b></div>
          <div><span>Chance this ends well</span><b>Unsupported</b></div>
        </div>
        ${onboardingActions(editingProfile ? "Save these allegations" : "Release me into the feed", { action: "finish" })}
      </section>
    `);
  }

  window.setTimeout(() => els.onboardingContent.querySelector("input, select, textarea, button")?.focus(), 0);
}

function showOnboardingError(message) {
  const error = $("#onboardingError");
  if (error) error.textContent = message;
  els.onboardingContent.querySelector(".onboarding-panel")?.classList.add("shake");
  window.setTimeout(() => els.onboardingContent.querySelector(".onboarding-panel")?.classList.remove("shake"), 400);
}

function startOnboarding(isEditing = false) {
  editingProfile = isEditing;
  draftProfile = copyProfile(userProfile);
  onboardingStep = isEditing ? 1 : 0;
  els.onboarding.hidden = false;
  document.body.style.overflow = "hidden";
  renderOnboarding();
}

function finishOnboarding(useDefaults = false) {
  userProfile = copyProfile(useDefaults ? defaultUserProfile : draftProfile);
  saveUserProfile();
  els.onboarding.hidden = true;
  document.body.style.overflow = "";
  renderUserControls();
  renderProfile();
  toast(useDefaults ? "A placeholder personality has been assigned." : editingProfile ? "Allegations amended." : "Profile live. Dignity pending.");
}

function openAccount() {
  const safeName = escapeHTML(userProfile.name);
  const safeTitle = escapeHTML(userProfile.title);
  openModal(`
    <span class="modal-kicker">Your public liability</span>
    <h2>${safeName}, ${escapeHTML(userProfile.age)}</h2>
    <p>${safeTitle}</p>
    <div class="review-traits">${userProfile.traits.map((trait) => `<span>${escapeHTML(trait)}</span>`).join("")}</div>
    <div class="chaos-receipt">
      <div><span>Profile honesty</span><b>41%</b></div>
      <div><span>Sabotage level</span><b>${userProfile.sabotage}%</b></div>
      <div><span>Reviewing raccoons</span><b>Three</b></div>
    </div>
    <div class="modal-actions">
      <button class="modal-action" id="editProfile">Edit my testimony</button>
      <button class="modal-action secondary" id="restartProfile">Erase me emotionally</button>
    </div>
  `);
}

$("#photoPrev").addEventListener("click", () => changePhoto(-1));
$("#photoNext").addEventListener("click", () => changePhoto(1));
$("#rejectButton").addEventListener("click", handleDecision);
$("#acceptButton").addEventListener("click", handleDecision);
$("#momButton").addEventListener("click", askMom);
$("#modalClose").addEventListener("click", closeModal);
els.modalBackdrop.addEventListener("click", (event) => { if (event.target === els.modalBackdrop) closeModal(); });
$("[data-panel='inbox']").addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
els.threadBack.addEventListener("click", showConversationList);
els.conversationList.addEventListener("click", (event) => {
  const conversation = event.target.closest("[data-conversation-id]");
  if (conversation) openConversation(conversation.dataset.conversationId);
});
els.replyOptions.addEventListener("click", (event) => {
  const option = event.target.closest("[data-reply-option]");
  if (option) sendSelection({ kind: "response", optionId: option.dataset.replyOption });
});
els.gifPicker.addEventListener("click", (event) => {
  const gif = event.target.closest("[data-gif-option]");
  if (gif) sendSelection({ kind: "gif", gifId: gif.dataset.gifOption });
});
$("#gifToggle").addEventListener("click", () => {
  els.gifPicker.hidden = !els.gifPicker.hidden;
  $("#gifToggle").textContent = els.gifPicker.hidden ? "GIF escape hatch" : "Hide visual panic";
});

$("[data-panel='account']").addEventListener("click", openAccount);

$(".onboarding-brand").addEventListener("click", (event) => {
  event.preventDefault();
  showOnboardingError("The logo is not an exit. It is branding.");
});

els.onboarding.addEventListener("click", (event) => {
  const evidence = event.target.closest("[data-evidence]");
  if (evidence) {
    draftProfile.evidence = evidence.dataset.evidence;
    $$("[data-evidence]").forEach((card) => card.classList.toggle("selected", card === evidence));
    return;
  }

  const trait = event.target.closest("[data-trait]");
  if (trait) {
    const value = trait.dataset.trait;
    if (draftProfile.traits.includes(value)) draftProfile.traits = draftProfile.traits.filter((item) => item !== value);
    else if (draftProfile.traits.length < 3) draftProfile.traits.push(value);
    else {
      showOnboardingError("Three allegations maximum. Save something for the second date.");
      return;
    }
    trait.classList.toggle("selected", draftProfile.traits.includes(value));
    $("#traitCount").textContent = `${draftProfile.traits.length}/3 selected`;
    return;
  }

  const actionButton = event.target.closest("[data-onboarding-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.onboardingAction;

  if (action === "defaults") {
    finishOnboarding(true);
    return;
  }
  if (action === "back") {
    onboardingStep = Math.max(editingProfile ? 1 : 0, onboardingStep - 1);
    renderOnboarding();
    return;
  }
  if (action === "finish") {
    finishOnboarding();
    return;
  }

  if (onboardingStep === 1) {
    const age = Number(draftProfile.age);
    if (!draftProfile.name.trim()) return showOnboardingError("Please provide at least one usable syllable.");
    if (!Number.isFinite(age) || age < 18 || age > 99) return showOnboardingError("This app is for adults between 18 and suspiciously immortal.");
    draftProfile.age = age;
    draftProfile.title = draftProfile.title.trim() || "Between eras · Near a charger";
  }
  if (onboardingStep === 2) {
    if (draftProfile.traits.length < 2) return showOnboardingError("Select at least two warning labels. Transparency matters.");
    if (draftProfile.answer.trim().length < 8) return showOnboardingError("Give the group chat at least eight characters to work with.");
    draftProfile.answer = draftProfile.answer.trim();
  }
  onboardingStep = Math.min(4, onboardingStep + 1);
  renderOnboarding();
});

els.onboarding.addEventListener("input", (event) => {
  const key = event.target.dataset.draft;
  if (!key) return;
  draftProfile[key] = key === "sabotage" ? Number(event.target.value) : event.target.value;
  if (key === "sabotage") {
    const meta = getSabotageMeta(draftProfile.sabotage);
    $("#draftSabotageValue").textContent = `${draftProfile.sabotage}%`;
    $("#draftSabotageVerdict").innerHTML = `<strong>${meta.status}:</strong> ${meta.copy}`;
  }
});

els.sabotageDial.addEventListener("input", () => {
  userProfile.sabotage = Number(els.sabotageDial.value);
  saveUserProfile();
  renderUserControls();
  renderProfile();
});

els.sabotageDial.addEventListener("change", () => {
  toast(`${getSabotageMeta().status}. The model has taken this personally.`);
});

$("#worsenButton").addEventListener("click", () => {
  const previous = userProfile.sabotage;
  userProfile.sabotage = Math.min(100, previous + 17);
  saveUserProfile();
  renderUserControls();
  renderProfile();
  updateDignity(-1);
  toast(previous === 100 ? "It is already as bad as governance permits." : "Recommendation quality successfully degraded.");
});

$("#termsButton").addEventListener("click", () => openModal(`
  <span class="modal-kicker">Regrettable terms</span>
  <h2>You agree to be perceived.</h2>
  <p>Dealbreaker may use your worst photo, favorite spoon, and typing cadence to infer your romantic destiny. We promise to be extremely confident and statistically unserious.</p>
  <div class="modal-actions"><button class="modal-action" id="acceptTerms">Accept under mild duress</button></div>
`));

$("#upgradeButton").addEventListener("click", () => openModal(`
  <span class="modal-kicker">Dealbreaker Plus</span>
  <h2>Pay more. Feel the same.</h2>
  <p>Unlock read receipts you cannot turn off, six additional ads, and the ability to see exactly who rejected you in 4K.</p>
  <div class="modal-actions"><button class="modal-action" id="fakePurchase">Worsen my experience — $18.99</button><button class="modal-action secondary" id="stayBasic">Remain merely unhappy</button></div>
`));

$$('[data-modal]').forEach((button) => button.addEventListener("click", () => {
  const kind = button.dataset.modal;
  const copy = {
    safety: ["Safety-ish", "Please meet in public, tell a friend where you're going, control what you share, and trust your instincts. This part is not a joke."],
    privacy: ["Privacy theater", "Your real privacy settings would live here. The confetti toggle would do nothing."],
    help: ["Help?", "Try turning your standards off and on again. For actual account support, imagine a useful link here."],
  }[kind];
  openModal(`<span class="modal-kicker">Fine print</span><h2>${copy[0]}</h2><p>${copy[1]}</p>`);
}));

document.addEventListener("click", (event) => {
  if (event.target.id === "acceptTerms") { closeModal(); toast("Perception enabled. Sorry."); }
  if (event.target.id === "fakePurchase") { closeModal(); toast("Payment failed successfully."); updateDignity(-4); }
  if (event.target.id === "stayBasic") { closeModal(); toast("A financially responsible romantic. Suspicious."); }
  if (event.target.id === "editProfile") { closeModal(); startOnboarding(true); }
  if (event.target.id === "restartProfile") {
    try { localStorage.removeItem("dealbreaker-profile-v1"); } catch {}
    userProfile = copyProfile(defaultUserProfile);
    closeModal();
    startOnboarding(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!els.modalBackdrop.hidden) closeModal();
    closeDrawer();
  }
  if (event.key === "ArrowLeft" && els.modalBackdrop.hidden && els.onboarding.hidden) changePhoto(-1);
  if (event.key === "ArrowRight" && els.modalBackdrop.hidden && els.onboarding.hidden) changePhoto(1);
});

window.setInterval(() => {
  secondsToSwap -= 1;
  els.swapTimer.textContent = `Buttons swap in ${String(secondsToSwap).padStart(2, "0")}s`;
  if (secondsToSwap <= 0) swapButtons();
}, 1000);

const tickerItems = [
  ["Someone 2 miles away", "just ignored several warning signs"],
  ["Megan, allegedly", "changed ‘hey’ to ‘heyy’"],
  ["A verified Capricorn", "deleted and retyped a message"],
  ["Your soulmate", "is currently updating their firmware"],
];
let tickerIndex = 0;
window.setInterval(() => {
  tickerIndex = (tickerIndex + 1) % tickerItems.length;
  $("#tickerName").textContent = tickerItems[tickerIndex][0];
  $("#tickerAction").textContent = tickerItems[tickerIndex][1];
}, 4300);

renderUserControls();
renderProfile();
if (!storedUserProfile) startOnboarding();
document.documentElement.dataset.appReady = "true";
