import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

const SECRET = 'abhi_secret';
const PROJECTS_FILE = path.join(process.cwd(), 'project.json');

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

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const allProjects = await readProjects();
    const projects = allProjects[username] || [];
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Project name required' }, { status: 400 });
    const allProjects = await readProjects();
    const userProjects = allProjects[username] || [];
    const newProject = { id: Date.now().toString(), name };
    userProjects.push(newProject);
    allProjects[username] = userProjects;
    await writeProjects(allProjects);
    return NextResponse.json({ project: newProject });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const { id, name } = await req.json();
    if (!id || !name) return NextResponse.json({ error: 'Project ID and name required' }, { status: 400 });
    const allProjects = await readProjects();
    let userProjects = allProjects[username] || [];
    userProjects = userProjects.map((p: any) => p.id === id ? { ...p, name } : p);
    allProjects[username] = userProjects;
    await writeProjects(allProjects);
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
    const allProjects = await readProjects();
    let userProjects = allProjects[username] || [];
    userProjects = userProjects.filter((p: any) => p.id !== id);
    allProjects[username] = userProjects;
    await writeProjects(allProjects);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}