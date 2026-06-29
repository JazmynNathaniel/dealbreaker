const crypto = require("node:crypto");
const path = require("node:path");
const express = require("express");
const { Pool } = require("pg");

const app = express();
const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl ? new Pool({
  connectionString: databaseUrl,
  max: Number(process.env.DB_POOL_MAX) || 5,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
}) : null;
const memoryVisitors = new Map();

const seedProfiles = [
  {
    key: "mystery",
    name: "Mystery person",
    avatar: "M",
    color: "coral",
    greeting: "hey (I drafted something better but panicked)",
  },
  {
    key: "algorithm",
    name: "Your algorithm",
    avatar: "?",
    color: "blue",
    greeting: "We need to talk. Your filters hurt our feelings.",
  },
  {
    key: "dad-joke",
    name: "Dad joke enjoyer",
    avatar: "D",
    color: "yellow",
    greeting: "I was typing for 47 minutes. This is all I have.",
  },
];

const matchReplies = {
  mystery: [
    "wow okay suddenly this is a conversation",
    "I showed this to my roommate. The review was mixed.",
    "Sorry, I was being mysterious on purpose.",
  ],
  algorithm: [
    "Interesting. We will misinterpret that immediately.",
    "Your feedback has been converted into a less useful metric.",
    "Thank you. Your compatibility score is now legally decorative.",
  ],
  "dad-joke": [
    "I had a chemistry joke, but there was no reaction.",
    "This is going well if neither of us checks.",
    "My typing indicator has more emotional range than I do.",
  ],
};

const responseChoices = {
  mystery: [
    { id: "mystery-define-hey", body: "I need you to define ‘hey’ before we continue." },
    { id: "mystery-condolences", body: "Thank you for your vulnerability during this difficult time." },
    { id: "mystery-dinosaur", body: "This reminds me of the Jurassic Park score." },
    { id: "mystery-landlord", body: "My landlord would disagree, but go off." },
    { id: "mystery-home", body: "I should probably go. I am already home." },
  ],
  algorithm: [
    { id: "algorithm-appeal", body: "I would like to appeal my romantic credit score." },
    { id: "algorithm-weather", body: "Is it raining where you are, or is that just data?" },
    { id: "algorithm-proud", body: "I’m proud of you for telling me this. I think." },
    { id: "algorithm-receipt", body: "Please provide a receipt for that emotion." },
    { id: "algorithm-unsubscribe", body: "UNSUBSCRIBE (emotionally)" },
  ],
  "dad-joke": [
    { id: "dad-lease", body: "That joke has six months left on its lease." },
    { id: "dad-witness", body: "I wish I had brought a witness." },
    { id: "dad-grandma", body: "My grandma would love this and that scares me." },
    { id: "dad-orbit", body: "Do you think the moon knows about us?" },
    { id: "dad-meeting", body: "Can we circle back after I become a different person?" },
  ],
};

const gifChoices = [
  { id: "gif-typing-cat", label: "Cat typing with dangerous confidence", url: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" },
  { id: "gif-this-is-fine", label: "Everything is demonstrably fine", url: "https://media.giphy.com/media/QMHoU66sBXqqLqYvGO/giphy.gif" },
  { id: "gif-confused", label: "Looking around for context", url: "https://media.giphy.com/media/6uGhT1O4sxpi8/giphy.gif" },
];

const randomImages = [
  { url: "/assets/ravi.png", alt: "Ravi holding a plant and an enormous paintbrush" },
  { url: "/assets/sloane.png", alt: "Sloane holding a plush lobster at an aquarium gift shop" },
  { url: "/assets/beck.png", alt: "Beck holding a roller skate and a giant cookbook" },
  { url: "/assets/nia.png", alt: "Nia holding flowers and a yellow bucket at a car wash" },
];

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use("/api", (_request, response, next) => {
  response.set("Cache-Control", "no-store");
  next();
});

function visitorIdFrom(request) {
  const visitorId = request.get("x-visitor-id") || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId)) {
    const error = new Error("A valid visitor ID is required.");
    error.status = 400;
    throw error;
  }
  return visitorId;
}

function chooseReply(profileKey, body) {
  const options = matchReplies[profileKey] || ["Message received with deeply unclear intentions."];
  const score = [...body].reduce((sum, character) => sum + character.charCodeAt(0), body.length);
  return options[score % options.length];
}

function availableResponses(profileKey, messageCount) {
  const options = responseChoices[profileKey] || responseChoices.algorithm;
  const offset = Math.floor(messageCount / 2) % options.length;
  return [0, 1, 2].map((step) => options[(offset + step) % options.length]);
}

function shouldAttachRandomImage(body, messageCount) {
  const score = [...body].reduce((sum, character) => sum + character.charCodeAt(0), messageCount);
  return score % 4 === 0;
}

function publicConversation(conversation) {
  return {
    id: String(conversation.id),
    profileKey: conversation.profile_key,
    name: conversation.profile_name,
    avatar: conversation.avatar,
    color: conversation.color,
    lastMessage: conversation.last_message || "No messages. A rare victory.",
    lastMessageAt: conversation.last_message_at || conversation.created_at,
  };
}

