import { NextRequest, NextResponse } from 'next/server';
import { getUsers, UserFilters } from '@/lib/firebase/services/users';
import { getSession } from '@/lib/auth';
import { Role } from '@/types/firestore';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const filters: UserFilters = {
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 10),
  };
  const role = searchParams.get('role') as Role | null;
  if (role) filters.role = role;
  const search = searchParams.get('search');
  if (search) filters.search = search;

  try {
    const data = await getUsers(filters);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
