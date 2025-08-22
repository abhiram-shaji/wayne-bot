# Wayne Bot

Wayne is a Botpress bot that connects to a Shopify store to look up orders and search products. Messages sent to the bot are processed through a single handler that greets the user, checks for order numbers or product queries, and replies with formatted details.

## Configuration

Runtime configuration is declared in `bot.definition.ts` and includes the Shopify store domain, admin API token, preferred API version and timezone.

## Runtime Flow

- `src/index.ts` instantiates the Botpress bot, registers custom actions and hooks the message handler.
- `src/bot/handlers.ts` greets each conversation once, ignores non‑text messages, fetches order or product information based on the message content, and falls back to a help message when nothing matches.
- The same functionality is exposed as actions (`ordersLookup`, `productsLookup`) so that flows can call them directly.

## Shopify Access Layer

`src/services` contains functions that call the Shopify Admin GraphQL API using queries from `src/shopify/queries.ts` and a generic fetch helper in `src/shopify/client.ts`. The client normalizes the shop domain, tries multiple API versions and throws detailed errors if requests fail.

Responses are mapped into lightweight `OrderLite` and `ProductLite` objects under `src/mappers`, then converted into human‑readable strings by the formatter modules in `src/formatters`.

## Utilities and Types

`src/utils` provides helpers for string processing and timezone conversion, while `src/types` defines the shapes of order and product data.

## Testing Shopify Connectivity

The script `test-shopify.mjs` can be run with Node to verify that the store credentials work and to fetch a sample order.
