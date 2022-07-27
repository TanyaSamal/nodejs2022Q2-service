import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @Length(8)
  @IsNotEmpty()
  password: string;
}
