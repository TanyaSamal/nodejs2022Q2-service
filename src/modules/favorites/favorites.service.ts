import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateUuid } from 'src/utils/utils';
import { Repository } from 'typeorm';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { FavoritesEntity } from './entities/favorites.entity';
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
    @InjectRepository(FavoritesEntity)
    private readonly favRepository: Repository<FavoritesEntity>,
  ) {}

  async getFavsId(): Promise<string> {
    const allFavs = await this.favRepository.find();

    if (allFavs.length !== 0) {
      return allFavs[0].id;
    }

    const createdFavs = await this.favRepository.create({
      artists: [],
      albums: [],
      tracks: [],
    });

    return (await this.favRepository.save(createdFavs)).id;
  }

  async getAllFavs(): Promise<FavoritesRepsonse> {
    const favsId = await this.getFavsId();
    const allFavs = await this.favRepository.findOne({
      where: { id: favsId },
    });

    const tracks = [];
    for (const trackId of allFavs.tracks) {
      try {
        const currTrack = await this.trackService.getTrackById(trackId);
        tracks.push(currTrack);
      } catch {}
    }

    const albums = [];
    for (const albumId of allFavs.albums) {
      try {
        const currAlbum = await this.albumService.getAlbumById(albumId);
        albums.push(currAlbum);
      } catch {}
    }

    const artists = [];
    for (const artistId of allFavs.artists) {
      try {
        const curraArtist = await this.artistService.getArtistById(artistId);
        artists.push(curraArtist);
      } catch {}
    }

    return { artists, albums, tracks };
  }

  async addTrackToFavs(trackId: string) {
    if (!validateUuid(trackId)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.trackService.getCondidate(trackId);

    if (condidate) {
      const favsId = await this.getFavsId();
      const allFavs = await this.favRepository.findOne({
        where: { id: favsId },
      });

      allFavs.tracks.push(condidate.id);
      await this.favRepository.save(allFavs);
    } else {
      throw new UnprocessableEntityException(FavsErrors.UNPROCESSABLE_ID);
    }
  }

  async addAlbumToFavs(albumId: string): Promise<void> {
    if (!validateUuid(albumId)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.albumService.getCondidate(albumId);

    if (condidate) {
      const favsId = await this.getFavsId();
      const allFavs = await this.favRepository.findOne({
        where: { id: favsId },
      });
      allFavs.albums.push(condidate.id);
      await this.favRepository.save(allFavs);
    } else {
      throw new UnprocessableEntityException(FavsErrors.UNPROCESSABLE_ID);
    }
  }

  async addArtistToFavs(artistId: string): Promise<void> {
    if (!validateUuid(artistId)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.artistService.getCondidate(artistId);

    if (condidate) {
      const favsId = await this.getFavsId();
      const allFavs = await this.favRepository.findOne({
        where: { id: favsId },
      });
      allFavs.artists.push(condidate.id);
      await this.favRepository.save(allFavs);
    } else {
      throw new UnprocessableEntityException(FavsErrors.UNPROCESSABLE_ID);
    }
  }

  async deleteTrackFromFavs(trackId: string): Promise<void> {
    if (!validateUuid(trackId)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.trackService.getCondidate(trackId);

    if (condidate) {
      const favsId = await this.getFavsId();
      const allFavs = await this.favRepository.findOne({
        where: { id: favsId },
      });
      const trackIndex = allFavs.tracks.findIndex((id) => id === trackId);
      allFavs.tracks.splice(trackIndex, 1);
      await this.favRepository.save(allFavs);
    } else {
      throw new NotFoundException(FavsErrors.NOT_FOUND);
    }
  }

  async deleteAlbumFromFavs(albumId: string): Promise<void> {
    if (!validateUuid(albumId)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.albumService.getCondidate(albumId);

    if (condidate) {
      const favsId = await this.getFavsId();
      const allFavs = await this.favRepository.findOne({
        where: { id: favsId },
      });
      const albumIndex = allFavs.albums.findIndex((id) => id === albumId);
      allFavs.albums.splice(albumIndex, 1);
      await this.favRepository.save(allFavs);
    } else {
      throw new NotFoundException(FavsErrors.NOT_FOUND);
    }
  }

  async deleteArtistFromFavs(artistId: string): Promise<void> {
    if (!validateUuid(artistId)) {
      throw new BadRequestException(FavsErrors.INVALID_ID);
    }

    const condidate = await this.artistService.getCondidate(artistId);

    if (condidate) {
      const favsId = await this.getFavsId();
      const allFavs = await this.favRepository.findOne({
        where: { id: favsId },
      });
      const artistIndex = allFavs.artists.findIndex((id) => id === artistId);
      allFavs.artists.splice(artistIndex, 1);
      await this.favRepository.save(allFavs);
    } else {
      throw new NotFoundException(FavsErrors.NOT_FOUND);
    }
  }
}
