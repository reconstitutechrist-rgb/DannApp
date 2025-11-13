import { NextResponse } from 'next/server';
import { getVersions, createVersion } from '@/utils/db/versions';

// GET /api/projects/[id]/versions - Get all versions for a project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const versions = await getVersions(id);
    return NextResponse.json({ versions });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/versions - Create a new version
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { files, description } = body;

    if (!files) {
      return NextResponse.json(
        { error: 'Files are required' },
        { status: 400 }
      );
    }

    const version = await createVersion({
      project_id: id,
      files,
      description,
    });

    return NextResponse.json({ version });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create version' },
      { status: 500 }
    );
  }
}
