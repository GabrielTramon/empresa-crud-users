"use client";

import { Pencil, Trash, SearchIcon } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useUpdateUser } from "@/hooks/useUpdateUser"; // ⬅️ Novo hook
import Modal from "@/components/modal";
import { useEffect, useState } from "react";
import ModalView from "@/components/modalView";

export default function View() {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // ou 10, como preferir

  const { data: users, isLoading, error } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser(); // ⬅️ Novo hook

  const [currentUserId, setCurrentUserId] = useState("");
  const [isModalOpenEdit, setModalOpenEdit] = useState(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, []);

  if (isLoading)
    return <div className="text-center mt-10">Carregando usuários...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        Erro ao carregar usuários.
      </div>
    );

  const filteredUsers = users?.filter((user: any) =>
    [user.name, user.email, user.national, user.contact, user.id].some(
      (field) => field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers?.slice(startIndex, endIndex);


  return (
    <div className="flex flex-col items-center w-full min-h-screen mt-4">
      <div className="flex flex-col items-center p-5 w-full max-w-lg">
        <div className="flex text-center items-center gap-3">
          <h1 className="text-3xl text-blue-600 font-bold">
            Pesquisar Usuário
          </h1>
          <SearchIcon className="text-blue-600 w-7 h-7 hover:scale-112" />
        </div>
        <input
          type="text"
          className="w-2xl h-10 px-4 border-2 border-gray-400 rounded-2xl mt-3 outline-none"
          placeholder="Pesquisar por nome, E-mail, CPF ou contato"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white w-11/12 mt-8 border border-gray-300 rounded-2xl">
        <table className="min-w-full rounded-lg">
          <thead className="sticky top-0 text-blue-700 z-10">
            <tr>
              <th className="px-8 py-3 text-left">Nome</th>
              <th className="px-8 py-3 text-left">E-mail</th>
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
                  onClick={() => {
                    setModalOpenEdit(true);
                    setSelectedUser(user);
                  }}
                  className="border-t border-gray-200 hover:bg-blue-50 cursor-pointer"
                >
                  <td className="px-8 py-3">{user.name}</td>
                  <td className="px-8 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.national}</td>
                  <td className="px-4 py-3">{user.contact}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                          setIsModalOpenCreate(true);
                        }}
                        className="text-blue-800 cursor-pointer hover:text-blue-500 hover:scale-110"
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUserIdToDelete(user.id);
                          setIsModalOpenDelete(true);
                          setSelectedUser(user);
                        }}
                        className="text-blue-950 cursor-pointer hover:text-red-800 hover:scale-110"
                      >
                        <Trash />
                      </button>
                    </div>
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

        {/* Modal Editar */}
        <Modal
          isOpen={isModalOpenCreate}
          onClose={() => {
            setIsModalOpenCreate(false);
            setSelectedUser(null);
          }}
        >
          <div className="flex flex-col gap-4 px-4 py-2">
            <h2 className="text-3xl font-semibold text-center mb-4 text-gray-900">
              Editar usuário
            </h2>
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Nome"
              value={selectedUser?.name || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Contato"
              value={selectedUser?.contact || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, contact: e.target.value })
              }
            />
            <input
              type="email"
              className="border p-2 rounded"
              placeholder="Email"
              value={selectedUser?.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="CPF"
              value={selectedUser?.national || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, national: e.target.value })
              }
            />
            <input
              type="date"
              className="border p-2 rounded"
              placeholder="Data de Aniversário"
              value={selectedUser?.birthdate || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, contact: e.target.value })
              }
            />
            <div className="flex justify-center mt-4 gap-4">
              <button
                className="w-32 h-10 rounded-2xl bg-gray-300 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setIsModalOpenCreate(false);
                  setSelectedUser(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="w-32 h-10 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                onClick={() => {
                  if (selectedUser) {
                    updateUser({
                      id: selectedUser.id,
                      name: selectedUser.name,
                      email: selectedUser.email,
                      contact: selectedUser.contact,
                      national: selectedUser.national,
                      updatedById: currentUserId,
                    });
                    setIsModalOpenCreate(false);
                    setSelectedUser(null);
                  }
                }}
              >
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
            setSelectedUser(null);
          }}
        >
          <div className="flex flex-col">
            <h2 className="text-xl font-medium text-center">
              Tem certeza de que deseja deletar o usuário{" "}
              <span className="font-bold">{selectedUser?.name}</span>?
            </h2>
            <div className="flex justify-center mt-5 gap-4">
              <button
                className="w-32 h-10 rounded-2xl bg-gray-300 hover:bg-gray-200"
                onClick={() => {
                  setIsModalOpenDelete(false);
                  setUserIdToDelete(null);
                  setSelectedUser(null);
                }}
              >
                Voltar
              </button>
              <button
                className="w-32 h-10 rounded-2xl bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  if (userIdToDelete) {
                    deleteUser({
                      id: userIdToDelete,
                      deletedById: currentUserId,
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

        {/* Modal View */}
        <ModalView
          isOpen={isModalOpenEdit}
          onClose={() => setModalOpenEdit(false)}
        >
          <h1 className="text-3xl font-semibold text-center mt-5 text-gray-900">
            Detalhes do Usuário
          </h1>
          <div className="mt-10 space-y-1">
            <h2>  
              <span className="font-bold">Nome: </span>
              {selectedUser?.name}
            </h2>
            <h2>
              <span className="font-bold">Contato: </span>
              {selectedUser?.contact}
            </h2>
            <h2>
              <span className="font-bold">E-mail: </span>
              {selectedUser?.email}
            </h2>
            <h2>
              <span className="font-bold">CPF: </span>
              {selectedUser?.national}
            </h2>
            <h2>
              <span className="font-bold">Criado: </span>
              {selectedUser?.createdAt}
            </h2>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="w-32 h-10 rounded-2xl bg-gray-300 hover:bg-gray-200 cursor-pointer"
              onClick={() => setModalOpenEdit(false)}
            >
              Voltar
            </button>
          </div>
        </ModalView>
        
      </div>
    </div>
  );
}
