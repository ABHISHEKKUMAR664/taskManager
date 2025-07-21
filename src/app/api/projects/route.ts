import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DataManager } from '../../../lib/data';
import { getJWTSecret } from '../../../lib/security';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, getJWTSecret()) as any;
    const projects = await DataManager.getUserProjects(username);
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, getJWTSecret()) as any;
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Project name required' }, { status: 400 });
    }
    
    const newProject = await DataManager.addProject(username, {
      name,
      id: Date.now().toString(),
    });
    
    return NextResponse.json({ project: newProject });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, getJWTSecret()) as any;
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: 'Project ID and name required' }, { status: 400 });
    }
    
    const updatedProject = await DataManager.updateProject(username, id, { name });
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, getJWTSecret()) as any;
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    
    await DataManager.deleteProject(username, id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
