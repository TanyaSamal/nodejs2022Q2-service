import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  artistId: string | null;

  albumId: string | null;
}
