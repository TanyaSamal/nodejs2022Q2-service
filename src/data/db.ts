import { IUser } from 'src/modules/user/user.interface';

interface IDb {
  users: IUser[];
}

export const db: IDb = {
  users: [],
};
