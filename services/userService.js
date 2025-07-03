import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.resolve('data/users.json');

export async function getAllUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function saveUser(user) {
  const users = await getAllUsers();
  const existing = users.find(u => u.id === user.id);
  if (!existing) {
    users.push(user);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }
}

export async function getUserById(id) {
  const users = await getAllUsers();
  return users.find(u => u.id === id);
}

export async function updateUser(user) {
  const users = await getAllUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }
}
