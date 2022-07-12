import { IArtist } from 'src/modules/artist/artist.interface';
import { IUser } from 'src/modules/user/user.interface';

interface IDb {
  users: IUser[];
  artists: IArtist[];
}

export const db: IDb = {
  users: [],
  artists: [],
};
