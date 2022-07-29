export enum AuthErrors {
  INCORRECT_BODY = 'Request body does not contain required fields',
  NO_REFRESH_TOKEN = 'No refreshToken in body',
  INVALID_CREDENTIALS = 'Incorrect login credentials',
  UNAUTHORIZED = 'Unauthorized: invalid authentication credentials',
  REFRESH_EXPIRED = 'Refresh token expired',
  REFRESH_MALFORMED = 'Refresh token malformed',
}
