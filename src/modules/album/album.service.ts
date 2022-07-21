import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { validateUuid } from 'src/utils';
import { AlbumErrors, IAlbum } from './album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}

  async createAlbum(createDto: CreateAlbumDto): Promise<IAlbum> {
    const newAlbum: IAlbum = {
      id: uuidv4(),
      ...createDto,
    };

    const createdAlbum = this.albumRepository.create(newAlbum);

    return await this.albumRepository.save(createdAlbum);
  }

  async getAlbumById(albumId: string): Promise<IAlbum> {
    if (!validateUuid(albumId)) {
      throw new BadRequestException(AlbumErrors.INVALID_ID);
    }

    const condidate = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    if (!condidate) {
      throw new NotFoundException(AlbumErrors.NOT_FOUND);
    }

    return condidate;
  }

  async getAllAlbums(): Promise<IAlbum[]> {
    return await this.albumRepository.find();
  }

  async updateAlbum(dto: UpdateAlbumDto, albumId: string): Promise<IAlbum> {
    if (typeof dto.year !== 'number' || typeof dto.name !== 'string') {
      throw new BadRequestException(AlbumErrors.INCORRECT_BODY);
    }

    if (!validateUuid(albumId)) {
      throw new BadRequestException(AlbumErrors.INVALID_ID);
    }

    const condidate = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    if (condidate) {
      await this.albumRepository.update(
        { id: albumId },
        { ...condidate, ...dto },
      );
      return await this.getAlbumById(albumId);
    } else {
      throw new NotFoundException(AlbumErrors.NOT_FOUND);
    }
  }

  async deleteAlbum(albumId: string): Promise<void> {
    if (!validateUuid(albumId)) {
      throw new BadRequestException(AlbumErrors.INVALID_ID);
    }

    const condidate = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    if (condidate) {
      await this.albumRepository.delete(albumId);
      // this.trackService.deleteRef(id, 'albumId');
      // this.favoritesService.deleteRef(id, 'albums');
    } else {
      throw new NotFoundException(AlbumErrors.NOT_FOUND);
    }
  }
}
