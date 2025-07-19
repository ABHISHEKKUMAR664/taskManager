import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

const SECRET = 'kunal_secret';
const USERS_FILE = path.join(process.cwd(), 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users: { username: string; password: string }[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  const users = await readUsers();
  if (users.find((u: any) => u.username === username)) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  users.push({ username, password });
  await writeUsers(users);
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  return NextResponse.json({ token, username });
}
