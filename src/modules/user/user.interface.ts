export interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export enum UserErrors {
  INCORRECT_BODY = 'Request body does not contain required fields',
  WRONG_OLD_PASSWORD = 'Old passoword is wrong',
  NOT_FOUND = 'User not found',
  INVALID_ID = 'User Id is invalid (not uuid)',
}
