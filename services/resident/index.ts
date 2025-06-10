import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// Endpoint untuk mendaftarkan penduduk baru
fastify.post('/resident', async (request, reply) => {
  // Validasi sederhana
  const { name, email, password } = request.body as any;
  if (!name || !email || !password) {
    return reply.status(400).send({ error: 'Data tidak lengkap' });
  }

  try {
    const newResident = await prisma.resident.create({
      data: { name, email, password /* Ingat untuk hash password di aplikasi nyata! */ },
    });
    return reply.status(201).send(newResident);
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Gagal membuat profil penduduk' });
  }
});

// Endpoint untuk mendapatkan data semua penduduk
fastify.get('/resident', async (request, reply) => {
  const residents = await prisma.resident.findMany();
  return residents;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info(`Server 'resident' berjalan di port 3001`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();