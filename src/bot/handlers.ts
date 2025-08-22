// =============================
// File: src/bot/handlers.ts
// =============================
import { extractOrderNumber } from "../utils/strings"
import { fetchOrderByNumber } from "../services/orders"
import { formatOrderText } from "../formatters/orders"
import { fetchProductsByQuery } from "../services/products"
import { formatProductsText } from "../formatters/products"
import { missingConfigMessage } from "../config/env"

const greetedConversations = new Set<string>()

export const handleIncomingText = async (props: any) => {
  const {
    message,
    client,
    conversation: { id: conversationId },
    ctx: { botId: userId },
  } = props

  // 1. Greet once per conversation
  if (!greetedConversations.has(conversationId)) {
    greetedConversations.add(conversationId)
    await client.createMessage({
      conversationId,
      userId,
      type: "text",
      payload: {
        text: "Welcome to Verique Store! I'm Wayne, here to help you with product lookup and order details.",
      },
      tags: {},
    })
  }

  // 2. Ignore non-text
  if (message.type !== "text") {
    await client.createMessage({
      conversationId,
      userId,
      type: "text",
      payload: { text: "I can only respond to text for now." },
      tags: {},
    })
    return
  }

  const text = (message?.payload?.text || "").trim()

  // 3. Order lookup
  let orderNumber =
    text.toLowerCase().startsWith("orders ")
      ? extractOrderNumber(text.slice("orders ".length))
      : extractOrderNumber(text)

  if (orderNumber) {
    try {
      const order = await fetchOrderByNumber(orderNumber)
      await client.createMessage({
        conversationId,
        userId,
        type: "text",
        payload: { text: formatOrderText(orderNumber, order) },
        tags: {},
      })
    } catch (e: any) {
      await client.createMessage({
        conversationId,
        userId,
        type: "text",
        payload: {
          text:
            e?.message?.startsWith("⚠️ Misconfiguration")
              ? e.message
              : `⚠️ Order lookup failed. ${e?.message ?? "Unknown error"}`,
        },
        tags: {},
      })
    }
    return
  }

  // 4. Product search
  const findMatch = text.match(/^(?:find|search)\s+(.+)/i)
  if (findMatch) {
    const term = findMatch[1].trim()
    try {
      const products = await fetchProductsByQuery(term)
      await client.createMessage({
        conversationId,
        userId,
        type: "text",
        payload: { text: formatProductsText(term, products) },
        tags: {},
      })
    } catch (e: any) {
      await client.createMessage({
        conversationId,
        userId,
        type: "text",
        payload: {
          text:
            e?.message?.startsWith("⚠️ Misconfiguration")
              ? e.message
              : `⚠️ Product lookup failed. ${e?.message ?? "Unknown error"}`,
        },
        tags: {},
      })
    }
    return
  }

  // 5. Help fallback
  const mis = missingConfigMessage()
  await client.createMessage({
    conversationId,
    userId,
    type: "text",
    payload: {
      text:
        (mis ? mis + "\n\n" : "") +
        "Send an order number to look up an order, e.g.\n" +
        "• orders #1001\n" +
        "• #1001\n" +
        "Search for products, e.g.\n" +
        "• find rings",
    },
    tags: {},
  })
}
