// =============================
// File: src/utils/strings.ts
// =============================
export const normalizeShopDomain = (raw: string) => raw.replace(/^https?:\/\//i, "").replace(/\/+$/, "")


// very liberal email extraction: picks first email-looking token
export const extractEmail = (text: string): string | null => {
const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
return match ? match[0] : null
}

export const extractOrderNumber = (text: string): string | null => {
  const match = text.match(/#\d+/) || text.match(/\d+/)
  return match ? (match[0].startsWith("#") ? match[0] : `#${match[0]}`) : null
}