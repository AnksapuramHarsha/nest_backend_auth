import { FastifyRequest } from 'fastify';

export interface RequestWithUser extends FastifyRequest {
  user: {
    id: string;
    role: string;
  };
}
