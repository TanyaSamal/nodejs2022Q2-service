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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
  ) {}

  // async createArtist(createDto: CreateArtistDto): Promise<IArtist> {
  //   if (!createDto.name || !createDto.grammy) {
  //     throw new BadRequestException(ArtistErrors.INCORRECT_BODY);
  //   }

  //   const newArtist: IArtist = {
  //     id: uuidv4(),
  //     ...createDto,
  //   };

  //   db.artists.push(newArtist);

  //   return newArtist;
  // }

  // checkArtist(id): IArtist {
  //   return db.artists.find((artist) => artist.id === id);
  // }

  // async getArtistById(id: string): Promise<IArtist> {
  //   if (!validateUuid(id)) {
  //     throw new BadRequestException(ArtistErrors.INVALID_ID);
  //   }

  //   const condidate = this.checkArtist(id);

  //   if (!condidate) {
  //     throw new NotFoundException(ArtistErrors.NOT_FOUND);
  //   }

  //   return condidate;
  // }

  // async getAllArtists(): Promise<IArtist[]> {
  //   return db.artists;
  // }

  // async updateArtist(dto: UpdateArtistDto, id: string): Promise<IArtist> {
  //   if (typeof dto.grammy !== 'boolean' || typeof dto.name !== 'string') {
  //     throw new BadRequestException(ArtistErrors.INCORRECT_BODY);
  //   }

  //   if (!validateUuid(id)) {
  //     throw new BadRequestException(ArtistErrors.INVALID_ID);
  //   }

  //   const condidateIndex = db.artists.findIndex((artist) => artist.id === id);

  //   if (condidateIndex !== -1) {
  //     const oldData = db.artists[condidateIndex];
  //     db.artists[condidateIndex] = { ...oldData, ...dto };
  //   } else {
  //     throw new NotFoundException(ArtistErrors.NOT_FOUND);
  //   }

  //   return db.artists[condidateIndex];
  // }

  // async deleteArtist(id: string): Promise<void> {
  //   if (!validateUuid(id)) {
  //     throw new BadRequestException(ArtistErrors.INVALID_ID);
  //   }

  //   const condidateIndex = db.artists.findIndex((artist) => artist.id === id);

  //   if (condidateIndex !== -1) {
  //     db.artists.splice(condidateIndex, 1);
  //     this.trackService.deleteRef(id, 'artistId');
  //     this.albumService.deleteRef(id);
  //     this.favoritesService.deleteRef(id, 'artists');
  //   } else {
  //     throw new NotFoundException(ArtistErrors.NOT_FOUND);
  //   }
  // }

  async createArtist(createDto: CreateArtistDto): Promise<IArtist> {
    if (!createDto.name || !createDto.grammy) {
      throw new BadRequestException(ArtistErrors.INCORRECT_BODY);
    }

    const newArtist: IArtist = {
      id: uuidv4(),
      ...createDto,
    };

    const createdArtist = this.artistRepository.create(newArtist);

    return await this.artistRepository.save(createdArtist);
  }

  async getArtistById(artistId: string): Promise<IArtist> {
    if (!validateUuid(artistId)) {
      throw new BadRequestException(ArtistErrors.INVALID_ID);
    }

    const condidate = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    if (!condidate) {
      throw new NotFoundException(ArtistErrors.NOT_FOUND);
    }

    return condidate;
  }

  async getAllArtists(): Promise<IArtist[]> {
    return await this.artistRepository.find();
  }

  async updateArtist(dto: UpdateArtistDto, artistId: string): Promise<IArtist> {
    if (typeof dto.grammy !== 'boolean' || typeof dto.name !== 'string') {
      throw new BadRequestException(ArtistErrors.INCORRECT_BODY);
    }

    if (!validateUuid(artistId)) {
      throw new BadRequestException(ArtistErrors.INVALID_ID);
    }

    const condidate = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    if (condidate) {
      await this.artistRepository.update(
        { id: artistId },
        { ...condidate, ...dto },
      );
      return await this.getArtistById(artistId);
    } else {
      throw new NotFoundException(ArtistErrors.NOT_FOUND);
    }
  }

  async deleteArtist(artistId: string): Promise<void> {
    if (!validateUuid(artistId)) {
      throw new BadRequestException(ArtistErrors.INVALID_ID);
    }

    const condidate = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    if (condidate) {
      await this.artistRepository.delete(artistId);
      // this.trackService.deleteRef(artistId, 'artistId');
      // this.albumService.deleteRef(artistId);
      // this.favoritesService.deleteRef(artistId, 'artists');
    } else {
      throw new NotFoundException(ArtistErrors.NOT_FOUND);
    }
  }
}
