import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IArtist, ArtistErrors } from './artist.interface';
import { db } from '../../data/db';
import { CreateArtistDto } from './dto/create-artist.dto';
import { validateUuid } from 'src/utils';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
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

  async getArtistById(id: string): Promise<IArtist> {
    if (!validateUuid(id)) {
      throw new BadRequestException(ArtistErrors.INVALID_ID);
    }

    const condidate = db.artists.find((artist) => artist.id === id);

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
    } else {
      throw new NotFoundException(ArtistErrors.NOT_FOUND);
    }
  }
}
