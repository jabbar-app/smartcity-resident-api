# Gunakan base image Node.js
FROM node:18-alpine

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin skema Prisma dari root konteks
COPY prisma ./prisma

# Salin package.json & package-lock.json dari folder layanan yang spesifik.
# PENTING: Ganti 'resident' dengan 'report' atau 'alert' untuk Dockerfile lainnya.
COPY services/resident/package*.json ./

# Install dependencies MENGGUNAKAN FLAG BARU
# Ini akan mengabaikan error konflik versi peer dependency
RUN npm install --legacy-peer-deps

# Generate Prisma Client
RUN npx prisma generate

# Salin sisa kode aplikasi dari folder layanan yang spesifik.
# PENTING: Ganti 'resident' dengan 'report' atau 'alert' untuk Dockerfile lainnya.
COPY services/resident/ .

# Build TypeScript ke JavaScript
RUN npx tsc

# Expose port yang digunakan oleh aplikasi.
# Ganti port ini sesuai dengan layanannya (3001, 3002, atau 3003).
EXPOSE 3001

# Perintah untuk menjalankan aplikasi
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
