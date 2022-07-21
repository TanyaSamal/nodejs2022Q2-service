import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { db } from 'src/data/db';
import { validateUuid } from 'src/utils';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { FavoritesRepsonse, FavsErrors } from './favorites.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  async getAllFavs(): Promise<FavoritesRepsonse> {
    return db.favs;
  }

  async addTrackToFavs(id: string) {
    if (!validateUuid(id)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.trackService.checkTrack(id);

    if (condidate) {
      db.favs.tracks.push(condidate);
    } else {
      throw new UnprocessableEntityException(FavsErrors.UNPROCESSABLE_ID);
    }
  }

  async addAlbumToFavs(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    // const condidate = await this.albumService.checkAlbum(id);

    // if (condidate) {
    //   db.favs.albums.push(condidate);
    // } else {
    //   throw new UnprocessableEntityException(FavsErrors.UNPROCESSABLE_ID);
    // }
  }

  async addArtistToFavs(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    // const condidate = await this.artistService.checkArtist(id);

    // if (condidate) {
    //   db.favs.artists.push(condidate);
    // } else {
    //   throw new UnprocessableEntityException(FavsErrors.UNPROCESSABLE_ID);
    // }
  }

  async deleteTrackFromFavs(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.trackService.getTrackById(id);

    if (condidate) {
      db.favs.tracks = db.favs.tracks.filter((track) => track.id !== id);
    } else {
      throw new NotFoundException(FavsErrors.NOT_FOUND);
    }
  }

  async deleteAlbumFromFavs(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.albumService.getAlbumById(id);

    if (condidate) {
      db.favs.albums = db.favs.albums.filter((album) => album.id !== id);
    } else {
      throw new NotFoundException(FavsErrors.NOT_FOUND);
    }
  }

  async deleteArtistFromFavs(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.artistService.getArtistById(id);

    if (condidate) {
      db.favs.artists = db.favs.artists.filter((artist) => artist.id !== id);
    } else {
      throw new NotFoundException(FavsErrors.NOT_FOUND);
    }
  }

  async deleteRef(id: string, field: string) {
    if (field === 'artists' || field === 'albums' || field === 'tracks') {
      const ref = db.favs[field].findIndex((entity) => entity.id === id);
      if (ref !== -1) {
        db.favs[field].splice(ref, 1);
      }
    }
  }
}
