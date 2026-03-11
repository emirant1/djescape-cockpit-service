import { UserRole } from '../entity/user.entity';

export interface IUser {
  id: number;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
