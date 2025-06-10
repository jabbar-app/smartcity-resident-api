# 🧠 Smart City Resident API

![Smart City Banner](https://placehold.co/1200x400/0284c7/FFFFFF?text=SmartCity+Resident+API&font=raleway)

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/Fastify-000000?logo=fastify&logoColor=white&style=for-the-badge" alt="Fastify" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge" alt="Docker" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Grafana-F46800?logo=grafana&logoColor=white&style=for-the-badge" alt="Grafana" />
</p>

A microservices-style backend API simulating core modules for a Smart City. This project demonstrates a robust, observable, and containerized system built with modern technologies.

---

## ✨ Showcase & Demo

This project is fully containerized and can be run locally. The services provide a backend system where residents can register, submit daily reports, and receive system-wide alerts.

### Live Endpoints Example

Once running, the services are available on your local machine:
* **Resident Service:** `http://localhost:3001`
* **Report Service:** `http://localhost:3002`
* **Alert Service:** `http://localhost:3003`
* **Grafana Dashboard:** `http://localhost:3000`

### Example API Requests (`curl`)

**1. Register a new resident:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "Budi Santoso", "email": "budi.s@example.com", "password": "password123"}' \
  http://localhost:3001/resident
```

**2. Submit a daily report (use the `id` from the previous response):**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"content": "Feeling great today, attended a community workshop.", "residentId": "YOUR_RESIDENT_ID_HERE"}' \
  http://localhost:3002/report
```

### Monitoring Dashboard (Grafana)

A key feature of this project is its observability. Logs from all microservices are streamed to Loki and visualized in a Grafana dashboard, allowing for real-time monitoring and debugging.

*placeholder for your Grafana dashboard screenshot*
![Grafana Dashboard Screenshot](https://placehold.co/800x450/2d3748/FFFFFF?text=Your+Awesome+Grafana+Dashboard+Here&font=raleway)
> Screenshot of the Grafana dashboard showing log volume and recent log entries from all services.

---

## 🏗️ Tech Stack & Architecture

This project is built using a microservice architecture, where each core domain is a separate, independently deployable service. This enhances scalability and separation of concerns.

### Architecture Diagram

```
+--------------------------+
|       User / Client      |
| (e.g., Postman, Web App) |
+-------------+------------+
              |
+-------------v------------+      +--------------------------+
|                          |      |      Monitoring Stack      |
|     API Microservices    |      |--------------------------|
|                          |      |  +--------------------+  |
|  +--------------------+  |------>|  Grafana (Port 3000) |  |
|  | Resident API (3001)|  |      |  +--------+-----------+  |
|  +--------------------+  |      |           ^            |
|                          |      |           | (Logs)     |
|  +--------------------+  |      |  +--------+-----------+  |
|  | Report API   (3002)|  |------>|  Loki    (Port 3100) |  |
|  +--------------------+  |      |  +--------------------+  |
|                          |      +--------------------------+
|  +--------------------+  |
|  | Alert API    (3003)|  |
|  +--------------------+  |
|           |            |
+-----------|------------+
            | (Prisma ORM)
+-----------v------------+
|     PostgreSQL DB      |
|      (Port 5432)       |
+------------------------+
```

### Technologies Used

| Category         | Technology                                                                          |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Backend** | [Node.js](https://nodejs.org/), [TypeScript](https://www.typescriptlang.org/), [Fastify](https://www.fastify.io/)             |
| **Database** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)       |
| **Authentication** | Basic Bearer Token (JWT implementation is a future goal)                            |
| **Monitoring** | [Grafana](https://grafana.com/) (Visualization), [Loki](https://grafana.com/oss/loki/) (Log Aggregation) |
| **Testing** | [Jest](https://jestjs.io/), [Supertest](https://github.com/visionmedia/supertest) (Unit & Integration)      |
| **Infrastructure** | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)                                |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions)                               |

---

## 🗂️ Project Structure

The project uses a monorepo-style structure to manage all services within a single repository.

```
smartcity-resident-api/
├── services/
│   ├── resident/        # Handles resident profiles (Create, Read)
│   ├── report/          # Manages daily health or activity logs
│   └── alert/           # Manages emergency broadcast APIs
├── libs/                # (Future) Shared utilities (e.g., JWT, logger)
├── prisma/              # Shared Prisma schema and migrations
├── docker-compose.yml   # Orchestrates all services, DB, and monitoring stack
├── .github/workflows/   # CI/CD pipeline for running tests
└── README.md            # You are here!
```

---

## 🚀 Getting Started

To run this project locally, you need to have [Docker](https://www.docker.com/get-started) and Docker Compose installed.

**1. Clone the repository:**
```bash
git clone [https://github.com/your-username/smartcity-resident-api.git](https://github.com/your-username/smartcity-resident-api.git)
cd smartcity-resident-api
```

**2. Build and run the services:**
This single command will build the images for all services, start the containers, and set up the database.
```bash
docker-compose up --build
```

**3. The system is now running!**
* API services are accessible at their respective ports (3001, 3002, 3003).
* The Grafana dashboard is live at `http://localhost:3000`.

---

## 📖 API Endpoints

| Method | Path                 | Description                          | Service      |
| ------ | -------------------- | ------------------------------------ | ------------ |
| `POST` | `/resident`          | Register a new resident.             | Resident API |
| `GET`  | `/resident`          | Get a list of all residents.         | Resident API |
| `POST` | `/report`            | Submit a new daily report.           | Report API   |
| `GET`  | `/report/:residentId`| Get all reports for a specific resident. | Report API   |
| `POST` | `/alert`             | Create a new system-wide alert.      | Alert API    |
| `GET`  | `/alert`             | Get a list of all active alerts.     | Alert API    |

---

## 💼 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
