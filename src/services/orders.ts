// =============================
// File: src/services/orders.ts
// =============================
import { ORDER_BY_NUMBER } from "../shopify/queries"
import { shopifyFetchGQL } from "../shopify/client"
import { mapOrders } from "../mappers/orderMapper"
import type { OrderLite } from "../types/order"

export const fetchOrderByNumber = async (
  orderNumber: string
): Promise<OrderLite | null> => {
  const normalized = orderNumber.startsWith("#") ? orderNumber : `#${orderNumber}`
  const json = await shopifyFetchGQL(ORDER_BY_NUMBER, {
    orderNumber: `name:${normalized}`,
  })
  const orders = mapOrders(json)
  return orders[0] ?? null
}

