export interface ITrack {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export enum TrackErrors {
  INCORRECT_BODY = 'Request body does not contain required fields',
  NOT_FOUND = 'Track not found',
  INVALID_ID = 'Track Id is invalid (not uuid)',
}
