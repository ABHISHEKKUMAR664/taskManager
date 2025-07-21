import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';


const SECRET = 'abhi_secret';
const TASKS_FILE = path.join(process.cwd(), 'tasks.json');
const PROJECTS_FILE = path.join(process.cwd(), 'projects.json');

async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeTasks(tasks: any) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

async function readProjects() {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeProjects(projects: any) {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const { projectId, title } = await req.json();
    if (!projectId || !title) {
      return NextResponse.json({ error: 'Project ID and title required' }, { status: 400 });
    }
    const allTasks = await readTasks();
    const userTasks = allTasks[username] || [];
    const newTask = {
      id: Date.now().toString(),
      projectId,
      title,
      completed: false
    };
    userTasks.push(newTask);
    allTasks[username] = userTasks;
    await writeTasks(allTasks);
    return NextResponse.json({ task: newTask });
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
    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }
    const allTasks = await readTasks();
    let userTasks = allTasks[username] || [];
    const initialLength = userTasks.length;
    userTasks = userTasks.filter((task: any) => task.id !== id);
    allTasks[username] = userTasks;
    await writeTasks(allTasks);
    if (userTasks.length === initialLength) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
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
    if (!id) return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    const allTasks = await readTasks();
    let userTasks = allTasks[username] || [];
    let updated = false;
    userTasks = userTasks.map((task: any) => {
      if (task.id === id) {
        updated = true;
        return {
          ...task,
          title: title !== undefined ? title : task.title,
          completed: completed !== undefined ? completed : task.completed,
        };
      }
      return task;
    });
    allTasks[username] = userTasks;
    await writeTasks(allTasks);
    if (!updated) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const allTasks = await readTasks();
    const userTasks = allTasks[username] || [];
    return NextResponse.json({ tasks: userTasks });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}


