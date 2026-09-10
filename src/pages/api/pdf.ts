import type { APIRoute } from 'astro';
import { fetchPdfActivities, insertPdfActivity } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    const activities = await fetchPdfActivities();
    return new Response(JSON.stringify({ activities }), {
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
    const newActivity = await insertPdfActivity({
      tool_name: body.tool_name,
      filename: body.filename,
      file_size: body.file_size || '2.4 MB',
      status: body.status || 'Completed',
    });
    return new Response(JSON.stringify({ success: true, activity: newActivity }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
