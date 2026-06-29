const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const appUrl = process.env.APP_URL || "http://127.0.0.1:4173/";

async function main() {
  const deadline = Date.now() + 15000;
  let target;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(appUrl)}`, { method: "PUT" });
      if (response.ok) {
        target = await response.json();
        break;
      }
    } catch {}
    await delay(400);
  }

  if (!target) throw new Error("Edge debugging endpoint did not become ready");

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  const exceptions = [];
  const failedRequests = [];
  const requestUrls = new Map();
  let messageId = 0;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails.text);
    if (message.method === "Network.requestWillBeSent") requestUrls.set(message.params.requestId, message.params.request.url);
    if (message.method === "Network.loadingFailed") {
      failedRequests.push({ url: requestUrls.get(message.params.requestId) || "unknown", error: message.params.errorText });
    }
  };

  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = () => reject(new Error("Could not open DevTools socket"));
  });

  function call(method, params = {}) {
    const id = ++messageId;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  }

  async function evaluate(expression) {
    const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  }

  await call("Runtime.enable");
  await call("Network.enable");
  await call("Page.enable");
  await call("Page.navigate", { url: appUrl });
  const expectedOrigin = new URL(appUrl).origin;
  let reachedOrigin = false;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    await delay(100);
    reachedOrigin = await evaluate(`location.origin === ${JSON.stringify(expectedOrigin)}`);
    if (reachedOrigin) break;
  }
  if (!reachedOrigin) throw new Error(`Browser did not reach ${expectedOrigin}`);
  await evaluate("localStorage.removeItem('dealbreaker-profile-v1')");
  await call("Page.reload", { ignoreCache: true });
  let appReady = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await delay(200);
    appReady = await evaluate("document.documentElement.dataset.appReady === 'true'");
    if (appReady) break;
  }
  if (!appReady) throw new Error("App did not reach its ready state");

  let initialPhotoReady = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    initialPhotoReady = await evaluate("document.querySelector('#profilePhoto')?.complete && document.querySelector('#profilePhoto')?.naturalWidth > 0");
    if (initialPhotoReady) break;
    await delay(100);
  }

  const initial = await evaluate(`({
    title: document.title,
    profile: document.querySelector('#profileName')?.textContent,
    cardVisible: getComputedStyle(document.querySelector('#profileCard')).display !== 'none',
    photoLoaded: ${initialPhotoReady},
    onboardingVisible: !document.querySelector('#onboarding')?.hidden,
    onboardingStep: document.querySelector('#onboardingStepLabel')?.textContent
  })`);

  if (process.env.CAPTURE_VISUALS === "1") {
    const shots = [
      ["dealbreaker-desktop.png", 1440, 1000, false],
      ["dealbreaker-mobile.png", 390, 844, true],
    ];
    for (const [filename, width, height, mobile] of shots) {
      await call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
      await delay(180);
      const capture = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      fs.writeFileSync(path.join(os.tmpdir(), filename), Buffer.from(capture.data, "base64"));
    }
    await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  }

  await evaluate("document.querySelector('[data-onboarding-action=next]').click()");
  await delay(120);
  await evaluate(`(async () => {
    const name = document.querySelector('#draftName');
    name.value = 'Test Liability';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    const blob = await fetch('assets/marina.png').then((response) => response.blob());
    const file = new File([blob], 'definitely-current.png', { type: 'image/png' });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    const input = document.querySelector('#draftPhoto');
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('[data-onboarding-action=next]').click();
  })()`);
  await delay(120);
  await evaluate("document.querySelector('[data-onboarding-action=next]').click()");
  await delay(120);
  await evaluate(`(() => {
    const dial = document.querySelector('#draftSabotage');
    dial.value = '88';
    dial.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-onboarding-action=next]').click();
  })()`);
  await delay(120);
  const onboardingReview = await evaluate(`({
    reviewVisible: document.querySelector('#onboardingContent')?.innerText.includes('Test Liability'),
    sabotageVisible: document.querySelector('#onboardingContent')?.innerText.includes('88%'),
    photoVisible: Boolean(document.querySelector('.review-avatar img'))
  })`);
  await evaluate("document.querySelector('[data-onboarding-action=finish]').click()");
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await delay(100);
    if (await evaluate("document.querySelector('#onboarding').hidden")) break;
  }
  const onboardingComplete = await evaluate(`({
    hidden: document.querySelector('#onboarding').hidden,
    initials: document.querySelector('#avatarInitials').textContent,
    avatarHasPhoto: document.querySelector('[data-panel=account]').classList.contains('has-photo'),
    savedName: JSON.parse(localStorage.getItem('dealbreaker-profile-v1')).name,
    sabotage: document.querySelector('#sabotageDial').value
  })`);
  const photoStored = await evaluate(`fetch('/api/profile-photo', {
    headers: { 'x-visitor-id': visitorId }
  }).then((response) => ({ status: response.status, type: response.headers.get('content-type') }))`);

  await evaluate("document.querySelector('#subscriptionButton').click()");
  await delay(80);
  const subscription = await evaluate(`({
    opens: document.querySelector('#modalContent').innerText.includes('Subscribe to Nothing+'),
    promisesNothing: document.querySelector('#modalContent').innerText.includes('Additional matches')
      && document.querySelector('#modalContent').innerText.includes('0')
  })`);
  await evaluate("document.querySelector('#modalClose').click()");

  await evaluate("document.querySelector('#acceptButton').click()");
  await delay(250);
  const matchTrial = await evaluate("document.querySelector('#modalContent').innerText.includes('Prove you')");
  if (!matchTrial) {
    const diagnostic = await evaluate(`({
      modal: document.querySelector('#modalContent').innerText,
      swappedClass: document.querySelector('#decisionButtons').classList.contains('swapped'),
      acceptLabel: document.querySelector('#acceptButton').innerText
    })`);
    throw new Error(`Accept branch diagnostic: ${JSON.stringify(diagnostic)}`);
  }
  await evaluate("document.querySelector('.door').click()");
  await delay(200);
  const mutual = await evaluate("document.querySelector('#modalContent').innerText.toLowerCase().includes('alarmingly mutual')");
  await evaluate("document.querySelector('#sendHaha').click()");
  await delay(800);
  const secondProfile = await evaluate("document.querySelector('#profileName').textContent");

  await evaluate("document.querySelector('#rejectButton').click()");
  await delay(200);
  const rejectionGuilt = await evaluate("document.querySelector('#modalContent').innerText.includes('already told their mom')");
  await evaluate("document.querySelector('#doubleCrush').click()");
  await delay(700);
  const thirdProfile = await evaluate("document.querySelector('#profileName').textContent");

  const generatedProfilesLoaded = await evaluate(`Promise.all([
    'assets/ravi.png', 'assets/sloane.png', 'assets/beck.png', 'assets/nia.png'
  ].map((src) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  }))).then((results) => results.every(Boolean))`);

  if (process.env.CAPTURE_VISUALS === "1") {
    await evaluate("profileIndex = 3; renderProfile()");
    await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await delay(250);
    const feedCapture = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(os.tmpdir(), "dealbreaker-feed.png"), Buffer.from(feedCapture.data, "base64"));
  }

  await evaluate("document.querySelector('[data-panel=inbox]').click()");
  let inboxReady = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await delay(100);
    inboxReady = await evaluate("document.querySelectorAll('[data-conversation-id]').length === 3");
    if (inboxReady) break;
  }
  await evaluate("document.querySelector('[data-conversation-id]').click()");
  let threadReady = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await delay(100);
    threadReady = await evaluate("document.querySelectorAll('[data-reply-option]').length === 3");
    if (threadReady) break;
  }
  const constrainedComposer = await evaluate(`({
    replyCount: document.querySelectorAll('[data-reply-option]').length,
    gifCount: document.querySelectorAll('[data-gif-option]').length,
    hasFreeText: Boolean(document.querySelector('#messageThread textarea, #messageThread input[type=text]')),
    initialMessages: document.querySelectorAll('.chat-message').length
  })`);
  await evaluate("document.querySelector('[data-reply-option]').click()");
  let selectedReplyRendered = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await delay(100);
    selectedReplyRendered = await evaluate(`document.querySelectorAll('.chat-message').length > ${constrainedComposer.initialMessages}`);
    if (selectedReplyRendered) break;
  }
  await evaluate("document.querySelector('#gifToggle').click(); document.querySelector('[data-gif-option]').click()");
  let gifRendered = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await delay(100);
    gifRendered = await evaluate("Boolean(document.querySelector('.chat-message.gif'))");
    if (gifRendered) break;
  }
  const arbitraryTextStatus = await evaluate(`fetch('/api/conversations/' + activeConversation.id + '/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-visitor-id': visitorId },
    body: JSON.stringify({ body: 'I reject your constraints.' })
  }).then((response) => response.status)`);
  const silentSwap = await evaluate(`(() => {
    const toastCount = document.querySelectorAll('.toast').length;
    const before = document.querySelector('#decisionButtons').classList.contains('swapped');
    swapButtons();
    return {
      changed: before !== document.querySelector('#decisionButtons').classList.contains('swapped'),
      noNewToast: toastCount === document.querySelectorAll('.toast').length,
      indicatorRemoved: !document.querySelector('.swap-warning') && !document.body.innerText.includes('Buttons swap in')
    };
  })()`);

  const report = {
    initial,
    onboarding: { review: onboardingReview, complete: onboardingComplete, photoStored },
    subscription,
    flows: { matchTrial, mutual, secondProfile, rejectionGuilt, thirdProfile, generatedProfilesLoaded },
    messaging: { inboxReady, threadReady, constrainedComposer, selectedReplyRendered, gifRendered, arbitraryTextStatus },
    silentSwap,
    exceptions,
    failedRequests,
  };

  const appDirectory = appUrl.slice(0, appUrl.lastIndexOf("/") + 1);
  const failedAppRequests = failedRequests.filter((request) => (
    request.url.startsWith(appDirectory) && request.error !== "net::ERR_ABORTED"
  ));

  const passed = initial.title.includes("DEALBREAKER")
    && initial.profile === "Marina"
    && initial.cardVisible
    && initial.photoLoaded
    && initial.onboardingVisible
    && initial.onboardingStep === "Evidence 1 of 5"
    && onboardingReview.reviewVisible
    && onboardingReview.sabotageVisible
    && onboardingReview.photoVisible
    && onboardingComplete.hidden
    && onboardingComplete.initials === "TL"
    && onboardingComplete.avatarHasPhoto
    && onboardingComplete.savedName === "Test Liability"
    && onboardingComplete.sabotage === "88"
    && photoStored.status === 200
    && photoStored.type === "image/png"
    && subscription.opens
    && subscription.promisesNothing
    && matchTrial
    && mutual
    && secondProfile === "Theo"
    && rejectionGuilt
    && thirdProfile === "Jules"
    && generatedProfilesLoaded
    && inboxReady
    && threadReady
    && constrainedComposer.replyCount === 3
    && constrainedComposer.gifCount === 3
    && !constrainedComposer.hasFreeText
    && selectedReplyRendered
    && gifRendered
    && arbitraryTextStatus === 400
    && silentSwap.changed
    && silentSwap.noNewToast
    && silentSwap.indicatorRemoved
    && exceptions.length === 0
    && failedAppRequests.length === 0;

  console.log(JSON.stringify({ passed, ...report }, null, 2));
  socket.close();
  process.exit(passed ? 0 : 1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
