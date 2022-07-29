import { Controller, Get, Post, HttpCode, Param, Delete } from '@nestjs/common';
import { FavoritesRepsonse } from './favorites.interface';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAll(): Promise<FavoritesRepsonse> {
    return this.favoritesService.getAllFavs();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addFavTrack(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addTrackToFavs(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  async addFavAlbum(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addAlbumToFavs(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addFavArtist(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addArtistToFavs(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteFavTrack(@Param('id') id: string): Promise<void> {
    return this.favoritesService.deleteTrackFromFavs(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteFavAlbum(@Param('id') id: string): Promise<void> {
    return this.favoritesService.deleteAlbumFromFavs(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteFavArtist(@Param('id') id: string): Promise<void> {
    return this.favoritesService.deleteArtistFromFavs(id);
  }
}
