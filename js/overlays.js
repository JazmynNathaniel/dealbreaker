import { els } from "./dom.js";
import { state } from "./state.js";

export function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  els.toastRegion.append(node);
  window.setTimeout(() => node.remove(), 3000);
}
export function openModal(content) {
  state.lastFocused = document.activeElement;
  els.modalContent.innerHTML = content;
  els.modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  els.modalClose.focus();
}

export function closeModal() {
  els.modalBackdrop.hidden = true;
  document.body.style.overflow = "";
  if (state.lastFocused) state.lastFocused.focus();
}

function openNothingPlus() {
  openModal(`
    <span class="modal-kicker">A premium absence</span>
    <h2>Subscribe to Nothing+.</h2>
    <p>For $14.99 every month, enjoy the exact same app with the warm administrative knowledge that a recurring charge exists.</p>
    <div class="subscription-ledger">
      <div><span>Additional matches</span><strong>0</strong></div>
      <div><span>Improved recommendations</span><strong>Absolutely not</strong></div>
      <div><span>Exclusive badge</span><strong>Visible only to accounting</strong></div>
      <div><span>Cancellation process</span><strong>Emotionally seasonal</strong></div>
    </div>
    <div class="modal-actions">
      <button class="modal-action" id="fakePurchase">Begin paying for the concept of access</button>
      <button class="modal-action secondary" id="stayBasic">Keep this money for one medium sandwich</button>
    </div>
  `);
}

export function initOverlays({ startOnboarding, resetProfile, updateDignity }) {
  els.modalClose.addEventListener("click", closeModal);
  els.modalBackdrop.addEventListener("click", (event) => {
    if (event.target === els.modalBackdrop) closeModal();
  });

  els.termsButton.addEventListener("click", () => openModal(`
    <span class="modal-kicker">Regrettable terms</span>
    <h2>You agree to be perceived.</h2>
    <p>Dealbreaker may use your worst photo, favorite spoon, and typing cadence to infer your romantic destiny. We promise to be extremely confident and statistically unserious.</p>
    <div class="modal-actions"><button class="modal-action" id="acceptTerms">Accept under mild duress</button></div>
  `));

  els.subscriptionButton.addEventListener("click", openNothingPlus);
  els.upgradeButton.addEventListener("click", openNothingPlus);

  els.footerModalButtons.forEach((button) => button.addEventListener("click", () => {
    const copy = {
      safety: ["Safety-ish", "Please meet in public, tell a friend where you're going, control what you share, and trust your instincts. This part is not a joke."],
      privacy: ["Privacy theater", "Your real privacy settings would live here. The confetti toggle would do nothing."],
      help: ["Help?", "Try turning your standards off and on again. For actual account support, imagine a useful link here."],
    }[button.dataset.modal];
    openModal(`<span class="modal-kicker">Fine print</span><h2>${copy[0]}</h2><p>${copy[1]}</p>`);
  }));

  document.addEventListener("click", (event) => {
    if (event.target.id === "acceptTerms") { closeModal(); toast("Perception enabled. Sorry."); }
    if (event.target.id === "fakePurchase") { closeModal(); toast("Payment failed successfully. Benefits remain fully delivered."); updateDignity(-4); }
    if (event.target.id === "stayBasic") { closeModal(); toast("Sandwich liquidity preserved."); }
    if (event.target.id === "editProfile") { closeModal(); startOnboarding(true); }
    if (event.target.id === "restartProfile") { resetProfile(); closeModal(); startOnboarding(false); }
  });
}
