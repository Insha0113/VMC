import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;
    
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }
    
    const expectedPassword = process.env.ADMIN_PASSWORD || 'vmcadmin123';
    
    if (password === expectedPassword) {
      const token = process.env.ADMIN_TOKEN || 'vmc_admin_session_token_xyz';
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('API Auth POST Error:', error);
    return NextResponse.json({ error: 'Server authentication error' }, { status: 500 });
  }
}
