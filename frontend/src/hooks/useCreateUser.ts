import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface CreateUserData {
  name: string;
  email: string;
  contact: string;
  national: string;
  password: string;
  birthdate: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post('/users', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao criar usuário. Verifique os dados e tente novamente.');
      console.error('❌ Erro ao criar usuário:', error.response?.data || error.message);
    },
  });
}
