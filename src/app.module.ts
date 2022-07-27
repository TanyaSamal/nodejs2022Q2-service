import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './modules/album/album.module';
import { ArtistModule } from './modules/artist/artist.module';
import { AuthModule } from './modules/auth/auth.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { TrackModule } from './modules/track/track.module';
import { UserModule } from './modules/user/user.module';
import { typeOrmConfig } from './typeorm.config';
import { LoggingMiddlware } from './utils/logging.middlware';

@Module({
  imports: [
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddlware).forRoutes('*');
  }
}
