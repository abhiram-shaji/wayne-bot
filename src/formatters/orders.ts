// =============================
// File: src/formatters/orders.ts
// =============================
import type { OrderLite } from "../types/order"

export const formatOrderText = (
  orderNumber: string,
  order: OrderLite | null
) => {
  if (!order) return `No order found for ${orderNumber}.`
  const line = `${order.total.currency} ${order.total.amount.toFixed(2)} • ${order.financialStatus}/${order.fulfillmentStatus} • ${order.processedAtLocal}`
  return `Order ${order.name}:\n${line}`
}

