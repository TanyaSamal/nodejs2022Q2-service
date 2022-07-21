import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IArtist, ArtistErrors } from './artist.interface';
import { db } from '../../data/db';
import { CreateArtistDto } from './dto/create-artist.dto';
import { validateUuid } from 'src/utils';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async createArtist(createDto: CreateArtistDto): Promise<IArtist> {
    if (!createDto.name || !createDto.grammy) {
      throw new BadRequestException(ArtistErrors.INCORRECT_BODY);
    }

    const newArtist: IArtist = {
      id: uuidv4(),
      ...createDto,
    };

    db.artists.push(newArtist);

    return newArtist;
  }

  checkArtist(id): IArtist {
    return db.artists.find((artist) => artist.id === id);
  }

  async getArtistById(id: string): Promise<IArtist> {
    if (!validateUuid(id)) {
      throw new BadRequestException(ArtistErrors.INVALID_ID);
    }

    const condidate = this.checkArtist(id);

    if (!condidate) {
      throw new NotFoundException(ArtistErrors.NOT_FOUND);
    }

    return condidate;
  }

  async getAllArtists(): Promise<IArtist[]> {
    return db.artists;
  }

  async updateArtist(dto: UpdateArtistDto, id: string): Promise<IArtist> {
    if (typeof dto.grammy !== 'boolean' || typeof dto.name !== 'string') {
      throw new BadRequestException(ArtistErrors.INCORRECT_BODY);
    }

    if (!validateUuid(id)) {
      throw new BadRequestException(ArtistErrors.INVALID_ID);
    }

    const condidateIndex = db.artists.findIndex((artist) => artist.id === id);

    if (condidateIndex !== -1) {
      const oldData = db.artists[condidateIndex];
      db.artists[condidateIndex] = { ...oldData, ...dto };
    } else {
      throw new NotFoundException(ArtistErrors.NOT_FOUND);
    }

    return db.artists[condidateIndex];
  }

  async deleteArtist(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(ArtistErrors.INVALID_ID);
    }

    const condidateIndex = db.artists.findIndex((artist) => artist.id === id);

    if (condidateIndex !== -1) {
      db.artists.splice(condidateIndex, 1);
      this.trackService.deleteRef(id, 'artistId');
      this.albumService.deleteRef(id);
      this.favoritesService.deleteRef(id, 'artists');
    } else {
      throw new NotFoundException(ArtistErrors.NOT_FOUND);
    }
  }
}
