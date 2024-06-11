import { FastifyInstance } from 'fastify'
import { register } from './controllers/register.controler'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
