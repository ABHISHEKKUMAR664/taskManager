import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DataManager } from '../../../../lib/data';
import { getJWTSecret } from '../../../../lib/security';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  
  const existingUser = await DataManager.getUser(username);
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  
  await DataManager.saveUser(username, { 
    username, 
    password,
    createdAt: new Date().toISOString()
  });
  
  const token = jwt.sign({ username }, getJWTSecret(), { expiresIn: '1d' });
  return NextResponse.json({ token, username });
}
