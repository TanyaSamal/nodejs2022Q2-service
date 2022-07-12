import { Module } from '@nestjs/common';
import { ArtistModule } from './modules/artist/artist.module';
import { TrackModule } from './modules/track/track.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, ArtistModule, TrackModule],
})
export class AppModule {}
