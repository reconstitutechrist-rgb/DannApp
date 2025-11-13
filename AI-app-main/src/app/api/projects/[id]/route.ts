import { NextResponse } from 'next/server';
import {
  getProject,
  updateProject,
  deleteProject,
} from '@/utils/db/projects';

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const project = await updateProject(id, body);
    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
