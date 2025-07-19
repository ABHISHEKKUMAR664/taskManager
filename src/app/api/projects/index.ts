import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = 'kunal_secret';

function getProjects(username: string) {
  if (typeof global !== 'undefined') {
    // @ts-ignore
    global.projects = global.projects || {};
    // @ts-ignore
    return global.projects[username] || [];
  }
  return [];
}

function setProjects(username: string, projects: any[]) {
  if (typeof global !== 'undefined') {
    // @ts-ignore
    global.projects = global.projects || {};
    // @ts-ignore
    global.projects[username] = projects;
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { username } = jwt.verify(token, SECRET) as any;
    const projects = getProjects(username);
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
    const projects = getProjects(username);
    const newProject = { id: Date.now().toString(), name };
    projects.push(newProject);
    setProjects(username, projects);
    return NextResponse.json({ project: newProject });
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
    let projects = getProjects(username);
    projects = projects.filter((p: any) => p.id !== id);
    setProjects(username, projects);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
