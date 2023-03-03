export const AUTH = 'auth';
export const SAMPLE_UPLOAD = 'upload';
export const USER_SETTINGS = 'settings';
export const USER_LIBRARY = 'library';

export const SAMPLE_PACK = 'sample-pack';
export const SAMPLE_PACK_TABLE_ROOT = `${SAMPLE_PACK}/:mode`;
export const SAMPLE_PACK_TABLE_EXPLORE = `${SAMPLE_PACK}/explore`;
export const SAMPLE_PACK_TABLE_SEARCH = `${SAMPLE_PACK}/search`;

export const SAMPLE_PACK_DETAILS = `${SAMPLE_PACK}/details`;
export const SAMPLE_PACK_DETAILS_ROOT = `${SAMPLE_PACK_DETAILS}/:id`;

export const DEFAULT_ROUTE = SAMPLE_PACK_TABLE_EXPLORE;

export default {
  AUTH,
  SAMPLE_PACK,
  SAMPLE_PACK_TABLE_ROOT,
  SAMPLE_PACK_TABLE_EXPLORE,
  SAMPLE_PACK_TABLE_SEARCH,
  SAMPLE_PACK_DETAILS_ROOT,
  SAMPLE_PACK_DETAILS,
  SAMPLE_UPLOAD,
  USER_SETTINGS,
  USER_LIBRARY,
  DEFAULT_ROUTE,
};