export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export enum AlbumErrors {
  INCORRECT_BODY = 'Request body does not contain required fields',
  NOT_FOUND = 'Album not found',
  INVALID_ID = 'Album Id is invalid (not uuid)',
}
