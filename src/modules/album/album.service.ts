import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../data/db';
import { validateUuid } from 'src/utils';
import { AlbumErrors, IAlbum } from './album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async createAlbum(createDto: CreateAlbumDto): Promise<IAlbum> {
    const newAlbum: IAlbum = {
      id: uuidv4(),
      ...createDto,
    };

    db.albums.push(newAlbum);

    return newAlbum;
  }

  checkAlbum(id): IAlbum {
    return db.albums.find((album) => album.id === id);
  }

  async getAlbumById(id: string): Promise<IAlbum> {
    if (!validateUuid(id)) {
      throw new BadRequestException(AlbumErrors.INVALID_ID);
    }

    const condidate = this.checkAlbum(id);

    if (!condidate) {
      throw new NotFoundException(AlbumErrors.NOT_FOUND);
    }

    return condidate;
  }

  async getAllAlbums(): Promise<IAlbum[]> {
    return db.albums;
  }

  async updateAlbum(dto: UpdateAlbumDto, id: string): Promise<IAlbum> {
    if (typeof dto.year !== 'number' || typeof dto.name !== 'string') {
      throw new BadRequestException(AlbumErrors.INCORRECT_BODY);
    }

    if (!validateUuid(id)) {
      throw new BadRequestException(AlbumErrors.INVALID_ID);
    }

    const condidateIndex = db.albums.findIndex((album) => album.id === id);

    if (condidateIndex !== -1) {
      const oldData = db.albums[condidateIndex];
      db.albums[condidateIndex] = { ...oldData, ...dto };
    } else {
      throw new NotFoundException(AlbumErrors.NOT_FOUND);
    }

    return db.albums[condidateIndex];
  }

  async deleteRef(id: string): Promise<void> {
    db.albums.map((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }

  async deleteAlbum(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(AlbumErrors.INVALID_ID);
    }

    const condidateIndex = db.albums.findIndex((album) => album.id === id);

    if (condidateIndex !== -1) {
      db.albums.splice(condidateIndex, 1);
      this.trackService.deleteRef(id, 'albumId');
      this.favoritesService.deleteRef(id, 'albums');
    } else {
      throw new NotFoundException(AlbumErrors.NOT_FOUND);
    }
  }
}
