import { apiFetch } from "./api.js";
import { els } from "./dom.js";
import { state } from "./state.js";
import { escapeHTML } from "./utils.js";

function relativeTime(timestamp) {
  const elapsed = Math.max(0, Date.now() - new Date(timestamp).getTime());
  if (elapsed < 60_000) return "now";
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m`;
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h`;
  return `${Math.floor(elapsed / 86_400_000)}d`;
}

function renderConversationList() {
  if (!state.conversations.length) {
    els.conversationList.innerHTML = `<div class="inbox-loading">No bad decisions yet. Suspicious.</div>`;
    return;
  }
  els.conversationList.innerHTML = state.conversations.map((conversation, index) => `
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
    state.conversations = (await apiFetch("/api/conversations")).conversations;
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

function renderGifChoices(gifs, emptyMessage = "No moving pictures were willing to participate.") {
  if (!gifs.length) {
    els.gifResults.innerHTML = `<div class="gif-empty">${escapeHTML(emptyMessage)}</div>`;
    return;
  }
  els.gifResults.innerHTML = gifs.map((gif) => `
    <button class="gif-choice" data-gif-option="${escapeHTML(gif.id)}" aria-label="Send GIF: ${escapeHTML(gif.label)}">
      <img src="${escapeHTML(gif.url)}" alt="${escapeHTML(gif.label)}" loading="lazy">
      <span>${escapeHTML(gif.label)}</span>
    </button>
  `).join("");
}

async function loadGiphyConfig() {
  if (state.giphyConfigLoaded) return state.giphyApiKey;
  state.giphyConfigLoaded = true;
  try {
    const response = await fetch("/api/config", { headers: { "x-visitor-id": state.visitorId } });
    if (response.ok) state.giphyApiKey = (await response.json()).giphyApiKey;
  } catch {}
  return state.giphyApiKey;
}

async function searchGiphy(query = "") {
  const requestId = ++state.giphyRequestId;
  const apiKey = await loadGiphyConfig();
  if (!apiKey || requestId !== state.giphyRequestId) {
    els.replyStatus.textContent = "GIPHY is unavailable. The emergency GIF ration remains.";
    return;
  }

  els.gifResults.innerHTML = `<div class="inbox-loading"><span></span> Consulting the moving-image oracle…</div>`;
  els.replyStatus.textContent = query ? `Searching GIPHY for “${query}”…` : "Loading trending emotional substitutes…";
  const endpoint = query ? "search" : "trending";
  const parameters = new URLSearchParams({
    api_key: apiKey,
    limit: "9",
    rating: "pg-13",
    bundle: "messaging_non_clips",
    customer_id: state.visitorId,
  });
  if (query) parameters.set("q", query);

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/${endpoint}?${parameters}`);
    if (!response.ok) throw new Error("GIPHY declined to move at this time.");
    const payload = await response.json();
    if (requestId !== state.giphyRequestId) return;
    const gifs = payload.data.map((gif) => ({
      id: gif.id,
      label: gif.title || "Untitled emotional evidence",
      url: gif.images?.fixed_width?.url || gif.images?.fixed_height?.url || gif.images?.original?.url,
    })).filter((gif) => gif.id && gif.url);
    renderGifChoices(gifs, `No GIFs understood “${query}.” Honestly, fair.`);
    els.replyStatus.textContent = query ? "Pick one before context improves." : "Trending because language has failed at scale.";
  } catch (error) {
    if (requestId !== state.giphyRequestId) return;
    els.replyStatus.textContent = error.message;
    els.gifResults.innerHTML = `<div class="gif-empty">The GIF oracle is buffering spiritually.</div>`;
  }
}

function renderThread(payload) {
  els.threadMessages.innerHTML = payload.messages.map(messageMarkup).join("");
  els.replyOptions.innerHTML = payload.replyOptions.map((option) => `
    <button class="reply-choice" data-reply-option="${escapeHTML(option.id)}">${escapeHTML(option.body)}</button>
  `).join("");
  renderGifChoices(payload.gifOptions);
  els.replyStatus.textContent = "Original thought has been disabled for quality assurance.";
  window.setTimeout(() => { els.threadMessages.scrollTop = els.threadMessages.scrollHeight; }, 0);
}

async function openConversation(conversationId) {
  const conversation = state.conversations.find((item) => item.id === conversationId);
  if (!conversation) return;
  state.activeConversation = conversation;
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
  state.activeConversation = null;
  els.drawer.classList.remove("thread-open");
  els.conversationList.hidden = false;
  els.messageThread.hidden = true;
  els.threadBack.hidden = true;
  els.drawerKicker.textContent = "INBOX";
  els.drawerTitle.textContent = "Bad decisions";
  els.gifPicker.hidden = true;
}

function setReplyChoicesDisabled(disabled) {
  els.drawer.querySelectorAll(".reply-choice, .gif-choice").forEach((button) => {
    button.disabled = disabled;
  });
}

async function sendSelection(selection) {
  if (!state.activeConversation || state.sendingMessage) return;
  state.sendingMessage = true;
  setReplyChoicesDisabled(true);
  els.replyStatus.textContent = "Sending the least defensible option…";
  try {
    const payload = await apiFetch(`/api/conversations/${state.activeConversation.id}/messages`, {
      method: "POST",
      body: JSON.stringify(selection),
    });
    state.sendingMessage = false;
    renderThread(payload);
    apiFetch("/api/conversations")
      .then((refreshed) => { state.conversations = refreshed.conversations; })
      .catch(() => {});
  } catch (error) {
    state.sendingMessage = false;
    els.replyStatus.textContent = error.message;
    setReplyChoicesDisabled(false);
  }
}

function openDrawer() {
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
  showConversationList();
  loadConversations();
  els.drawerClose.focus();
}

export function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  showConversationList();
}

export function initMessaging() {
  els.inboxButton.addEventListener("click", openDrawer);
  els.drawerClose.addEventListener("click", closeDrawer);
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

  els.gifToggle.addEventListener("click", () => {
    els.gifPicker.hidden = !els.gifPicker.hidden;
    els.gifToggle.textContent = els.gifPicker.hidden ? "GIF escape hatch" : "Hide visual panic";
    if (!els.gifPicker.hidden) searchGiphy(els.gifSearchInput.value.trim());
  });

  els.gifSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchGiphy(els.gifSearchInput.value.trim());
  });
}
