import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumEntity } from '../../album/entities/album.entity';
import { TrackEntity } from '../../track/entities/track.entity';
import { Exclude } from 'class-transformer';

@Entity('artist')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => AlbumEntity, (album) => album.artist, { cascade: true })
  @Exclude()
  albums: AlbumEntity[];

  @OneToMany(() => TrackEntity, (track) => track.artist, { cascade: true })
  @Exclude()
  tracks: TrackEntity[];
}
