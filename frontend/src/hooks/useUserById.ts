'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  national: string;
  birthdate: string;
}

export function useUserById(userId: string) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/users/user${userId}`);
      return response.data;
    },
    enabled: !!userId, // só busca se o ID for válido
  });
}
