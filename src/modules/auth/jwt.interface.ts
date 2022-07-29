export interface JwtPayload {
  login: string,
  userId: string,
}

export interface JWTResponce {
  accessToken: string,
  refreshToken: string,
}
