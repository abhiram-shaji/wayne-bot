// =============================
// File: src/services/products.ts
// =============================
import { PRODUCTS_BY_QUERY } from "../shopify/queries"
import { shopifyFetchGQL } from "../shopify/client"
import { mapProducts } from "../mappers/productMapper"
import type { ProductLite } from "../types/product"

export const fetchProductsByQuery = async (term: string): Promise<ProductLite[]> => {
  const singular = term.replace(/s$/i, "")
  const q = `tag:'${term}' OR title:'${singular}*'`
  const json = await shopifyFetchGQL(PRODUCTS_BY_QUERY, { q })
  return mapProducts(json)
}
