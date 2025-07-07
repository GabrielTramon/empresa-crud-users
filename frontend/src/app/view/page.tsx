"use client";
import {
  Pencil,
  Trash,
  SearchIcon,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown 
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import Modal from "@/components/modal";
import { useEffect, useState } from "react";
import ModalView from "@/components/modalView";
import { z } from "zod";
import { FormatName } from "@/utils/formatName";
import { FormatContact } from "@/utils/formatContact";
import { FormatNational } from "@/utils/formatNationalId";

const userSchema = z.object({
  name: z.string().min(3, "Deve ter pelo menos 3 letras"),
  email: z.string().email("email inválido"),
  national: z.string().min(14, "CPF invalido"),
  contact: z.string().min(15, "Numero de telefone invalido"),
  birthdate: z.preprocess(
    (arg) => {
      if (typeof arg === "string") {
        const date = new Date(arg + "T00:00:00");
        return isNaN(date.getTime()) ? undefined : date;
      }
      if (arg instanceof Date && !isNaN(arg.getTime())) {
        return arg;
      }

      if (typeof arg === "number") {
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;
      }

      return undefined;
    },
    z
      .date({
        required_error: "Data inválida",
        invalid_type_error: "Data inválida",
      })
      .refine((date) => date >= new Date("1900-01-01"), {
        message: "Data antiga inválida",
      })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date <= today;
        },
        {
          message: "Data futura inválida",
        }
      )
  ),
});

