import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DataManager } from '../../../../lib/data';
import { getJWTSecret } from '../../../../lib/security';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  
  // Basic validation
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  
  const user = await DataManager.getUser(username);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  if (user.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  const token = jwt.sign({ username }, getJWTSecret(), { expiresIn: '1d' });
  
  // Create response with security headers
  const response = NextResponse.json({ token, username });
  
  // Security headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}
