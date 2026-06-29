const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const crypto = require("node:crypto");
const { startServer } = require("./server");

let server;
let baseUrl;
const visitorId = crypto.randomUUID();

before(async () => {
  server = await startServer(0);
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test("health endpoint reports the local storage adapter", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, storage: "memory" });
});

test("conversation messages persist for a browser visitor", async () => {
  const headers = { "x-visitor-id": visitorId };
  const conversationsResponse = await fetch(`${baseUrl}/api/conversations`, { headers });
  const { conversations } = await conversationsResponse.json();
  assert.equal(conversationsResponse.status, 200);
  assert.equal(conversations.length, 3);

  const conversationId = conversations[0].id;
  const initialThread = await fetch(`${baseUrl}/api/conversations/${conversationId}/messages`, { headers }).then((response) => response.json());
  assert.equal(initialThread.replyOptions.length, 3);
  assert.equal(initialThread.gifOptions.length, 3);
  const selectedResponse = initialThread.replyOptions[0];
  const sendResponse = await fetch(`${baseUrl}/api/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ kind: "response", optionId: selectedResponse.id }),
  });
  const sent = await sendResponse.json();
  assert.equal(sendResponse.status, 201);
  assert.ok(sent.messages.length >= 3);
  assert.equal(sent.messages.at(-2).sender === "you" || sent.messages.at(-3).sender === "you", true);
  assert.equal(sent.messages.find((message) => message.selectedOption === selectedResponse.id).body, selectedResponse.body);
  assert.equal(sent.replyOptions.length, 3);

  const messagesResponse = await fetch(`${baseUrl}/api/conversations/${conversationId}/messages`, { headers });
  const { messages } = await messagesResponse.json();
  assert.equal(messagesResponse.status, 200);
  assert.ok(messages.length >= 3);
  assert.equal(messages.some((message) => message.body === selectedResponse.body), true);
});

test("arbitrary text, expired options, and invalid visitor IDs are rejected", async () => {
  const badVisitor = await fetch(`${baseUrl}/api/conversations`, { headers: { "x-visitor-id": "absolutely-not" } });
  assert.equal(badVisitor.status, 400);

  const conversations = await fetch(`${baseUrl}/api/conversations`, { headers: { "x-visitor-id": visitorId } }).then((response) => response.json());
  const arbitraryMessage = await fetch(`${baseUrl}/api/conversations/${conversations.conversations[0].id}/messages`, {
    method: "POST",
    headers: { "x-visitor-id": visitorId, "content-type": "application/json" },
    body: JSON.stringify({ body: "I found the text box anyway." }),
  });
  assert.equal(arbitraryMessage.status, 400);

  const inventedOption = await fetch(`${baseUrl}/api/conversations/${conversations.conversations[0].id}/messages`, {
    method: "POST",
    headers: { "x-visitor-id": visitorId, "content-type": "application/json" },
    body: JSON.stringify({ kind: "response", optionId: "the-sensible-thing" }),
  });
  assert.equal(inventedOption.status, 400);
});

test("curated GIFs are accepted as the only media a user can send", async () => {
  const headers = { "x-visitor-id": visitorId };
  const { conversations } = await fetch(`${baseUrl}/api/conversations`, { headers }).then((response) => response.json());
  const conversationId = conversations[1].id;
  const thread = await fetch(`${baseUrl}/api/conversations/${conversationId}/messages`, { headers }).then((response) => response.json());
  const selectedGif = thread.gifOptions[0];
  const response = await fetch(`${baseUrl}/api/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ kind: "gif", gifId: selectedGif.id }),
  });
  const payload = await response.json();
  assert.equal(response.status, 201);
  const gifMessage = payload.messages.find((message) => message.selectedOption === selectedGif.id);
  assert.equal(gifMessage.type, "gif");
  assert.equal(gifMessage.mediaUrl, selectedGif.url);
});

test("match replies occasionally include a context-free random image", async () => {
  const headers = { "x-visitor-id": visitorId };
  const { conversations } = await fetch(`${baseUrl}/api/conversations`, { headers }).then((response) => response.json());
  const conversationId = conversations[2].id;
  let thread = await fetch(`${baseUrl}/api/conversations/${conversationId}/messages`, { headers }).then((response) => response.json());
  let imageMessage;

  for (let attempt = 0; attempt < 12 && !imageMessage; attempt += 1) {
    thread = await fetch(`${baseUrl}/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: JSON.stringify({ kind: "response", optionId: thread.replyOptions[0].id }),
    }).then((response) => response.json());
    imageMessage = thread.messages.find((message) => message.type === "image");
  }

  assert.ok(imageMessage);
  assert.match(imageMessage.mediaUrl, /^\/assets\//);
});
