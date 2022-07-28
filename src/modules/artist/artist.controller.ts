import {
  Controller,
  Get,
  Put,
  HttpCode,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IArtist } from './artist.interface';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
@UseGuards(AuthGuard('jwt'))
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<IArtist> {
    return this.artistService.getArtistById(id);
  }

  @Get()
  async getAll(): Promise<IArtist[]> {
    return this.artistService.getAllArtists();
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createArtistDto: CreateArtistDto): Promise<IArtist> {
    return this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateArtistDto,
  ): Promise<IArtist> {
    return this.artistService.updateArtist(updateDto, id);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.artistService.deleteArtist(id);
  }
}
