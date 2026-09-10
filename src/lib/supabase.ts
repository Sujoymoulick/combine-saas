import { createClient } from '@supabase/supabase-js';

// Fallback values for development if environment variables are not loaded in client context
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://emilmamhgrorktizatmx.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtaWxtYW1oZ3Jvcmt0aXphdG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMjg5MzIsImV4cCI6MjEwNDYwNDkzMn0.sY8haOZQUs3CVMt_6ZcFgDChFv6KooSWfDpV168Mxy4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Database Helper Types ---

export interface Student {
  id?: number;
  name: string;
  roll_number: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  total_attended: number;
  total_classes: number;
  phone?: string;
  created_at?: string;
}

export interface Course {
  id?: number;
  code: string;
  name: string;
  enrolled_count: number;
  time_slot: string;
  room: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id?: number;
  course_code: string;
  student_id: number;
  attendance_date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  created_at?: string;
}

export interface FacultyRemark {
  id?: number;
  student: string;
  category: string;
  text: string;
  type: 'positive' | 'warning' | 'research' | 'neutral';
  remark_date?: string;
  created_at?: string;
}

export interface AtsScan {
  id?: number;
  candidate_name: string;
  job_title: string;
  score: number;
  match_status: string;
  missing_keywords: string[];
  summary: string;
  created_at?: string;
}

export interface PdfActivity {
  id?: number;
  tool_name: string;
  filename: string;
  file_size?: string;
  status?: string;
  created_at?: string;
}

export interface WorkspaceSettings {
  id?: number;
  org_name: string;
  admin_name: string;
  admin_email: string;
  storage_used_gb: number;
  storage_limit_gb: number;
  notifications_enabled: boolean;
  theme_mode: string;
  updated_at?: string;
}

// --- Data Access Functions ---

export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase.from('students').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Error fetching students from Supabase:', error);
    return [];
  }
  return data || [];
}

export async function insertStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
  const { data, error } = await supabase.from('students').insert(student).select().single();
  if (error) {
    console.error('Error inserting student:', error);
    return null;
  }
  return data;
}

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from('courses').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Error fetching courses from Supabase:', error);
    return [];
  }
  return data || [];
}

export async function saveAttendanceLedger(courseCode: string, date: string, records: { student_id: number; status: 'present' | 'absent' | 'late' | 'excused' }[]) {
  const upsertPayload = records.map((r) => ({
    course_code: courseCode,
    student_id: r.student_id,
    attendance_date: date,
    status: r.status,
  }));

  const { data, error } = await supabase.from('attendance_records').upsert(upsertPayload, {
    onConflict: 'student_id,course_code,attendance_date',
  });

  if (error) {
    console.error('Error saving attendance records:', error);
    throw error;
  }
  return data;
}

export async function fetchFacultyRemarks(): Promise<FacultyRemark[]> {
  const { data, error } = await supabase.from('faculty_remarks').select('*').order('id', { ascending: false });
  if (error) {
    console.error('Error fetching faculty remarks:', error);
    return [];
  }
  return data || [];
}

export async function insertFacultyRemark(remark: Omit<FacultyRemark, 'id'>): Promise<FacultyRemark | null> {
  const { data, error } = await supabase.from('faculty_remarks').insert(remark).select().single();
  if (error) {
    console.error('Error adding faculty remark:', error);
    return null;
  }
  return data;
}

export async function fetchAtsScans(): Promise<AtsScan[]> {
  const { data, error } = await supabase.from('ats_scans').select('*').order('id', { ascending: false });
  if (error) {
    console.error('Error fetching ATS scans:', error);
    return [];
  }
  return data || [];
}

export async function insertAtsScan(scan: Omit<AtsScan, 'id'>): Promise<AtsScan | null> {
  const { data, error } = await supabase.from('ats_scans').insert(scan).select().single();
  if (error) {
    console.error('Error inserting ATS scan:', error);
    return null;
  }
  return data;
}

export async function fetchPdfActivities(): Promise<PdfActivity[]> {
  const { data, error } = await supabase.from('pdf_activities').select('*').order('id', { ascending: false });
  if (error) {
    console.error('Error fetching PDF activities:', error);
    return [];
  }
  return data || [];
}

export async function insertPdfActivity(activity: Omit<PdfActivity, 'id'>): Promise<PdfActivity | null> {
  const { data, error } = await supabase.from('pdf_activities').insert(activity).select().single();
  if (error) {
    console.error('Error inserting PDF activity:', error);
    return null;
  }
  return data;
}

export async function fetchWorkspaceSettings(): Promise<WorkspaceSettings | null> {
  const { data, error } = await supabase.from('workspace_settings').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching workspace settings:', error);
    return null;
  }
  return data;
}

export async function updateWorkspaceSettings(settings: Partial<WorkspaceSettings>): Promise<WorkspaceSettings | null> {
  const { data: existing } = await supabase.from('workspace_settings').select('id').limit(1).single();
  if (existing?.id) {
    const { data, error } = await supabase.from('workspace_settings').update(settings).eq('id', existing.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('workspace_settings').insert(settings).select().single();
    if (error) throw error;
    return data;
  }
}
