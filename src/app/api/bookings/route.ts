import { NextResponse } from 'next/server';
import { getBookings, saveBooking, updateBookingStatus, deleteBooking, Booking } from '@/lib/db';
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
    const bookings = await getBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('API Bookings GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const required = ['patientName', 'patientEmail', 'patientPhone', 'department', 'doctorId', 'doctorName', 'date', 'time'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    const newBooking = {
      id: body.id || `book-${Date.now()}`,
      patientName: body.patientName,
      patientEmail: body.patientEmail,
      patientPhone: body.patientPhone,
      department: body.department,
      doctorId: body.doctorId,
      doctorName: body.doctorName,
      date: body.date,
      time: body.time,
      symptoms: body.symptoms || '',
      status: body.status || 'pending',
      createdAt: new Date().toISOString()
    };
    
    const saved = await saveBooking(newBooking as Booking);
    
    // Send email alert to admin (inshanouri@gmail.com)
    try {
      await sendNotificationEmail(saved, 'booking');
    } catch (mailErr) {
      console.error('Failed to send booking notification email:', mailErr);
    }
    
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('API Bookings POST Error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing ID or status' }, { status: 400 });
    }
    
    const validStatuses = ['pending', 'approved', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    
    const success = await updateBookingStatus(id, status);
    if (success) {
      return NextResponse.json({ success: true, status });
    } else {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Bookings PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }
    
    const success = await deleteBooking(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Bookings DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
