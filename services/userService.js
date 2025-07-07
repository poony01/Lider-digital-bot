import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.resolve('dados/usuarios.json');

export async function getAllUsers() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveAllUsers(users) {
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2));
}

export async function findOrCreateUser(telegramId, nome) {
  let users = await getAllUsers();
  let user = users.find(u => u.telegramId === telegramId);
  if (!user) {
    user = { telegramId, nome, plano: "free", mensagens: 0 };
    users.push(user);
    await saveAllUsers(users);
  }
  return user;
}

export async function updateUser(user) {
  let users = await getAllUsers();
  const idx = users.findIndex(u => u.telegramId === user.telegramId);
  if (idx !== -1) {
    users[idx] = user;
    await saveAllUsers(users);
  }
}
