// =============================
// File: src/mappers/orderMapper.ts
// =============================
import { OrderLite } from "../types/order"
import { toLocal } from "../utils/time"


export const mapOrders = (json: any): OrderLite[] => {
const edges = json?.data?.orders?.edges ?? []
return edges.map((e: any) => {
const n = e.node
return {
id: n.id,
name: n.name,
email: n.email ?? null,
processedAtUTC: n.processedAt,
processedAtLocal: toLocal(n.processedAt),
financialStatus: n.displayFinancialStatus,
fulfillmentStatus: n.displayFulfillmentStatus,
total: {
amount: Number(n.totalPriceSet.shopMoney.amount),
currency: n.totalPriceSet.shopMoney.currencyCode,
},
}
})
}