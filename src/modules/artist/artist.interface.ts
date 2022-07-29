export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}

export enum ArtistErrors {
  INCORRECT_BODY = 'Request body does not contain required fields',
  NOT_FOUND = 'Artist not found',
  INVALID_ID = 'Artist Id is invalid (not uuid)',
}
