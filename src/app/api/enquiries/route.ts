import { NextResponse } from 'next/server';
import { getEnquiries, saveEnquiry } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/mail';

function checkAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.ADMIN_TOKEN || 'vmc_admin_session_token_xyz'}`;
  return authHeader === expectedToken;
}

export async function GET(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const enquiries = await getEnquiries();
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('API Enquiries GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate inputs
    const required = ['name', 'email', 'subject', 'message'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      subject: body.subject,
      message: body.message,
      createdAt: new Date().toISOString()
    };
    
    const saved = await saveEnquiry(newEnquiry);
    
    // Send email alert to admin (inshanouri@gmail.com)
    try {
      await sendNotificationEmail(saved, 'enquiry');
    } catch (mailErr) {
      console.error('Failed to send enquiry notification email:', mailErr);
    }
    
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('API Enquiries POST Error:', error);
    return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 });
  }
}
