# Gunakan base image Node.js
FROM node:18-alpine

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin skema Prisma dari root konteks
COPY prisma ./prisma

# Salin package.json & package-lock.json dari folder layanan yang spesifik.
# PENTING: Ganti 'report' dengan 'report' atau 'alert' untuk Dockerfile lainnya.
COPY services/report/package*.json ./

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Salin sisa kode aplikasi dari folder layanan yang spesifik.
# PENTING: Ganti 'report' dengan 'report' atau 'alert' untuk Dockerfile lainnya.
COPY services/report/ .

# Build TypeScript ke JavaScript
RUN npx tsc

# Expose port yang digunakan oleh aplikasi.
# Ganti port ini sesuai dengan layanannya (3001, 3002, atau 3003).
EXPOSE 3001

# PERINTAH BARU:
# 1. Jalankan `prisma db push` untuk membuat/memperbarui tabel database.
# 2. Setelah itu, jalankan server Node.js.
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
