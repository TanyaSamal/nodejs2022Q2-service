import { forwardRef, Module } from '@nestjs/common';
import { TrackModule } from '../track/track.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [forwardRef(() => TrackModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
