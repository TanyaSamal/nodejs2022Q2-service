import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { validateUuid } from 'src/utils';
import { ITrack, TrackErrors } from './track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoritesService } from '../favorites/favorites.service';
import { TrackEntity } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
  ) {}

  async createTrack(createDto: CreateTrackDto): Promise<ITrack> {
    const newTrack: ITrack = {
      id: uuidv4(),
      ...createDto,
    };

    const createdTrack = this.trackRepository.create(newTrack);

    return await this.trackRepository.save(createdTrack);
  }

  async getCondidate(condidateId: string): Promise<ITrack> {
    return await this.trackRepository.findOne({
      where: { id: condidateId },
    });
  }

  async getTrackById(trackId: string): Promise<ITrack> {
    if (!validateUuid(trackId)) {
      throw new BadRequestException(TrackErrors.INVALID_ID);
    }

    const condidate = await this.getCondidate(trackId);

    if (!condidate) {
      throw new NotFoundException(TrackErrors.NOT_FOUND);
    }

    return condidate;
  }

  async getAllTracks(): Promise<ITrack[]> {
    return await this.trackRepository.find();
  }

  async updateTrack(dto: UpdateTrackDto, trackId: string): Promise<ITrack> {
    if (typeof dto.duration !== 'number' || typeof dto.name !== 'string') {
      throw new BadRequestException(TrackErrors.INCORRECT_BODY);
    }

    if (!validateUuid(trackId)) {
      throw new BadRequestException(TrackErrors.INVALID_ID);
    }

    const condidate = await this.getCondidate(trackId);

    if (condidate) {
      await this.trackRepository.update(
        { id: trackId },
        { ...condidate, ...dto },
      );
      return await this.getTrackById(trackId);
    } else {
      throw new NotFoundException(TrackErrors.NOT_FOUND);
    }
  }

  async deleteTrack(trackId: string): Promise<void> {
    if (!validateUuid(trackId)) {
      throw new BadRequestException(TrackErrors.INVALID_ID);
    }

    const condidate = await this.getCondidate(trackId);

    if (condidate) {
      await this.trackRepository.delete(trackId);
    } else {
      throw new NotFoundException(TrackErrors.NOT_FOUND);
    }
  }
}
