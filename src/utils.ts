import { validate, version } from 'uuid';

export const validateUuid = (uuid: string): boolean =>
  validate(uuid) && version(uuid) === 4;
