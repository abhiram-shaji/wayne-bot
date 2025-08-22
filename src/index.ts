// =============================
// File: src/index.ts (entry)
// =============================
import * as bp from ".botpress"
import { actions } from "./bot/actions"
import { handleIncomingText } from "./bot/handlers"


const bot = new bp.Bot({
actions,
})


bot.on.message("*", handleIncomingText)


export default bot