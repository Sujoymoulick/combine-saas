import type { APIRoute } from 'astro';
import { fetchStudents, fetchCourses, insertStudent, saveAttendanceLedger } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    const students = await fetchStudents();
    const courses = await fetchCourses();
    return new Response(JSON.stringify({ students, courses }), {
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

    if (body.action === 'add_student') {
      const newStudent = await insertStudent({
        name: body.name,
        roll_number: body.roll_number,
        status: 'present',
        total_attended: 28,
        total_classes: 30,
        phone: body.phone || '',
      });
      return new Response(JSON.stringify({ success: true, student: newStudent }), { status: 201 });
    }

    if (body.action === 'save_attendance') {
      await saveAttendanceLedger(body.course_code, body.date, body.records);
      return new Response(JSON.stringify({ success: true, message: 'Attendance ledger saved to Supabase' }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
