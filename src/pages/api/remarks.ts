import type { APIRoute } from 'astro';
import { fetchFacultyRemarks, insertFacultyRemark } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    const remarks = await fetchFacultyRemarks();
    return new Response(JSON.stringify({ remarks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const newRemark = await insertFacultyRemark({
      student: body.student,
      category: body.category,
      text: body.text,
      type: body.type,
      remark_date: body.remark_date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    return new Response(JSON.stringify({ success: true, remark: newRemark }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
