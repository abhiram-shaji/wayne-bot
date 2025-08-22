// =============================
// File: src/bot/actions.ts
// =============================
import { fetchOrderByNumber } from "../services/orders"
import { formatOrderText } from "../formatters/orders"
import { fetchProductsByQuery } from "../services/products"
import { formatProductsText } from "../formatters/products"

export const actions = {
  ordersLookup: async ({ input }: { input?: { orderNumber?: string } }) => {
    const orderNumber = (input?.orderNumber || "").trim()
    if (!orderNumber) return { message: "❗Please provide an order number." }

    try {
      const order = await fetchOrderByNumber(orderNumber)
      return { message: formatOrderText(orderNumber, order) }
    } catch (e: any) {
      return {
        message:
          e?.message?.startsWith("⚠️ Misconfiguration")
            ? e.message
            : `⚠️ Order lookup failed. ${e?.message ?? "Unknown error"}`,
      }
    }
  },

  productsLookup: async ({ input }: { input?: { query?: string } }) => {
    const term = (input?.query || "").trim()
    if (!term) return { message: "❗Please provide a product to search." }

    try {
      const products = await fetchProductsByQuery(term)
      return { message: formatProductsText(term, products) }
    } catch (e: any) {
      return {
        message:
          e?.message?.startsWith("⚠️ Misconfiguration")
            ? e.message
            : `⚠️ Product lookup failed. ${e?.message ?? "Unknown error"}`,
      }
    }
  },
}

