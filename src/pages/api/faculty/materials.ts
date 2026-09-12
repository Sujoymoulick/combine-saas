import type { APIRoute } from 'astro';
import {
  addCourseMaterial,
  deleteCourseMaterial,
  getCourseMaterials,
  updateCourseMaterial,
} from '../../../lib/supabase';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const auth = locals.auth();
    const userId = auth?.userId || 'guest_user';
    const materials = await getCourseMaterials(userId);
    return new Response(JSON.stringify({ success: true, data: materials }), {
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
    const { course_name, title, category, file_url, file_size } = body;

    if (!course_name || !title) {
      return new Response(JSON.stringify({ error: 'Course name and title are required' }), { status: 400 });
    }

    const material = await addCourseMaterial(userId, {
      course_name,
      title,
      category,
      file_url,
      file_size,
    });

    return new Response(JSON.stringify({ success: true, data: material }), {
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
    const { id, course_name, title, category, file_size } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required for update' }), { status: 400 });
    }

    const updated = await updateCourseMaterial(userId, id, {
      course_name,
      title,
      category,
      file_size,
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

    const success = await deleteCourseMaterial(userId, id);
    return new Response(JSON.stringify({ success }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
