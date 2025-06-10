import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

// Inisialisasi Fastify dengan opsi logger
const fastify = Fastify({
  logger: true,
});

// Inisialisasi Prisma Client untuk berinteraksi dengan database
const prisma = new PrismaClient();

/**
 * Endpoint untuk mengirimkan laporan baru.
 * Membutuhkan `content` dan `residentId` di dalam body request.
 */
fastify.post('/report', async (request, reply) => {
  // Ambil data dari body request
  const { content, residentId } = request.body as { content: string; residentId: string };

  // Validasi input sederhana
  if (!content || !residentId) {
    return reply.status(400).send({ error: 'Content dan residentId dibutuhkan' });
  }

  try {
    // Buat entri laporan baru di database
    const newReport = await prisma.report.create({
      data: {
        content,
        residentId,
      },
    });
    // Kirim balasan sukses dengan data yang baru dibuat
    return reply.status(201).send(newReport);
  } catch (error) {
    // Jika terjadi error (misalnya residentId tidak valid), log error tersebut
    fastify.log.error(error);
    // Kirim balasan error ke client
    return reply.status(500).send({ error: 'Gagal membuat laporan' });
  }
});

/**
 * Endpoint untuk mendapatkan semua laporan dari seorang penduduk.
 * Menggunakan `residentId` dari parameter URL.
 */
fastify.get('/report/:residentId', async (request, reply) => {
  // Ambil residentId dari parameter URL
  const { residentId } = request.params as { residentId: string };

  // Cari semua laporan yang cocok dengan residentId
  const reports = await prisma.report.findMany({
    where: {
      residentId: residentId,
    },
    // Urutkan berdasarkan tanggal submit terbaru
    orderBy: {
      submittedAt: 'desc',
    },
  });

  // Kirim balasan berisi daftar laporan
  return reply.send(reports);
});

/**
 * Fungsi untuk menjalankan server Fastify.
 * Server akan berjalan di port 3002.
 */
const start = async () => {
  try {
    // Mulai server untuk menerima koneksi dari semua alamat IP (0.0.0.0)
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    fastify.log.info(`Server 'report' berjalan di http://localhost:3002`);
  } catch (err) {
    // Jika gagal memulai server, log error dan matikan proses
    fastify.log.error(err);
    process.exit(1);
  }
};

// Panggil fungsi start untuk menjalankan server
start();
