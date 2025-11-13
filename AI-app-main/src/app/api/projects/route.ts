import { NextResponse } from 'next/server';
import { getProjects, createProject } from '@/utils/db/projects';

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, files } = body;

    if (!name || !files) {
      return NextResponse.json(
        { error: 'Name and files are required' },
        { status: 400 }
      );
    }

    const project = await createProject({ name, description, files });
    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
