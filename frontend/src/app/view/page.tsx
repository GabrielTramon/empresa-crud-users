"use client";

import { Pencil, Trash, SearchIcon } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import Modal from "@/components/modal";
import { useEffect, useState } from "react";

export default function View() {
  const { data: users, isLoading, error } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const [currentUserId, setCurrentUserId] = useState('');

useEffect(() => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    setCurrentUserId(storedUserId);
  }
}, []);

  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading)
    return <div className="text-center mt-10">Carregando usuários...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        Erro ao carregar usuários.
      </div>
    );

  // 🔍 Filtro por busca
  const filteredUsers = users?.filter((user: any) =>
    [user.name, user.email, user.national, user.contact, user.id]
      .some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col items-center w-full min-h-screen mt-4">
      <div className="flex flex-col items-center p-5 w-full max-w-lg">
        <div className="flex text-center items-center gap-3">
          <h1 className="text-3xl text-blue-600 font-bold ">
            Pesquisar Usuário
          </h1>
          <SearchIcon className="text-blue-600 w-7 h-7 hover:scale-112"/>
        </div>
        <input
          type="text"
          className="w-2xl h-10 px-4 border-2 border-gray-400 rounded-2xl mt-3 outline-none"
          placeholder="Pesquisar por nome, email, CPF ou contato"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white w-11/12 mt-8 border border-gray-300 rounded-2xl">
        <div className="">
          <table className="min-w-full rounded-lg">
            <thead className="sticky top-0 text-blue-700 z-10">
              <tr>
                <th className="px-8 py-3 text-left">Nome</th>
                <th className="px-8 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">CPF</th>
                <th className="px-4 py-3 text-left">Contato</th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-200 hover:bg-blue-50"
                  >
                    <td className="px-8 py-3">{user.name}</td>
                    <td className="px-8 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.national}</td>
                    <td className="px-4 py-3">{user.contact}</td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setIsModalOpenCreate(true)}
                          className="text-blue-800 cursor-pointer hover:text-blue-500"
                        >
                          <Pencil />
                        </button>
                        <button
                          onClick={() => {
                            setUserIdToDelete(user.id);
                            setIsModalOpenDelete(true);
                            setSelectedUser(user)
                          }}
                          className="text-blue-950 cursor-pointer hover:text-red-800"
                        >
                          <Trash />
                        </button>
                      </div>

                      {/* Modal Editar */}
                      <Modal
                        isOpen={isModalOpenCreate}
                        onClose={() => setIsModalOpenCreate(false)}
                      >
                        <div className="flex flex-col">
                          <h2 className="text-xl font-bold w-full flex justify-center">
                            Alterar esse conteúdo?
                          </h2>
                          <div className="flex justify-center mt-5">
                            <button className="p-2 rounded-2xl bg-blue-500 w-3xs hover:bg-blue-800 cursor-pointer text-white">
                              Alterar
                            </button>
                          </div>
                        </div>
                      </Modal>

                      {/* Modal Deletar */}
                      <Modal
                        isOpen={isModalOpenDelete}
                        onClose={() => {
                          setIsModalOpenDelete(false);
                          setUserIdToDelete(null);
                        }}
                      >
                        <div className="flex flex-col">
                          <h2 className="text-xl font-medium w-full justify-center text-center">
                            Tem certeza de que deseja deletar o usuário <span className="font-bold">{selectedUser?.name}</span>?
                          </h2>
                          <div className="flex justify-center mt-5 gap-4">
                            <button
                              className="w-32 h-10 rounded-2xl bg-gray-300 hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                setIsModalOpenDelete(false);
                                setUserIdToDelete(null);
                                setSelectedUser(null)
                              }}
                            >
                              Cancelar
                            </button>
                            <button
                              className="w-32 h-10 rounded-2xl bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                              onClick={() => {
                                if (userIdToDelete) {
                                  deleteUser({
                                    id: userIdToDelete,
                                    deletedById: currentUserId, // <- obrigatório conforme tipagem
                                  });
                                  setIsModalOpenDelete(false);
                                  setUserIdToDelete(null);
                                }
                              }}
                            >
                              Deletar
                            </button>
                          </div>
                        </div>
                      </Modal>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
