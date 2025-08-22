// =============================
// File: src/shopify/queries.ts
// =============================
export const ORDER_BY_NUMBER = `
query OrderByNumber($orderNumber: String!) {
  orders(first: 1, query: $orderNumber) {
    edges {
      node {
        id
        name
        processedAt
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet { shopMoney { amount currencyCode } }
      }
    }
  }
}
`

export const PRODUCTS_BY_QUERY = `
query ProductsByQuery($q: String!, $first: Int = 20) {
  products(first: $first, query: $q) {
    pageInfo { hasNextPage endCursor }
    edges {
      node {
        id
        title
        handle
        productType
        tags
        status
        variants(first: 1) {
          edges { node { id price } }
        }
      }
    }
  }
}
`
