// File: src/shopify/client.ts
// =============================
import fetch from "node-fetch"
import { RAW_SHOP, TOKEN, PREF_VERSION, missingConfigMessage } from "../config/env"
import { normalizeShopDomain } from "../utils/strings"


export const shopifyFetchGQL = async (
query: string,
variables: Record<string, any> = {}
): Promise<any> => {
if (!RAW_SHOP || !TOKEN) {
throw new Error(missingConfigMessage())
}


const shop = normalizeShopDomain(RAW_SHOP)
const versions = [PREF_VERSION, "2025-01", "2024-10"]
let lastErr: any


for (const ver of versions) {
const url = `https://${shop}/admin/api/${ver}/graphql.json`
const res = await fetch(url, {
method: "POST",
headers: {
"X-Shopify-Access-Token": TOKEN,
"Content-Type": "application/json",
},
body: JSON.stringify({ query, variables }),
})


if (res.status === 404) {
lastErr = new Error(`404 Not Found at ${url}`)
continue // try next version
}


const text = await res.text().catch(() => "")
if (!res.ok) {
throw new Error(`Shopify HTTP ${res.status} at ${url} :: ${text}`)
}


const json = text ? JSON.parse(text) : {}
if (json?.errors?.length) {
throw new Error(json.errors.map((e: any) => e.message).join("; "))
}
return json
}


throw lastErr || new Error("Failed to reach Shopify Admin GraphQL")
}