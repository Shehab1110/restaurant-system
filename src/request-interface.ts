import { Request } from 'express';
import { User } from './user/user.schema';

export interface Req extends Request {
  user: User;
}
