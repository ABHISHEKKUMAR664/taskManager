import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

const SECRET = 'abhi_secret';
const USERS_FILE = path.join(process.cwd(), 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  const users = await readUsers();
  let userStatus: "valid" | "invalid" | "notfound" = "notfound";
  users.find((u: any) => {
    if (u.username === username && u.password === password) {
      userStatus = "valid";
      return true;
    }
    if (u.username === username && u.password !== password) {
      userStatus = "invalid";
    }
    return false;
  });
  if (userStatus === "notfound") {
    return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
  }
  if (userStatus === "invalid") { 
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  return NextResponse.json({ token, username });
}
