import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsOptional()
  artistId: string | null;
}