function publicMessage(message) {
  return {
    id: String(message.id),
    sender: message.sender,
    body: message.body,
    type: message.message_type || "text",
    mediaUrl: message.media_url || null,
    mediaAlt: message.media_alt || null,
    selectedOption: message.selected_option || null,
    createdAt: message.created_at,
  };
}

async function initializeDatabase() {
  if (!pool) {
    console.log("DATABASE_URL is not set; using the in-memory messaging sandbox.");
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id BIGSERIAL PRIMARY KEY,
      visitor_id UUID NOT NULL,
      profile_key TEXT NOT NULL,
      profile_name TEXT NOT NULL,
      avatar VARCHAR(2) NOT NULL,
      color VARCHAR(16) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (visitor_id, profile_key)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender VARCHAR(10) NOT NULL CHECK (sender IN ('you', 'match', 'system')),
      body VARCHAR(500) NOT NULL CHECK (char_length(body) BETWEEN 1 AND 500),
      message_type VARCHAR(12) NOT NULL DEFAULT 'text',
      media_url TEXT,
      media_alt TEXT,
      selected_option TEXT,
      seed_key TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (conversation_id, seed_key)
    );

    ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(12) NOT NULL DEFAULT 'text';
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url TEXT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_alt TEXT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS selected_option TEXT;

    CREATE INDEX IF NOT EXISTS conversations_visitor_idx ON conversations(visitor_id);
    CREATE INDEX IF NOT EXISTS messages_conversation_time_idx ON messages(conversation_id, created_at);
  `);

  console.log("PostgreSQL messaging schema is ready.");
}

function ensureMemoryVisitor(visitorId) {
  if (!memoryVisitors.has(visitorId)) {
    const now = new Date();
    const conversations = seedProfiles.map((profile, index) => {
      const conversationId = crypto.randomUUID();
      const createdAt = new Date(now.getTime() - (seedProfiles.length - index) * 3_600_000).toISOString();
      return {
        id: conversationId,
        visitor_id: visitorId,
        profile_key: profile.key,
        profile_name: profile.name,
        avatar: profile.avatar,
        color: profile.color,
        created_at: createdAt,
        messages: [{ id: crypto.randomUUID(), sender: "match", body: profile.greeting, created_at: createdAt }],
      };
    });
    memoryVisitors.set(visitorId, conversations);
  }
  return memoryVisitors.get(visitorId);
}

async function seedPostgresVisitor(visitorId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const profile of seedProfiles) {
      const conversation = await client.query(`
        INSERT INTO conversations (visitor_id, profile_key, profile_name, avatar, color)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (visitor_id, profile_key) DO UPDATE SET profile_name = EXCLUDED.profile_name
        RETURNING id
      `, [visitorId, profile.key, profile.name, profile.avatar, profile.color]);
      await client.query(`
        INSERT INTO messages (conversation_id, sender, body, seed_key)
        VALUES ($1, 'match', $2, 'initial-greeting')
        ON CONFLICT (conversation_id, seed_key) DO NOTHING
      `, [conversation.rows[0].id, profile.greeting]);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function listConversations(visitorId) {
  if (!pool) {
    return ensureMemoryVisitor(visitorId).map((conversation) => {
      const latest = conversation.messages.at(-1);
      return publicConversation({ ...conversation, last_message: latest.body, last_message_at: latest.created_at });
    }).sort((left, right) => new Date(right.lastMessageAt) - new Date(left.lastMessageAt));
  }

  await seedPostgresVisitor(visitorId);
  const result = await pool.query(`
    SELECT c.*, latest.body AS last_message, latest.created_at AS last_message_at
    FROM conversations c
    LEFT JOIN LATERAL (
      SELECT body, created_at FROM messages
      WHERE conversation_id = c.id
      ORDER BY created_at DESC, id DESC LIMIT 1
    ) latest ON TRUE
    WHERE c.visitor_id = $1
    ORDER BY latest.created_at DESC NULLS LAST, c.id DESC
  `, [visitorId]);
  return result.rows.map(publicConversation);
}

function conversationPayload(profileKey, messages) {
  return {
    messages: messages.map(publicMessage),
    replyOptions: availableResponses(profileKey, messages.length),
    gifOptions: gifChoices,
  };
}

function resolveSelection(profileKey, messageCount, selection = {}) {
  if (selection.kind === "response") {
    const option = availableResponses(profileKey, messageCount).find((item) => item.id === selection.optionId);
    if (option) return { body: option.body, type: "text", mediaUrl: null, mediaAlt: null, selectedOption: option.id };
  }
  if (selection.kind === "gif") {
    const gif = gifChoices.find((item) => item.id === selection.gifId);
    if (gif) return { body: `[GIF] ${gif.label}`, type: "gif", mediaUrl: gif.url, mediaAlt: gif.label, selectedOption: gif.id };
  }
  const error = new Error("That response was not among your current bad options.");
  error.status = 400;
  throw error;
}

async function listMessages(visitorId, conversationId) {
  if (!pool) {
    const conversation = ensureMemoryVisitor(visitorId).find((item) => item.id === conversationId);
    if (!conversation) return null;
    return conversationPayload(conversation.profile_key, conversation.messages);
  }

  const ownership = await pool.query(
    "SELECT profile_key FROM conversations WHERE id = $1 AND visitor_id = $2",
    [conversationId, visitorId],
  );
  if (!ownership.rowCount) return null;
  const result = await pool.query(`
    SELECT m.* FROM messages m
    WHERE m.conversation_id = $1
    ORDER BY m.created_at ASC, m.id ASC
  `, [conversationId]);
  return conversationPayload(ownership.rows[0].profile_key, result.rows);
}

function memoryMessage(sender, body, createdAt, extras = {}) {
  return {
    id: crypto.randomUUID(), sender, body, created_at: createdAt,
    message_type: extras.type || "text",
    media_url: extras.mediaUrl || null,
    media_alt: extras.mediaAlt || null,
    selected_option: extras.selectedOption || null,
  };
}

async function createMessages(visitorId, conversationId, selection) {
  if (!pool) {
    const conversation = ensureMemoryVisitor(visitorId).find((item) => item.id === conversationId);
    if (!conversation) return null;
    const selected = resolveSelection(conversation.profile_key, conversation.messages.length, selection);
    const now = Date.now();
    const added = [
      memoryMessage("you", selected.body, new Date(now).toISOString(), selected),
      memoryMessage("match", chooseReply(conversation.profile_key, selected.body), new Date(now + 1).toISOString()),
    ];
    if (shouldAttachRandomImage(selected.body, conversation.messages.length)) {
      const image = randomImages[(selected.body.length + conversation.messages.length) % randomImages.length];
      added.push(memoryMessage("match", "Also, this felt relevant. It is not.", new Date(now + 2).toISOString(), {
        type: "image", mediaUrl: image.url, mediaAlt: image.alt,
      }));
    }
    conversation.messages.push(...added);
    return conversationPayload(conversation.profile_key, conversation.messages);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const conversation = await client.query(
      "SELECT id, profile_key FROM conversations WHERE id = $1 AND visitor_id = $2 FOR UPDATE",
      [conversationId, visitorId],
    );
    if (!conversation.rowCount) {
      await client.query("ROLLBACK");
      return null;
    }
    const countResult = await client.query("SELECT COUNT(*)::INTEGER AS count FROM messages WHERE conversation_id = $1", [conversationId]);
    const messageCount = countResult.rows[0].count;
    const selected = resolveSelection(conversation.rows[0].profile_key, messageCount, selection);
    await client.query(`
      INSERT INTO messages (conversation_id, sender, body, message_type, media_url, media_alt, selected_option)
      VALUES ($1, 'you', $2, $3, $4, $5, $6)
    `, [conversationId, selected.body, selected.type, selected.mediaUrl, selected.mediaAlt, selected.selectedOption]);
    await client.query(`
      INSERT INTO messages (conversation_id, sender, body, created_at)
      VALUES ($1, 'match', $2, NOW() + INTERVAL '1 millisecond')
    `, [conversationId, chooseReply(conversation.rows[0].profile_key, selected.body)]);
    if (shouldAttachRandomImage(selected.body, messageCount)) {
      const image = randomImages[(selected.body.length + messageCount) % randomImages.length];
      await client.query(`
        INSERT INTO messages (conversation_id, sender, body, message_type, media_url, media_alt, created_at)
        VALUES ($1, 'match', 'Also, this felt relevant. It is not.', 'image', $2, $3, NOW() + INTERVAL '2 milliseconds')
      `, [conversationId, image.url, image.alt]);
    }
    await client.query("COMMIT");
    return listMessages(visitorId, conversationId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

app.get("/api/health", async (_request, response, next) => {
  try {
    if (pool) await pool.query("SELECT 1");
    response.json({ ok: true, storage: pool ? "postgres" : "memory" });
  } catch (error) {
    next(error);
  }
});

app.get("/api/conversations", async (request, response, next) => {
  try {
    response.json({ conversations: await listConversations(visitorIdFrom(request)) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/conversations/:conversationId/messages", async (request, response, next) => {
  try {
    const payload = await listMessages(visitorIdFrom(request), request.params.conversationId);
    if (!payload) return response.status(404).json({ error: "Conversation not found." });
    response.json(payload);
  } catch (error) {
    next(error);
  }
});

app.post("/api/conversations/:conversationId/messages", async (request, response, next) => {
  try {
    const payload = await createMessages(visitorIdFrom(request), request.params.conversationId, request.body);
    if (!payload) return response.status(404).json({ error: "Conversation not found." });
    response.status(201).json(payload);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(path.join(__dirname), { extensions: ["html"] }));

app.use((error, _request, response, _next) => {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  response.status(status).json({ error: status >= 500 ? "The server made this weird." : error.message });
});

async function startServer(port = Number(process.env.PORT) || 10000) {
  await initializeDatabase();
  return new Promise((resolve, reject) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Dealbreaker is making decisions on port ${server.address().port}.`);
      resolve(server);
    });
    server.on("error", reject);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Dealbreaker failed to start:", error);
    process.exit(1);
  });
}

module.exports = { app, startServer };
