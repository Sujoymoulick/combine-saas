import type { APIRoute } from 'astro';
import { fetchAtsScans, insertAtsScan } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    const scans = await fetchAtsScans();
    return new Response(JSON.stringify({ scans }), {
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
    const newScan = await insertAtsScan({
      candidate_name: body.candidate_name,
      job_title: body.job_title,
      score: body.score,
      match_status: body.match_status,
      missing_keywords: body.missing_keywords || [],
      summary: body.summary || '',
    });
    return new Response(JSON.stringify({ success: true, scan: newScan }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
