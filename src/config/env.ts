// =============================
// File: src/config/env.ts
// =============================
import * as bp from ".botpress"

export const RAW_SHOP = ""
export const TOKEN = ""
export const PREF_VERSION = ""
export const TZ = ""

export const missingConfigMessage = (): string => {
  // With hard-coded values, this will never trigger
  return ""
}

// Allow importing SDK types without pulling bp directly
export type Botpress = typeof bp
