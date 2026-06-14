import { NextResponse } from 'next/server';
import { getDoctors, saveDoctor, deleteDoctor } from '@/lib/db';

export async function GET() {
  try {
    const doctors = await getDoctors();
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('API Doctors GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

// Simple token auth check helper
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
    if (!body.id || !body.name || !body.specialty || !body.department) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const saved = await saveDoctor(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('API Doctors POST Error:', error);
    return NextResponse.json({ error: 'Failed to save doctor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing doctor ID' }, { status: 400 });
    }
    
    const success = await deleteDoctor(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Doctors DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
