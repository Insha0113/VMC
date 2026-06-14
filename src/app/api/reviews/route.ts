import { NextResponse } from 'next/server';
import { getReviews, saveReview, Review } from '@/lib/db';

const AVATAR_COLORS = ['#0871B2', '#95C83E', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('API Reviews GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate inputs
    const { name, role, rating, text } = body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Missing or invalid field: name' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Missing or invalid field: rating (must be 1-5)' }, { status: 400 });
    }
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json({ error: 'Missing or invalid field: text' }, { status: 400 });
    }

    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      role: role && role.trim() !== '' ? role.trim() : 'Visitor',
      rating,
      text: text.trim(),
      avatarColor: randomColor,
      createdAt: new Date().toISOString()
    };

    const saved = await saveReview(newReview);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('API Reviews POST Error:', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}
