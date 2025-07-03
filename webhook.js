import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is required!");

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
    await ctx.reply("🤖 Thinking...");
    // Here you will add your OpenAI integration or business logic
    await ctx.reply("Sample AI response (add OpenAI integration here)");
  } catch (e) {
    await ctx.reply("⚠️ Error processing your question. Try again later.");
  }
});

// For local development:
if (process.env.NODE_ENV !== "production") {
  bot.launch();
  console.log("Bot is running locally...");
}

// For Vercel serverless deployment:
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body, res);
    } catch (err) {
      console.error("Error in bot.handleUpdate:", err);
    }
    res.status(200).end();
  } else {
    res.status(200).send("Líder Digital Bot is running!");
  }
}
