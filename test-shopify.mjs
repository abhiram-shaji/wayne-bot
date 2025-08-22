// node test-shopify.mjs
import 'dotenv/config' // loads .env

// Node 18+ has fetch. If you're on older Node, uncomment the next two lines:
// import fetch from 'node-fetch'
// globalThis.fetch = fetch

const shopRaw = process.env.SHOPIFY_STORE_DOMAIN
const token = process.env.SHOPIFY_ADMIN_TOKEN
const prefVer = process.env.SHOPIFY_API_VERSION || '2025-07'
const orderNumber = process.argv[2] || '#1001' // you can pass an order number as arg

if (!shopRaw || !token) {
  throw new Error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN in .env')
}

const normalizeShop = (s) => s.replace(/^https?:\/\//i, '').replace(/\/+$/, '')
const shop = normalizeShop(shopRaw)
const versions = [prefVer, '2025-01', '2024-10'] // try fallbacks if 404

const post = async (version, query, variables = {}) => {
  const url = `https://${shop}/admin/api/${version}/graphql.json`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  })
  const text = await res.text()
  if (res.status === 404) throw Object.assign(new Error(`404 at ${url}`), { status: 404, body: text })
  if (!res.ok) throw new Error(`HTTP ${res.status} at ${url} :: ${text}`)
  return JSON.parse(text)
}

const tryVersions = async (query, variables) => {
  let lastErr
  for (const v of versions) {
    try {
      return { version: v, json: await post(v, query, variables) }
    } catch (e) {
      lastErr = e
      if (e.status !== 404) throw e // only fallback on 404
    }
  }
  throw lastErr || new Error('Failed all versions')
}

const qShop = `{ shop { name myshopifyDomain email } }`
const qOrder = `
  query($q:String!){
    orders(first: 1, query: $q){
      edges{ node{
        id name processedAt
        displayFinancialStatus displayFulfillmentStatus
        totalPriceSet{ shopMoney{ amount currencyCode } }
      } }
    }
  }`

;(async () => {
  console.log('Using shop:', shop)
  // 1) Sanity check shop endpoint
  const a = await tryVersions(qShop, {})
  console.log('✅ Connected (version:', a.version + ')', a.json.data.shop)

  // 2) Test order-by-number
  const b = await tryVersions(qOrder, { q: `name:${orderNumber}` })
  const conn = b.json?.data?.orders
  const orders = conn?.edges?.map(e => e.node) ?? []
  console.log(`✅ Orders for ${orderNumber}:`, orders.length)
  if (orders.length) {
    console.log(orders.map(o => ({
      id: o.id, name: o.name,
      processedAt: o.processedAt,
      financial: o.displayFinancialStatus,
      fulfillment: o.displayFulfillmentStatus,
      total: `${o.totalPriceSet.shopMoney.currencyCode} ${o.totalPriceSet.shopMoney.amount}`
    })))
  }
})().catch(err => {
  console.error('❌ Test failed:', err.message)
  process.exit(1)
})

