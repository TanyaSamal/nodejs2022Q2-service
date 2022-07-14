import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @Length(8)
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @Length(8)
  @IsNotEmpty()
  newPassword: string;
}
