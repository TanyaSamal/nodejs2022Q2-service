import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../data/db';
import { validateUuid } from 'src/utils';
import { ITrack, TrackErrors } from './track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  async createTrack(createDto: CreateTrackDto): Promise<ITrack> {
    const newTrack: ITrack = {
      id: uuidv4(),
      ...createDto,
    };

    db.tracks.push(newTrack);

    return newTrack;
  }

  async getTrackById(id: string): Promise<ITrack> {
    if (!validateUuid(id)) {
      throw new BadRequestException(TrackErrors.INVALID_ID);
    }

    const condidate = db.tracks.find((track) => track.id === id);

    if (!condidate) {
      throw new NotFoundException(TrackErrors.NOT_FOUND);
    }

    return condidate;
  }

  async getAllTracks(): Promise<ITrack[]> {
    return db.tracks;
  }

  async updateTrack(dto: UpdateTrackDto, id: string): Promise<ITrack> {
    if (typeof dto.duration !== 'number' || typeof dto.name !== 'string') {
      throw new BadRequestException(TrackErrors.INCORRECT_BODY);
    }

    if (!validateUuid(id)) {
      throw new BadRequestException(TrackErrors.INVALID_ID);
    }

    const condidateIndex = db.tracks.findIndex((track) => track.id === id);

    if (condidateIndex !== -1) {
      const oldData = db.tracks[condidateIndex];
      db.tracks[condidateIndex] = { ...oldData, ...dto };
    } else {
      throw new NotFoundException(TrackErrors.NOT_FOUND);
    }

    return db.tracks[condidateIndex];
  }

  async deleteTrack(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(TrackErrors.INVALID_ID);
    }

    const condidateIndex = db.tracks.findIndex((track) => track.id === id);

    if (condidateIndex !== -1) {
      db.tracks.splice(condidateIndex, 1);
    } else {
      throw new NotFoundException(TrackErrors.NOT_FOUND);
    }
  }
}
