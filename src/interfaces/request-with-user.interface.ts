import { FastifyRequest } from 'fastify';
import { UserEntity } from 'modules/user/user.entity';



export interface RequestWithUser extends FastifyRequest {
    user: UserEntity;
  }