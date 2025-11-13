import { NextResponse } from 'next/server';
import { getConversations, createConversation } from '@/utils/db/conversations';

// GET /api/conversations - Get all conversations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    let conversations;
    if (projectId) {
      const { getConversationsByProject } = await import('@/utils/db/conversations');
      conversations = await getConversationsByProject(projectId);
    } else {
      conversations = await getConversations();
    }

    return NextResponse.json({ conversations });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project_id, title } = body;

    const conversation = await createConversation({ project_id, title });
    return NextResponse.json({ conversation });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
