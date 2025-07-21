import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = 'abhi_secret';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  let users = [];
  if (typeof window !== 'undefined') {
    users = JSON.parse(localStorage.getItem('users') || '[]');
  }
  const user = users.find((u: any) => u.username === username && u.password === password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  return NextResponse.json({ token, username });
}
