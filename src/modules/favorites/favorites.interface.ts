import { IAlbum } from '../album/album.interface';
import { IArtist } from '../artist/artist.interface';
import { ITrack } from '../track/track.interface';

export interface FavoritesRepsonse {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
}

export interface AllFavs {
  artists: string;
  albums: string;
  tracks: string;
}

export enum FavsErrors {
  INCORRECT_BODY = 'Request body does not contain required fields',
  NOT_FOUND = 'Entity with this ID is not favorite',
  INVALID_ID = 'Id is invalid (not uuid)',
  UNPROCESSABLE_ID = "Entity with this ID doesn't exist",
}
