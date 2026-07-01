import { els } from "./dom.js";
import {
  changePhoto,
  initFeed,
  renderProfile,
  renderUserControls,
  swapButtons,
  updateDignity,
} from "./feed.js";
import { closeDrawer, initMessaging } from "./messaging.js";
import { initOnboarding, loadProfilePhoto, startOnboarding } from "./onboarding.js";
import { closeModal, initOverlays } from "./overlays.js";
import { resetStoredUserProfile, state } from "./state.js";

initFeed();
initMessaging();
initOnboarding();
initOverlays({
  startOnboarding,
  resetProfile: resetStoredUserProfile,
  updateDignity,
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!els.modalBackdrop.hidden) closeModal();
    closeDrawer();
  }
  if (event.key === "ArrowLeft" && els.modalBackdrop.hidden && els.onboarding.hidden) changePhoto(-1);
  if (event.key === "ArrowRight" && els.modalBackdrop.hidden && els.onboarding.hidden) changePhoto(1);
});

renderUserControls();
renderProfile();
loadProfilePhoto();
if (!state.storedUserProfile) startOnboarding();

window.__dealbreaker = Object.freeze({ state, renderProfile, swapButtons });
document.documentElement.dataset.appReady = "true";
