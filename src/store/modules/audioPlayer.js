import Vue from 'vue';

export default {
  namespaced: true,
  state: () => ({
    queue: [],
    queuePosition: 0,
    playWhenReady: false
  }),
  getters:{
    nowPlaying({queue, queuePosition}){
      if(!queue[queuePosition]) return {};
      return queue[queuePosition];
    },
  },
  actions:{
    addSamplesToQueue({commit}, samples){
      commit('addSamplesToQueue', samples);
    },
    async playSample({commit, state:{queue}}, {id}){
      const index = queue.findIndex(sample => sample.id === id);
      commit('playWhenReady', true);
      commit('queuePosition', index);
    },
    playNext({state:{queuePosition, queue}, commit}){
      if(queuePosition < queue.length - 1){
        commit('queuePosition', queuePosition + 1);
      }
    },
    playPrev({state:{queuePosition, queue}, commit}){
      if(queuePosition > 0){
        commit('queuePosition', queuePosition - 1);
      }
    }
  },
  mutations:{
    addSamplesToQueue(state, samples) {
      Vue.set(state, 'queue', [
        ...state.queue,
        ...samples
      ]);
    },
    queuePosition(state, queuePosition) {
      state.queuePosition = queuePosition;
    },
    playWhenReady(state, playWhenReady) {
      state.playWhenReady = playWhenReady;
    }
  }
}