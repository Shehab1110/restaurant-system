import { Request } from 'express';
import { User } from '../database/user.schema';

export interface Req extends Request {
  user: User;
}
