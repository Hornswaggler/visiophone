import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { makeNewSamplePack } from "@/models/samplePackFactory";
import { makeNewSample } from "@/models/sampleFactory";

export default {
  namespaced: true,
  state: () => ({
    initialized: false,
    samplePackForEdit:  {...makeNewSamplePack()},
    imagePreviewBlob: {},
    imageFile: {}
  }),
  actions: {
    initialize({dispatch, commit, state:{initialized}}){
      if(!initialized) {
        dispatch('addSample');
        commit('initialized', true);
      }
    },

    addSample({commit, state:{samplePackForEdit}}) {
      const _tempId = uuidv4();

      commit('samplePack',{
        ...samplePackForEdit,
        samples: {
          ...samplePackForEdit.samples,
          [_tempId]: {
            _tempId,
            ...makeNewSample()
          }
        }
      });

      return _tempId;
    },

    deleteSample({state:{samplePackForEdit}, commit}, {tempId}){
      const samples = {
        ...samplePackForEdit.samples
      };
      delete samples[tempId];

      const result = {
        ...samplePackForEdit,
        samples:{...samples}
      };

      commit('samplePack', result);
      console.log('DELETED',result);
    }, 

    setSamplePackImage({commit, state:{samplePackForEdit }}, {imageFile, imgUrl, imagePreviewBlob }){
      commit('imagePreviewBlob', imagePreviewBlob);
      commit('imageFile', imageFile);
      commit('samplePack', {
        ...samplePackForEdit,
        samples: {
          ...samplePackForEdit.samples
        },
        imgUrl
      });
    },

    updateSamplePackProperty({state:{samplePackForEdit}, commit}, {key, value}){
      commit('samplePack', {
        ...samplePackForEdit,
        samples: {
          ...samplePackForEdit.samples,
        },
        [key]: value
      });
    },

    updateSampleProperty({state:{samplePackForEdit}, commit}, {key, value, sample:{_tempId}}) {
      commit('samplePack', {
        ...samplePackForEdit,
        samples: {
          ...samplePackForEdit.samples,
          [_tempId]: {
            ...samplePackForEdit.samples[_tempId],
            [key]: value
          }
        }
      });
    }
  },

  mutations: {
    initialized(state, initialized) {
      state.initialized = initialized;
    },

    imagePreviewBlob(state, imagePreviewBlob){
      Vue.set(state, 'imagePreviewBlob', imagePreviewBlob);
    },

    imageFile(state, imageFile){
      Vue.set(state, 'imageFile', imageFile);
    },
    samplePack(state, samplePack){
      Vue.set(state, 'samplePackForEdit', samplePack);
    }
  }
}