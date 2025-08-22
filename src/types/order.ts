// =============================
// File: src/types/order.ts
// =============================
export type OrderLite = {
id: string
name: string
email: string | null
processedAtUTC: string
processedAtLocal: string
financialStatus: string
fulfillmentStatus: string
total: { amount: number; currency: string }
}