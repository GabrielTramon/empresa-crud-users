'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  national: string;
  contact: string;
  isDeleted?: boolean;
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('users/all');
      return response.data.filter((user: User) => !user.isDeleted); // ⛔️ Oculta deletados
    },
  });
}