export default function View() {
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser(); // ⬅️ Novo hook

  const [currentUserId, setCurrentUserId] = useState("");
  const [isModalOpenEdit, setModalOpenEdit] = useState(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [orderField, setOrderField] = useState("name");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

  const {
    data: users,
    isLoading,
    error,
  } = useUsers({
    page,
    take,
    search: debouncedSearch,
    orderField,
    orderDirection,
  });

  const usersArray = users?.data ?? [];
  const totalPages = users?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // aguarda 500ms depois do último caractere

    return () => {
      clearTimeout(handler); // limpa o timeout se o usuário continuar digitando
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!orderField) {
      setOrderField("name");
      setOrderDirection("asc");
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages]);

  const handleOrder = (field: string) => {
    const validOrderFields = [
      "name",
      "email",
      "national",
      "contact",
      "createdAt",
      "updatedAt",
      "birthdate",
    ];

    if (!validOrderFields.includes(field)) {
      console.warn(`Campo ${field} não é ordenável`);
      return;
    }

    const isSameField = orderField === field;
    const newDirection = isSameField
      ? orderDirection === "asc"
        ? "desc"
        : "asc"
      : "asc"; // padrão

    setOrderField(field);
    setOrderDirection(newDirection);
    setPage(1);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = userSchema.safeParse({
      name: selectedUser.name,
      email: selectedUser.email,
      national: selectedUser.national,
      contact: selectedUser.contact,
      birthdate: new Date(selectedUser.birthdate).toISOString().split("T")[0],
    });
    const errors: { [key: string]: string } = {};

    if (!result.success && result.error) {
      const formatted = result.error.format();
      for (const field in formatted) {
        const fieldError = formatted[field as keyof typeof formatted];

        // Verifica se é objeto com _errors
        if (
          typeof fieldError === "object" &&
          fieldError !== null &&
          "_errors" in fieldError &&
          Array.isArray(fieldError._errors) &&
          fieldError._errors.length > 0
        ) {
          errors[field] = fieldError._errors[0];
        }
        // Caso seja string[]
        else if (Array.isArray(fieldError) && fieldError.length > 0) {
          errors[field] = fieldError[0];
        }
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      updateUser({
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        contact: selectedUser.contact,
        national: selectedUser.national,
        birthdate: selectedUser.birthdate,
        updatedById: currentUserId,
      });
      setIsModalOpenCreate(false);
      setSelectedUser(null);
    }
  }

  function getOrderIcon(currentField: string, orderField: string, orderDirection: string) {
    if (currentField !== orderField) return <ChevronsUpDown className="inline w-4 h-4 text-gray-400" />;
    if (orderDirection === "asc") return <ChevronUp className="inline w-4 h-4" />;
    return <ChevronDown className="inline w-4 h-4" />;
  }
  
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="flex flex-col items-center w-full max-w-lg">
        <div className="flex text-center items-center gap-3">
          <h1 className="text-3xl text-blue-600 font-bold">
            Pesquisar Usuário
          </h1>
          <SearchIcon className="text-blue-600 w-7 h-7 hover:scale-112" />
        </div>
        <input
          type="text"
          className="w-2xl h-10 px-4 border-2 border-gray-300 rounded-2xl outline-none"
          placeholder="Pesquisar por nome, E-mail, CPF ou contato"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white w-11/12 border border-gray-200 rounded mt-4">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-gray-50 text-blue-700 z-10">
            <tr>
              <th
                onClick={() => handleOrder("name")}
                className="px-8 py-3 text-left rounded-tl-2xl border-b border-gray-300 cursor-pointer"
              >
                Nome {getOrderIcon("name", orderField, orderDirection)}
              </th>
              <th
                onClick={() => handleOrder("email")}
                className="px-8 py-3 text-left border-b border-gray-300 cursor-pointer"
              >
                E-mail {getOrderIcon("email", orderField, orderDirection)}
              </th>
              <th
                onClick={() => handleOrder("national")}
                className="px-4 py-3 text-left border-b border-gray-300"
              >
                CPF {getOrderIcon("national", orderField, orderDirection)}
              </th>
              <th
                className="px-4 py-3 text-left border-b border-gray-300"
                onClick={() => handleOrder("contact")}
              >
                Contato {getOrderIcon("contact", orderField, orderDirection)}
              </th>
              <th className="px-4 py-3 text-left rounded-tr-2xl border-b border-gray-300">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {usersArray.length > 0 ? (
              usersArray.map((user: any) => (
                <tr
                  key={user.id}
                  onDoubleClick={() => {
                    setModalOpenEdit(true);
                    setSelectedUser(user);
                  }}
                  className="border-t border-gray-200 hover:bg-blue-50 cursor-pointer"
                >
                  <td className="px-8 py-3 h-16">{user.name}</td>
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
                  {searchTerm
                    ? `Nenhum resultado para "${searchTerm}"`
                    : "Nenhum usuário encontrado."}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-blue-600">
                Editar usuário
              </h2>
              <p className="text-gray-500 mt-1">Atualize os dados do usuário</p>
            </div>

            <div className="space-y-4">
              {/* Campo Nome */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all"
                  placeholder="Digite o nome"
                  value={selectedUser?.name || ""}
                  maxLength={50}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      name: FormatName(e.target.value),
                    })
                  }
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Campo Contato */}
              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Telefone
                </label>
                <input
                  id="contact"
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all"
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  value={selectedUser?.contact || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      contact: FormatContact(e.target.value),
                    })
                  }
                />
                {formErrors.contact && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.contact}
                  </p>
                )}
              </div>

              {/* Campo Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all"
                  placeholder="seu@email.com"
                  value={selectedUser?.email || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Campos CPF e Data Nascimento (em linha) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="national"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CPF
                  </label>
                  <input
                    id="national"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={selectedUser?.national || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        national: FormatNational(e.target.value),
                      })
                    }
                  />
                  {formErrors.national && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.national}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="birthdate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data Nascimento
                  </label>
                  <input
                    id="birthdate"
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all"
                    min="1900-01-01"
                    max={new Date().toISOString().split("T")[0]}
                    value={
                      selectedUser?.birthdate
                        ? new Date(selectedUser.birthdate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        birthdate: e.target.value,
                      })
                    }
                  />
                  {formErrors.birthdate && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.birthdate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center  space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpenCreate(false);
                  setSelectedUser(null);
                }}
                className="w-32 h-10  border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-32 h-10  bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:outline-none focus:ring-offset-2 transition-colors cursor-pointer "
              >
                Salvar
              </button>
            </div>
          </form>
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
                className="w-32 h-10  border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  setIsModalOpenDelete(false);
                  setUserIdToDelete(null);
                  setSelectedUser(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="w-32 h-10 bg-red-500 rounded-lg font-medium text-white hover:bg-red-600 transition-colors cursor-pointer"
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
          <h1 className="text-3xl font-bold text-blue-600 mt-5">
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
              <span className="font-bold">Aniversário: </span>
              {selectedUser?.birthdate &&
                new Date(selectedUser.birthdate).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
            </h2>
            <h2>
              <span className="font-bold">Criado: </span>
              {selectedUser?.createdAt &&
                new Date(selectedUser.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
            </h2>
            <h2>
              <span className="font-bold">Editado: </span>
              {selectedUser?.updatedAt &&
                new Date(selectedUser.updatedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
            </h2>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="w-32 h-10  border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setModalOpenEdit(false)}
            >
              Voltar
            </button>
          </div>
        </ModalView>
      </div>

      <div className="flex w-full justify-between px-18 pb-10 mt-2">
        <div className="flex">
          <select
            value={take}
            onChange={(e) => setTake(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className={`${
              page <= 1
                ? "text-gray-400 cursor-default"
                : "cursor-pointer hover:text-blue-700"
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => {
              setPage(page + 1);
            }}
            disabled={totalPages <= page || page === 0}
            className={`${
              totalPages <= page || page === 0
                ? "text-gray-400 cursor-default"
                : "cursor-pointer hover:text-blue-700"
            }`}
          >
            Próxima
          </button>
        </div>
        <div>
          <span className="font-semibold">Página {page < 1 ? 0 : page}</span>
          <span className="font-semibold"> de {page < 1 ? 0 : totalPages}</span>
        </div>
      </div>
    </div>
  );
}
