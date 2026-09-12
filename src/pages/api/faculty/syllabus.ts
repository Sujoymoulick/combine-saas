import type { APIRoute } from 'astro';
import {
  addSyllabusUnit,
  deleteSyllabusUnit,
  getSyllabusUnits,
  updateSyllabusUnit,
} from '../../../lib/supabase';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const auth = locals.auth();
    const userId = auth?.userId || 'guest_user';
    const units = await getSyllabusUnits(userId);
    return new Response(JSON.stringify({ success: true, data: units }), {
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
    const { unitId, unit_title, progress, topics } = body;

    if (unitId) {
      const updated = await updateSyllabusUnit(userId, unitId, { progress, topics });
      return new Response(JSON.stringify({ success: true, data: updated }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!unit_title) {
      return new Response(JSON.stringify({ error: 'unit_title or unitId is required' }), { status: 400 });
    }

    const created = await addSyllabusUnit(userId, { unit_title, progress: progress || 0, topics });
    return new Response(JSON.stringify({ success: true, data: created }), {
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
    const { id, unit_title, progress, topics } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required for update' }), { status: 400 });
    }

    const updated = await updateSyllabusUnit(userId, id, { progress, topics });
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

    const success = await deleteSyllabusUnit(userId, id);
    return new Response(JSON.stringify({ success }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
