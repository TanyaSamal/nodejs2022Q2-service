import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ArtistEntity } from '../../artist/entities/artist.entity';
import { AlbumEntity } from '../../album/entities/album.entity';
import { TrackEntity } from '../../track/entities/track.entity';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @ManyToMany(() => ArtistEntity, { cascade: true })
  @JoinTable()
  artists: ArtistEntity[];

  @ManyToMany(() => AlbumEntity, { cascade: true })
  @JoinTable()
  albums: AlbumEntity[];

  @ManyToMany(() => TrackEntity, { cascade: true })
  @JoinTable()
  tracks: TrackEntity[];
}
