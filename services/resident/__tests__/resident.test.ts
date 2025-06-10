import 'dotenv/config';
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Resident API', () => {
  const app = Fastify();

  beforeAll(() => {
    // Define routes directly for testing
    app.post('/resident', async (request, reply) => {
      const { name, email, password } = request.body as any;
      if (!name || !email || !password) {
        return reply.status(400).send({ error: 'Missing required fields' });
      }

      try {
        const newResident = await prisma.resident.create({
          data: { name, email, password },
        });
        return reply.status(201).send(newResident);
      } catch (error) {
        console.error('Error creating resident:', error); // <-- debugging aid
        return reply.status(500).send({ error: 'Failed to create resident profile' });
      }
    });

    app.get('/resident', async (request, reply) => {
      try {
        const residents = await prisma.resident.findMany();
        return reply.code(200).send(residents);
      } catch (error) {
        console.error('Error fetching residents:', error);
        return reply.status(500).send({ error: 'Failed to fetch residents' });
      }
    });
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should return 400 if resident data is incomplete', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/resident',
      payload: { name: 'Jabbar' }, // missing email and password
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: 'Missing required fields' });
  });

  it('should create resident and return 201', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    const res = await app.inject({
      method: 'POST',
      url: '/resident',
      payload: {
        name: 'Test User',
        email: uniqueEmail,
        password: 'secret',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject({
      name: 'Test User',
      email: uniqueEmail,
    });
  });
});
