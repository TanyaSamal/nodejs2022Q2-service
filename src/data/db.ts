import { IAlbum } from 'src/modules/album/album.interface';
import { IArtist } from 'src/modules/artist/artist.interface';
import { FavoritesRepsonse } from 'src/modules/favorites/favorites.interface';
import { ITrack } from 'src/modules/track/track.interface';
import { IUser } from 'src/modules/user/user.interface';

interface IDb {
  users: IUser[];
  artists: IArtist[];
  tracks: ITrack[];
  albums: IAlbum[];
  favs: FavoritesRepsonse;
}

export const db: IDb = {
  users: [],
  artists: [],
  tracks: [],
  albums: [],
  favs: {
    artists: [],
    albums: [],
    tracks: [],
  },
};
