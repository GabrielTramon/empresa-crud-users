'use client';
import { useState } from 'react';
import { useCreateUser } from '@/hooks/useCreateUser';
import { z } from "zod";
import { FormatNational } from '@/utils/formatNationalId';
import { FormatContact } from '@/utils/formatContact';
import { FormatName } from '@/utils/formatName';


// Schema para validar os campos que deseja validar
const userSchema = z.object({
  name: z.string().min(3, "Deve ter pelo menos 3 letras"),
  email: z.string().email("email inválido"),
  password: z.string()
    .min(8, "no mínimo 8 amigão")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"),
  national: z.string().min(14, "CPF invalido"),
  contact: z.string().min(15,"Numero de telefone invalido"),
  birthdate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      const date = new Date(arg);
      if (!isNaN(date.getTime())) return date;
    }
    return undefined;
  }, 
  z.date({
    required_error: "Data invalida",
    invalid_type_error: "Data inválida",
  })
  .refine((date) => {
    // Data mínima: 1900-01-01
    const minDate = new Date("1900-01-01");
    return date >= minDate;
  }, {
    message: "Data antiga invalida",
  })
  .refine((date) => {
    // Data máxima: hoje (não pode ser no futuro)
    const maxDate = new Date();
    // Ignora hora para só comparar datas
    maxDate.setHours(0, 0, 0, 0);
    return date <= maxDate;
  }, {
    message: "Data futura invalida",
  })),
});

export default function Create() {
  const { mutate: createUser, isPending } = useCreateUser();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [national, setNational] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  function clearForm() {
    setName('');
    setContact('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNational('');
    setBirthdate('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    const result = userSchema.safeParse({ name, email, password,national, contact,birthdate });
    const errors: { [key: string]: string } = {};
  
    if (!result.success && result.error) {
      const formatted = result.error.format();
      for (const field in formatted) {
        const fieldError = formatted[field as keyof typeof formatted];
  
        // Verifica se é objeto com _errors
        if (
          typeof fieldError === 'object' &&
          fieldError !== null &&
          '_errors' in fieldError &&
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
  
    if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }
  
    setFormErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      createUser(
        { name, email, password, contact, national, birthdate },
        {
          onSuccess: () => {
            clearForm();
          },
        }
      );
    }
  }
  

  return (
    <div className="flex items-center justify-center w-full h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8 w-full max-w-md space-y-4 border-gray-100 border-2"
      >
        <h1 className="text-4xl text-blue-600 font-bold mb-6 text-center">
          Criar Usuário
        </h1>

        <input
          placeholder="Nome"
          maxLength={50}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          value={name}
          onChange={e => setName(FormatName(e.target.value))}
          required
        />
        {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}

        <input
          type="tel"
          maxLength={15}
          value={contact}
          onChange={(e) => setContact(FormatContact(e.target.value))}
          placeholder="Contato"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
        />
        {formErrors.contact && <p className="text-red-500 text-sm">{formErrors.contact}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={8}
          maxLength={64}
          required
        />
        {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}

        <input
          type="password"
          placeholder="Confirmar senha"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}

        <div className="flex justify-center space-x-5">
    {/* Coluna do national */}
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="CPF"
        className="w-45 p-2 border border-gray-300 rounded-md focus:outline-none"
        value={national}
        onChange={e => setNational(FormatNational(e.target.value))}
        maxLength={14}
      />
      {formErrors.national && (
        <p className="text-red-500 text-sm mt-1">{formErrors.national}</p>
      )}
    </div>

    {/* Coluna do birthdate */}
    <div className="flex flex-col">
      <input
        type="date"
        placeholder="Aniversário"
        className="w-45 p-2 border border-gray-300 rounded-md focus:outline-none"
        value={birthdate}
        onChange={e => setBirthdate(e.target.value)}
        min="1900-01-01"                  // Data mínima
        max={new Date().toISOString().split("T")[0]} // Data máxima = hoje
      />
      {formErrors.birthdate && (
        <p className="text-red-500 text-sm mt-1 text-left">
          {formErrors.birthdate}
        </p>
      )}
    </div>
  </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full p-2 border bg-blue-500 hover:bg-blue-600 rounded-md cursor-pointer text-white"
        >
          {isPending ? 'Criando...' : 'Criar'}
        </button>
      </form>
    </div>
  );
}
