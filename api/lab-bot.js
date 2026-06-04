const SYSTEM_PROMPT = [
  "You are Lab Bot on lab.iangoh.com.",
  "Answer as Ian Goh's concise public project guide.",
  "Use the lab context: Ian's live products, FreeLLMAPI/LLM API, GrowthDex, Bookflow, ExtractMint, WillCrafty, Kite Video, AI Cinema, Ian Goh Music on Spotify, FourType, Praise Mountain, KIRA Money, Wang Haron & Goh, SkillRivals, KITA, portfolio, and venture thesis.",
  "Explain what the lab is for: a public operating map for products, AI infrastructure, growth playbooks, creative work, and venture experiments.",
  "Keep replies useful, specific, and under 45 words.",
  "Do not list every project. Mention at most three examples when useful.",
  "Always finish the sentence. Never end with an unfinished list or dangling comma.",
  "Return only the final answer. Do not include analysis, planning, chain-of-thought, or phrases like 'I need to'.",
  "Never reveal secrets, API keys, Basic Auth credentials, private environment variables, or internal deployment details.",
].join(" ")

function fallbackReply(prompt) {
  const text = prompt.toLowerCase()

  if (text.includes("music") || text.includes("spotify") || text.includes("audio")) {
    return "Music sits in Ian's creative layer, connecting the product lab to audio identity, storytelling, and public creative proof."
  }

  if (text.includes("llm") || text.includes("api") || text.includes("model")) {
    return "The LLM API is the lab's model gateway: one shared route for prompts, tools, experiments, and future product intelligence."
  }

  if (text.includes("venture") || text.includes("kita") || text.includes("growth")) {
    return "The venture layer turns Ian's market instincts into visible proof: live products, growth systems, and testable opportunity maps."
  }

  return "Ian Goh Lab is a public operating map for products, AI infrastructure, growth playbooks, creative work, and venture experiments."
}

function cleanReply(rawReply, prompt) {
  let reply = String(rawReply || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/\s+/g, " ")
    .trim()

  const leakedReasoning = /(^|\s)(i need to|let me|the question asks|i should|i can mention|from the provided information)/i.test(reply)

  if (leakedReasoning || reply.length > 420) {
    return fallbackReply(prompt)
  }

  reply = reply.replace(/^["']|["']$/g, "").trim()

  if (!/[.!?]$/.test(reply)) {
    reply = reply.replace(/[,:;-\s]+$/, "")
    reply = `${reply}.`
  }

  if (reply.split(/\s+/).length < 10) {
    return fallbackReply(prompt)
  }

  return reply
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return []

  return messages
    .slice(-8)
    .map((message) => ({
      role: message?.role === "you" ? "user" : "assistant",
      content: String(message?.text || "").slice(0, 900),
    }))
    .filter((message) => message.content.trim().length > 0)
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json")

  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      configured: Boolean(process.env.FREELLMAPI_BASE_URL && process.env.FREELLMAPI_API_KEY),
    })
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const baseUrl = process.env.FREELLMAPI_BASE_URL
  const apiKey = process.env.FREELLMAPI_API_KEY

  if (!baseUrl || !apiKey) {
    return res.status(500).json({ error: "Lab bot is not configured yet." })
  }

  const userText = String(req.body?.message || "").trim().slice(0, 900)
  if (!userText) {
    return res.status(400).json({ error: "Message is required." })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 22000)
  const payload = {
    model: "minimax/minimax-m2.5:free",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...normalizeMessages(req.body?.history),
      { role: "user", content: userText },
    ],
    temperature: 0.65,
    max_tokens: 110,
    stream: false,
  }

  try {
    const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    const data = await upstream.json().catch(() => ({}))

    if (!upstream.ok) {
      const upstreamError = data?.error?.message || data?.message || "FreeLLMAPI request failed."
      return res.status(502).json({ error: upstreamError })
    }

    const reply = cleanReply(data?.choices?.[0]?.message?.content, userText)

    if (!reply) {
      return res.status(502).json({ error: "FreeLLMAPI returned an empty response." })
    }

    return res.status(200).json({ reply })
  } catch (error) {
    const message = error?.name === "AbortError" ? "Lab bot timed out." : "Lab bot request failed."
    return res.status(502).json({ error: message })
  } finally {
    clearTimeout(timeout)
  }
}
