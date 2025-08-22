// =============================
// File: src/formatters/products.ts
// =============================
import type { ProductLite } from "../types/product"

const STORE_URL = "https://shopify-store-one.vercel.app/products/"

export const formatProductsText = (
  term: string,
  products: ProductLite[]
) => {
  if (!products.length) return `No products found for "${term}".`
  return products
    .map((p) => {
      const price = p.price != null ? `$${p.price.toFixed(2)}` : "N/A"
      const url = `${STORE_URL}${p.handle}`
      return `${p.title} - ${price}\n${url}`
    })
    .join("\n\n")
}
