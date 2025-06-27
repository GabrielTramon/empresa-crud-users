import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

import { hash } from 'bcryptjs'; // vou usar hash pra senha (instale: npm i bcryptjs)

async function main() {
  // Limpa todos os usuários para evitar duplicidade (opcional)
  await prisma.user.deleteMany();

  // Cria um usuário "root" sem createdById, pois pode ser o primeiro
  const rootPassword = await hash('root1234', 10);

  const rootUser = await prisma.user.create({
    data: {
      name: 'Root Admin',
      birthdate: new Date('1980-01-01'),
      contact: '123456789',
      national: '00000000000',
      email: 'root@admin.com',
      password: rootPassword,
      token: '',
      isDeleted: false,
      createdById: '', // vazio porque é o primeiro
      updateById: '',
      deletedById: '',
    },
  });

  // Cria um usuário comum que foi criado pelo rootUser
  const userPassword = await hash('user1234', 10);

  await prisma.user.create({
    data: {
      name: 'User Normal',
      birthdate: new Date('1990-05-20'),
      contact: '987654321',
      national: '11111111111',
      email: 'user@example.com',
      password: userPassword,
      token: '',
      isDeleted: false,
      createdById: rootUser.id,
      updateById: rootUser.id,
      deletedById: '',
    },
  });

  console.log('Seed de usuários finalizada!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
