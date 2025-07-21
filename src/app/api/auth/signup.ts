import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = 'abhi_secret';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  // Get users from localStorage (simulate DB)
  let users = [];
  if (typeof window !== 'undefined') {
    users = JSON.parse(localStorage.getItem('users') || '[]');
  }
  if (users.find((u: any) => u.username === username)) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  users.push({ username, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('users', JSON.stringify(users));
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  return NextResponse.json({ token, username });
}
