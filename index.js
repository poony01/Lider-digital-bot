import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

// Load environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.DONO_ID;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required in environment variables');
}

const bot = new Telegraf(BOT_TOKEN);

// Welcome message
bot.start((ctx) => {
  ctx.reply(
    `👋 Hello, ${ctx.from.first_name}!\n\nI am Líder Digital Bot. Send /help to see what I can do!`
  );
});

// Help command
bot.command("help", (ctx) => {
  ctx.reply(
    `🤖 *Available features:*
- Ask questions (AI via OpenAI)
- Generate images
- Generate Pix QR Code
- Transcribe audio
- View plans: /plan

Send a command or any message to start!`
  );
});

// Plan command
bot.command("plan", (ctx) => {
  ctx.reply(
    `💳 *PLANS:*
🔓 Basic: R$18,90/mo – AI, simple images, audio transcription.
🔐 Premium: R$22,90/mo – Everything in Basic + AI videos, advanced images.

To pay, ask for Pix or send /subscribe.`
  );
});

// Example of basic text AI reply (placeholder)
bot.on("text", async (ctx) => {
  if (ctx.message.text.startsWith("/")) return; // ignore commands
  try {
    ctx.reply("🤖 Thinking...");
    // Here you will add your OpenAI integration or business logic
    ctx.reply("Sample AI response (add OpenAI integration here)");
  } catch (e) {
    ctx.reply("⚠️ Error processing your question. Try again later.");
  }
});

// Start polling (for local development)
if (process.env.NODE_ENV !== "production") {
  bot.launch();
  console.log("Bot is running locally...");
}

// Export for serverless (Vercel)
export default bot;
