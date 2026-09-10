import type { APIRoute } from 'astro';
import { fetchWorkspaceSettings, updateWorkspaceSettings } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    const settings = await fetchWorkspaceSettings();
    return new Response(JSON.stringify({ settings }), {
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
    const updated = await updateWorkspaceSettings(body);
    return new Response(JSON.stringify({ success: true, settings: updated }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
