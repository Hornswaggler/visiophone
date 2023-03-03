import moment from 'moment';
import config from '/src/config.js';

const DEFAULT_SAMPLE = {
  id: null,
  name:'',
  sampleFile: {},
  tag: '',
  description: '',
  seller: '',
  bpm: '120.0',
  cost: "100",
  clipUri:'',
  fileName:'',
  key: ''
};

export const makeNewSample = (
  {
    id,
    name = '',
    tag = '',
    description = '',
    seller = '',
    bpm = '120.0',
    cost = "",
    clipUri = '',
    sampleFile = {},
    fileName = '',
    key = ''
  } = DEFAULT_SAMPLE) => (
  {
    id,
    name,
    tag,
    description,
    seller,
    bpm,
    cost,
    clipUri,
    sampleFile,
    fileName,
    key
});

export const makeSampleFromResult = ({sample, isNew = false}) => {
  const newSample = {
    ...makeNewSample({...sample}),
    ...sample,
    lastRefresh: moment().valueOf(),
  };

  let clipUri = newSample.clipUri || '';
  if(newSample.id && !isNew) {
    clipUri = `${config.VITE_CLIP_URI}${newSample.id}.wav.ogg`;
  }

  return {
    ...newSample,
    imgUrl,
    clipUri
  };
};

export const SORT_TYPES = {
  LIST: 'LIST',
  GROUP: 'GROUP'
};

export default {
  SORT_TYPES,
  makeNewSample,
  makeSampleFromResult
}