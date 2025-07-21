import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = 'abhi_secret';

function getTasks(username: string) {
  if (typeof global !== 'undefined') {
    // @ts-ignore
    global.tasks = global.tasks || {};
    // @ts-ignore
    return global.tasks[username] || [];
  }
  return [];
}

function setTasks(username: string, tasks: any[]) {
  if (typeof global !== 'undefined') {
    // @ts-ignore
    global.tasks = global.tasks || {};
    // @ts-ignore
    global.tasks[username] = tasks;
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const projectId = req.nextUrl.searchParams.get('projectId');
    const tasks = getTasks(username).filter((t: any) => t.projectId === projectId);
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const { projectId, title, completed } = await req.json();
    if (!projectId || !title) return NextResponse.json({ error: 'Project and title required' }, { status: 400 });
    const tasks = getTasks(username);
    const newTask = { id: Date.now().toString(), projectId, title, completed: !!completed };
    tasks.push(newTask);
    setTasks(username, tasks);
    return NextResponse.json({ task: newTask });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const { id, title, completed } = await req.json();
    let tasks = getTasks(username);
    tasks = tasks.map((t: any) => t.id === id ? { ...t, title, completed } : t);
    setTasks(username, tasks);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const { id } = await req.json();
    let tasks = getTasks(username);
    tasks = tasks.filter((t: any) => t.id !== id);
    setTasks(username, tasks);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
