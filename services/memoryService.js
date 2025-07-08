// dados/memoryService.js
import fs from "fs/promises";
import path from "path";

const MEMORY_PATH = path.resolve("dados/memory.json");

export async function getMemory(userId) {
  try {
    const data = await fs.readFile(MEMORY_PATH, "utf-8");
    const all = JSON.parse(data);
    return all[userId] || [];
  } catch {
    return [];
  }
}

export async function saveMemory(userId, messages) {
  let all = {};
  try {
    const data = await fs.readFile(MEMORY_PATH, "utf-8");
    all = JSON.parse(data);
  } catch {}

  all[userId] = messages;
  await fs.writeFile(MEMORY_PATH, JSON.stringify(all, null, 2));
}
