import fs from 'fs/promises';
import path from 'path';

const PAYMENTS_FILE = path.resolve('data/payments.json');

export async function getAllPayments() {
  try {
    const data = await fs.readFile(PAYMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function savePayment(payment) {
  const payments = await getAllPayments();
  payments.push(payment);
  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
}

export async function findPaymentByPixKey(pixKey) {
  const payments = await getAllPayments();
  return payments.find(p => p.pixKey === pixKey);
}
