export const defaultUserProfile = {
  name: "Mysterious Liability",
  age: 30,
  title: "Between eras · Near a charger",
  evidence: "flash",
  traits: ["Overthinks punctuation", "Needs a little treat", "Says ‘we should’"],
  prompt: "My greatest strength",
  answer: "I can make any neutral interaction feel historically significant.",
  sabotage: 66,
};

export function copyProfile(profile = defaultUserProfile) {
  return { ...profile, traits: [...profile.traits] };
}

function loadUserProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem("dealbreaker-profile-v1"));
    return stored
      ? {
          ...copyProfile(),
          ...stored,
          traits: Array.isArray(stored.traits) ? stored.traits : [...defaultUserProfile.traits],
        }
      : null;
  } catch {
    return null;
  }
}

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

export const state = (() => {
  const storedUserProfile = loadUserProfile();
  const userProfile = copyProfile(storedUserProfile || defaultUserProfile);

  return {
    profileIndex: 0,
    photoIndex: 0,
    dignity: 73,
    secondsToSwap: 8,
    buttonsSwapped: false,
    lastFocused: null,
    storedUserProfile,
    userProfile,
    draftProfile: copyProfile(userProfile),
    onboardingStep: 0,
    editingProfile: false,
    conversations: [],
    activeConversation: null,
    sendingMessage: false,
    giphyApiKey: null,
    giphyConfigLoaded: false,
    giphyRequestId: 0,
    userPhotoUrl: null,
    draftPhotoFile: null,
    draftPhotoRemoved: false,
    draftPhotoPreviewUrl: null,
    visitorId: getVisitorId(),
    tickerIndex: 0,
  };
})();

export function saveUserProfile() {
  try {
    localStorage.setItem("dealbreaker-profile-v1", JSON.stringify(state.userProfile));
  } catch {}
}

export function resetStoredUserProfile() {
  try {
    localStorage.removeItem("dealbreaker-profile-v1");
  } catch {}
  state.userProfile = copyProfile(defaultUserProfile);
}
