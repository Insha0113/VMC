import { NextResponse } from 'next/server';
import { getDepartments, saveDepartment } from '@/lib/db';

export async function GET() {
  try {
    const depts = await getDepartments();
    return NextResponse.json(depts);
  } catch (error) {
    console.error('API Departments GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

function checkAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.ADMIN_TOKEN || 'vmc_admin_session_token_xyz'}`;
  return authHeader === expectedToken;
}

export async function POST(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    if (!body.id || !body.slug || !body.name || !body.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const saved = await saveDepartment(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('API Departments POST Error:', error);
    return NextResponse.json({ error: 'Failed to save department' }, { status: 500 });
  }
}
