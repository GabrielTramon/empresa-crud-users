'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface DeleteUserPayload {
  id: string;
  deletedById: string;
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, deletedById }: DeleteUserPayload) => {
      const response = await api.patch(`/users/user/${id}/delete`, {
        deletedById,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('❌ Erro ao deletar:', error.response?.data || error.message);
    },
  });
}
