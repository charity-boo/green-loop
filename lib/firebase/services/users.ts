/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbService } from './db';
import { UserDoc, Role, AdminActionLogDoc } from '@/lib/types/firestore';

export interface UserFilters {
  role?: Role;
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  data: UserDoc[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetch paginated users with filters
 */
export async function getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 10));
  const skip = (page - 1) * limit;

  const queryFilters: any[] = [];
  if (filters.role) queryFilters.push(['role', '==', filters.role]);
  if (filters.active !== undefined) queryFilters.push(['active', '==', filters.active]);

  let users = await dbService.query<UserDoc>('users', {
    where: queryFilters as any,
    orderBy: [['createdAt', 'desc']],
  });

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    users = users.filter(u => 
      u.name?.toLowerCase().includes(searchLower) || 
      u.email.toLowerCase().includes(searchLower)
    );
  }

  const total = users.length;
  const paginatedData = users.slice(skip, skip + limit);

  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Update user role or status
 */
export async function updateUser(
  adminId: string,
  userId: string,
  updates: Partial<Pick<UserDoc, 'role' | 'active'>>,
  reason?: string
): Promise<void> {
  const beforeState = await dbService.get<UserDoc>('users', userId);
  if (!beforeState) throw new Error('User not found');

  await dbService.update('users', userId, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  // Log the action
  await dbService.add<AdminActionLogDoc>('admin_action_logs', {
    adminId,
    actionType: 'UPDATE_USER',
    targetType: 'User',
    targetId: userId,
    beforeState: { role: beforeState.role, active: beforeState.active },
    afterState: updates,
    reason,
    createdAt: new Date().toISOString(),
  });
}
