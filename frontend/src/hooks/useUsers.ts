import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  national: string;
  contact: string;
  birthdate: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

interface UseUsersParams {
  page?: number;
  take?: number;
  search?: string;
  orderField?: string;
  orderDirection?: "asc" | "desc";
}

interface UsersResponse {
  data: User[];
  totalPages: number;
}

export function useUsers(params: UseUsersParams = {}) {
  const {
    page = 1,
    take = 10,
    search = "",
    orderField = "name",
    orderDirection = "asc",
  } = params;

  return useQuery<UsersResponse>({
    queryKey: ["users", page, take, search, orderField, orderDirection],
    queryFn: async () => {
      const response = await api.get("/users", {
        params: {
          page,
          take,
          search,
          orderField,
          orderDirection,
          // Adicione um parâmetro para filtrar deletados no backend
          isDeleted: false
        },
      });

      // Remova o filtro local para manter a consistência da paginação e ordenação
      return {
        data: response.data.data,
        totalPages: response.data.totalPages,
      };
    },
  });
}