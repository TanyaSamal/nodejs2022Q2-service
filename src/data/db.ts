import { IArtist } from 'src/modules/artist/artist.interface';
import { ITrack } from 'src/modules/track/track.interface';
import { IUser } from 'src/modules/user/user.interface';

interface IDb {
  users: IUser[];
  artists: IArtist[];
  tracks: ITrack[];
}

export const db: IDb = {
  users: [],
  artists: [],
  tracks: [],
};
