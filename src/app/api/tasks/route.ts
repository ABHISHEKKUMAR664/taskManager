import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DataManager } from '../../../lib/data';
import { getJWTSecret } from '../../../lib/security';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, getJWTSecret()) as any;
    const { projectId, title, status = 'todo' } = await req.json();
    if (!projectId || !title) {
      return NextResponse.json({ error: 'Project ID and title required' }, { status: 400 });
    }
    
    const newTask = await DataManager.addTask(username, {
      projectId,
      title,
      status,
    });
    
    return NextResponse.json({ task: newTask });
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
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }
    
    await DataManager.deleteTask(username, id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, getJWTSecret()) as any;
    const { id, title, completed, status } = await req.json();
    if (!id) return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (completed !== undefined) updates.completed = completed;
    if (status !== undefined) updates.status = status;
    
    const updatedTask = await DataManager.updateTask(username, id, updates);
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, getJWTSecret()) as any;
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    
    // Get tasks with migration for status field
    const userTasks = await DataManager.migrateTaskStatuses(username);
    
    // Filter by project if specified
    const filteredTasks = projectId 
      ? userTasks.filter((task: any) => task.projectId === projectId)
      : userTasks;
    
    return NextResponse.json({ tasks: filteredTasks });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
