import moment from 'moment';
import config from '/src/config';
const {VITE_COVER_ART_URI} = config;

const DEFAULT_SAMPLE_PACK = {
  id: null,
  name:'',
  description: '',
  imgUrl:'',
  cost: '10.00',
  samples: {}
};

export const SORT_TYPES = {
  LIST: 'LIST',
  GROUP: 'GROUP'
};

export const getSamplePackCost = samplePack => {
  if(samplePack == null || samplePack.samples == null) {
    return '';
  }

  if(samplePack.cost !== 0) {
    return samplePack.cost;
  }

  const total = samplePack.samples.reduce((acc,sample) => {
    acc += sample.cost;
    return acc;
  }, 0);

  return total;
};

export const makeNewSamplePack = () => ({...DEFAULT_SAMPLE_PACK});

export const formatCost = cost => {
  return `$ ${(cost / 100).toFixed(2)}`;
};

export const makeSamplePackFromResult = ({samplePack, isNew = false}) => {
  const samples = [...(samplePack.samples || [])].map(sample => ({
    ...{
      ...sample,
      imgUrl: samplePack.imgUrl
    },
    clipUri: `${config.VITE_CLIP_URI}${sample.id}.mp3`,
    imgUrl: `${VITE_COVER_ART_URI}${samplePack.id}.png`,
  }));

  const cost = getSamplePackCost(samplePack);

  const newResult = {
    ...makeNewSamplePack(),
    ...samplePack,
    samples,
    imgUrl: `${VITE_COVER_ART_URI}${samplePack.id}.png`,
    lastRefresh: moment().valueOf(),
    cost,
    costFormatted: formatCost(cost)
  };

  const newSamplePack = {
    ...makeNewSamplePack({
      ...samplePack,
      samples
    }),
    imgUrl: `${VITE_COVER_ART_URI}${samplePack.id}.png`,
    lastRefresh: moment().valueOf(),
    cost,
    costFormatted: formatCost()
  };

  return newResult;
};

export default {
  SORT_TYPES,
  formatCost,
  makeNewSamplePack,
  makeSamplePackFromResult,
}