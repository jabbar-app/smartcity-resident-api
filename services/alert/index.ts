import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

// Inisialisasi Fastify dengan opsi logger
const fastify = Fastify({
  logger: true,
});

// Inisialisasi Prisma Client untuk berinteraksi dengan database
const prisma = new PrismaClient();

/**
 * Endpoint untuk membuat pengumuman/peringatan baru.
 * Membutuhkan `title` dan `message` di dalam body request.
 */
fastify.post('/alert', async (request, reply) => {
  // Ambil data dari body request
  const { title, message } = request.body as { title: string; message: string };

  // Validasi input sederhana
  if (!title || !message) {
    return reply.status(400).send({ error: 'Title dan message dibutuhkan' });
  }

  try {
    // Buat entri pengumuman baru di database
    const newAlert = await prisma.alert.create({
      data: {
        title,
        message,
      },
    });
    // Kirim balasan sukses dengan data yang baru dibuat
    return reply.status(201).send(newAlert);
  } catch (error) {
    // Jika terjadi error, log error tersebut
    fastify.log.error(error);
    // Kirim balasan error ke client
    return reply.status(500).send({ error: 'Gagal membuat pengumuman' });
  }
});

/**
 * Endpoint untuk mendapatkan semua pengumuman yang ada.
 */
fastify.get('/alert', async (request, reply) => {
  // Cari semua pengumuman di database
  const alerts = await prisma.alert.findMany({
    // Urutkan berdasarkan tanggal pembuatan terbaru
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Kirim balasan berisi daftar pengumuman
  return reply.send(alerts);
});

/**
 * Fungsi untuk menjalankan server Fastify.
 * Server akan berjalan di port 3003.
 */
const start = async () => {
  try {
    // Mulai server untuk menerima koneksi dari semua alamat IP (0.0.0.0)
    await fastify.listen({ port: 3003, host: '0.0.0.0' });
    fastify.log.info(`Server 'alert' berjalan di http://localhost:3003`);
  } catch (err) {
    // Jika gagal memulai server, log error dan matikan proses
    fastify.log.error(err);
    process.exit(1);
  }
};

// Panggil fungsi start untuk menjalankan server
start();
