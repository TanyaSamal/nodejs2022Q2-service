import { Module } from '@nestjs/common';
import { AlbumModule } from './modules/album/album.module';
import { ArtistModule } from './modules/artist/artist.module';
import { TrackModule } from './modules/track/track.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, ArtistModule, TrackModule, AlbumModule],
})
export class AppModule {}
