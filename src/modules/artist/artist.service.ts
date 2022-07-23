import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IArtist, ArtistErrors } from './artist.interface';
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

  async getCondidate(condidateId: string): Promise<IArtist> {
    return await this.artistRepository.findOne({
      where: { id: condidateId },
    });
  }

  async getArtistById(artistId: string): Promise<IArtist> {
    if (!validateUuid(artistId)) {
      throw new BadRequestException(ArtistErrors.INVALID_ID);
    }

    const condidate = await this.getCondidate(artistId);

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

    const condidate = await this.getCondidate(artistId);

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

    const condidate = await this.getCondidate(artistId);

    if (condidate) {
      await this.artistRepository.delete(artistId);
      await this.updateRelatedTrack(artistId);
      await this.updateRelatedAlbum(artistId);
      // this.favoritesService.deleteRef(artistId, 'artists');
    } else {
      throw new NotFoundException(ArtistErrors.NOT_FOUND);
    }
  }

  async updateRelatedTrack(artistId: string) {
    const tracks = await this.trackService.getAllTracks();
    const updatedTrack = tracks.find((track) => track.artistId === artistId);
    if (updatedTrack) {
      updatedTrack.artistId = null;
      this.trackService.updateTrack(updatedTrack, updatedTrack.id);
    }
  }

  async updateRelatedAlbum(artistId: string) {
    const albums = await this.albumService.getAllAlbums();
    const updatedAlbum = albums.find((album) => album.artistId === artistId);
    if (updatedAlbum) {
      updatedAlbum.artistId = null;
      this.albumService.updateAlbum(updatedAlbum, updatedAlbum.id);
    }
  }
}
