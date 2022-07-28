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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrack } from './track.interface';
import { TrackService } from './track.service';

@Controller('track')
@UseGuards(AuthGuard('jwt'))
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ITrack> {
    return this.trackService.getTrackById(id);
  }

  @Get()
  async getAll(): Promise<ITrack[]> {
    return this.trackService.getAllTracks();
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createTrackDto: CreateTrackDto): Promise<ITrack> {
    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTrackDto,
  ): Promise<ITrack> {
    return this.trackService.updateTrack(updateDto, id);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.trackService.deleteTrack(id);
  }
}
