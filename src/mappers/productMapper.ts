// =============================
// File: src/mappers/productMapper.ts
// =============================
import { ProductLite } from "../types/product"

export const mapProducts = (json: any): ProductLite[] => {
const edges = json?.data?.products?.edges ?? []
return edges.map((e: any) => {
const n = e.node
const variant = n?.variants?.edges?.[0]?.node
return {
id: n.id,
title: n.title,
handle: n.handle,
productType: n.productType ?? "",
tags: n.tags ?? [],
status: n.status,
price: variant ? Number(variant.price) : null,
}
})
}
