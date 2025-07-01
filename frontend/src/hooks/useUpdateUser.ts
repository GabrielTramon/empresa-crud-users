import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface UpdateUserData {
  id: string;
  name?: string;
  email?: string;
  contact?: string;
  national?: string;
  password?: string;
  birthdate?: string;
  updatedById?: string;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await api.put(`/users/user/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar usuário.');
      console.error('❌ Erro ao atualizar usuário:', error.response?.data || error.message);
    },
  });
}
