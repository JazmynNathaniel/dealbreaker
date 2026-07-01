import { els } from "./dom.js";
import { closeModal, openModal, toast } from "./overlays.js";
import { saveUserProfile, state } from "./state.js";
import { clamp } from "./utils.js";

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
export function updateDignity(amount) {
  state.dignity = Math.max(3, Math.min(100, state.dignity + amount));
  els.dignityValue.textContent = `${state.dignity}%`;
  els.dignityBar.style.width = `${state.dignity}%`;
}

export function getSabotageMeta(value = state.userProfile.sabotage) {
  if (value < 20) return { status: "MERELY BAD", copy: "Occasionally checking the information you gave us." };
  if (value < 50) return { status: "NEGLIGENT", copy: "Prioritizing vibes over basic compatibility." };
  if (value < 80) return { status: "HOSTILE", copy: "Confusing proximity with chemistry." };
  return { status: "VENDETTA", copy: "Treating every dealbreaker as a personal challenge." };
}

function recommendationFor(profile) {
  const sabotage = clamp(Number(state.userProfile.sabotage) || 0, 0, 100);
  const ratio = sabotage / 100;
  const inverseScore = 100 - profile.compatibility;
  const jitter = (([...profile.name].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) + sabotage) % 13) - 6;
  const score = clamp(Math.round(profile.compatibility * (1 - ratio) + inverseScore * ratio + jitter * ratio), 3, 99);
  if (sabotage < 20) return { score, reason: profile.reason };
  const reasonIndex = sabotage < 50 ? 0 : sabotage < 80 ? 1 : 2;
  const personalFailure = state.userProfile.traits[0] || "having a personality";
  const reason = sabotage > 92
    ? `You admitted to “${personalFailure.toLowerCase()}.” We punished everyone.`
    : profile.badReasons[reasonIndex];
  return { score, reason };
}

export function renderUserControls() {
  const sabotage = clamp(Number(state.userProfile.sabotage) || 0, 0, 100);
  const meta = getSabotageMeta(sabotage);
  els.sabotageDial.value = sabotage;
  els.sabotageStatus.textContent = meta.status;
  els.sabotageCopy.textContent = meta.copy;
  const initials = state.userProfile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  els.avatarInitials.textContent = initials || "YOU";
  els.avatarButton.classList.toggle("has-photo", Boolean(state.userPhotoUrl));
  els.avatarButton.style.backgroundImage = state.userPhotoUrl ? `url("${state.userPhotoUrl}")` : "";
}

export function renderProfile() {
  const profile = profiles[state.profileIndex];
  const recommendation = recommendationFor(profile);
  state.photoIndex = 0;
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
  els.photoDots.forEach((dot, index) => dot.classList.toggle("active", index === state.photoIndex));
  els.dots.setAttribute("aria-label", `Photo ${state.photoIndex + 1} of 3`);
}

export function changePhoto(direction) {
  state.photoIndex = (state.photoIndex + direction + 3) % 3;
  els.photo.style.opacity = ".45";
  window.setTimeout(() => {
    els.photo.style.objectPosition = profiles[state.profileIndex].positions[state.photoIndex];
    els.photo.style.opacity = "1";
    updateDots();
  }, 120);
  if (state.photoIndex === 2) toast("Same photo, different crop. Our servers are tired.");
}

function nextProfile(direction = "right") {
  els.card.classList.add(direction === "left" ? "exit-left" : "exit-right");
  window.setTimeout(() => {
    state.profileIndex = (state.profileIndex + 1) % profiles.length;
    renderProfile();
    els.card.className = "profile-card enter";
    window.setTimeout(() => els.card.classList.remove("enter"), 520);
  }, 280);
}

function acceptProfile() {
  const profile = profiles[state.profileIndex];
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

  els.modalContent.querySelectorAll(".door").forEach((door) => {
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
      els.modalContent.querySelector("#sendHaha").addEventListener("click", () => {
        closeModal();
        toast(`“haha wow” sent to ${profile.name}. No edits.`);
        nextProfile("right");
      });
      els.modalContent.querySelector("#panicButton").addEventListener("click", () => {
        closeModal();
        toast("Panic recorded. Algorithm delighted.");
        nextProfile("right");
      });
    });
  });
}

function rejectProfile() {
  const profile = profiles[state.profileIndex];
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
  els.modalContent.querySelector("#guiltLike").addEventListener("click", () => {
    closeModal();
    toast("Guilt converted into romance. Beautiful.");
    acceptProfile();
  });
  els.modalContent.querySelector("#doubleCrush").addEventListener("click", () => {
    closeModal();
    toast(`${profile.name} has been released back into the ecosystem.`);
    nextProfile("left");
  });
}

function handleDecision(event) {
  const visualSide = event.currentTarget === els.rejectButton ? "left" : "right";
  const intendedAction = visualSide === "left" ? "reject" : "accept";
  const action = state.buttonsSwapped ? (intendedAction === "reject" ? "accept" : "reject") : intendedAction;
  action === "accept" ? acceptProfile() : rejectProfile();
}

export function swapButtons() {
  state.buttonsSwapped = !state.buttonsSwapped;
  els.decisionButtons.classList.toggle("swapped", state.buttonsSwapped);
  state.secondsToSwap = 8;
}

function askMom() {
  const profile = profiles[state.profileIndex];
  openModal(`
    <span class="modal-kicker">Calling mom…</span>
    <h2>She says ${profile.name} seems “nice.”</h2>
    <p>She based this on posture, lighting, and whether they look like they own a raincoat. She also wants to know if you're eating enough.</p>
    <div class="modal-actions"><button class="modal-action" id="momOkay">Tell her I'm fine</button></div>
  `);
  els.modalContent.querySelector("#momOkay").addEventListener("click", () => {
    closeModal();
    updateDignity(1);
    toast("She does not believe you.");
  });
}

const tickerItems = [
  ["Someone 2 miles away", "just ignored several warning signs"],
  ["Megan, allegedly", "changed ‘hey’ to ‘heyy’"],
  ["A verified Capricorn", "deleted and retyped a message"],
  ["Your soulmate", "is currently updating their firmware"],
];

export function initFeed() {
  els.photoPrev.addEventListener("click", () => changePhoto(-1));
  els.photoNext.addEventListener("click", () => changePhoto(1));
  els.rejectButton.addEventListener("click", handleDecision);
  els.acceptButton.addEventListener("click", handleDecision);
  els.momButton.addEventListener("click", askMom);

  els.sabotageDial.addEventListener("input", () => {
    state.userProfile.sabotage = Number(els.sabotageDial.value);
    saveUserProfile();
    renderUserControls();
    renderProfile();
  });

  els.sabotageDial.addEventListener("change", () => {
    toast(`${getSabotageMeta().status}. The model has taken this personally.`);
  });

  els.worsenButton.addEventListener("click", () => {
    const previous = state.userProfile.sabotage;
    state.userProfile.sabotage = Math.min(100, previous + 17);
    saveUserProfile();
    renderUserControls();
    renderProfile();
    updateDignity(-1);
    toast(previous === 100 ? "It is already as bad as governance permits." : "Recommendation quality successfully degraded.");
  });

  window.setInterval(() => {
    state.secondsToSwap -= 1;
    if (state.secondsToSwap <= 0) swapButtons();
  }, 1000);

  window.setInterval(() => {
    state.tickerIndex = (state.tickerIndex + 1) % tickerItems.length;
    els.tickerName.textContent = tickerItems[state.tickerIndex][0];
    els.tickerAction.textContent = tickerItems[state.tickerIndex][1];
  }, 4300);
}
