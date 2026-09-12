import type { APIRoute } from 'astro';
import {
  addResearchPaper,
  deleteResearchPaper,
  getResearchPapers,
  updateResearchPaper,
} from '../../../lib/supabase';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const auth = locals.auth();
    const userId = auth?.userId || 'guest_user';
    const papers = await getResearchPapers(userId);
    return new Response(JSON.stringify({ success: true, data: papers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const auth = locals.auth();
    const userId = auth?.userId || 'guest_user';

    const body = await request.json();
    const { title, journal, status, citations, publication_date } = body;

    if (!title || !journal) {
      return new Response(JSON.stringify({ error: 'Title and Journal/Grant Agency are required' }), { status: 400 });
    }

    const paper = await addResearchPaper(userId, {
      title,
      journal,
      status,
      citations: Number(citations) || 0,
      publication_date,
    });

    return new Response(JSON.stringify({ success: true, data: paper }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const auth = locals.auth();
    const userId = auth?.userId || 'guest_user';

    const body = await request.json();
    const { id, title, journal, status, citations, publication_date } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required for update' }), { status: 400 });
    }

    const updated = await updateResearchPaper(userId, id, {
      title,
      journal,
      status,
      citations,
      publication_date,
    });

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const auth = locals.auth();
    const userId = auth?.userId || 'guest_user';

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required for delete' }), { status: 400 });
    }

    const success = await deleteResearchPaper(userId, id);
    return new Response(JSON.stringify({ success }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
