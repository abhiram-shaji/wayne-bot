// bot.definition.ts
import { BotDefinition, z } from "@botpress/sdk"
import chat from "./bp_modules/chat"

export default new BotDefinition({
  configuration: {
    schema: z.object({
      SHOPIFY_STORE_DOMAIN: z
        .string()
        .min(1, "Required")
        .describe("Shopify store domain (e.g. veriquestore.myshopify.com)"),
      SHOPIFY_ADMIN_TOKEN: z
        .string()
        .min(1, "Required")
        .describe("Shopify Admin API token with read_orders scope"),
      SHOPIFY_API_VERSION: z
        .string()
        .default("2025-07")
        .describe("Shopify Admin API version"),
      TIMEZONE: z
        .string()
        .default("America/Vancouver")
        .describe("Timezone for formatting order timestamps"),
    }),
  },
}).addIntegration(chat, {
  enabled: true,
  configuration: {},
})
