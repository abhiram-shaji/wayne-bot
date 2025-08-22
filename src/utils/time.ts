// =============================
// File: src/utils/time.ts
// =============================
import { TZ } from "../config/env"


export const toLocal = (isoUtc: string, tz = TZ) => {
const d = new Date(isoUtc)
return new Intl.DateTimeFormat("en-CA", {
timeZone: tz,
year: "numeric",
month: "short",
day: "2-digit",
hour: "2-digit",
minute: "2-digit",
}).format(d)
}