<template>
  <div
    class="sample-detail-container flex"
    :class="{isCollapsed}"
  >
    <div 
      class="sample-detail-image-card"
    >
      <div
        class="play-sample-button"
      >
        <div
          class="circle"
          @click="onPlaySample"
        >
          <form-icon
            class="flex align-center play-icon" 
            icon="fas fa-play"
          />
        </div>
      </div>
      <form-image
        :url="`${sample.imgUrl}`"
      />
    </div>

    <div class="sample-details">
      <form-card class="fred">
        <template v-slot:content>
          <div class="sample-card-body">
            <div class="sample-card-classification">
              <div class="sample-card-seller">
                {{ sample.seller }}
              </div>
              <div 
                v-for="{id,name} in sample.categories"
                :key="id"
                class="ml1"
              >
                {{ name }}
              </div>
            </div>

            <div class="sample-card-description-container">
              <div
                class="sample-card-description"
              >
                {{ sample.description }}
                <div ref="audio-player" />
              </div>
            </div>

            <div class="sample-card-tag-container">
              <span
                v-for="{id, name} in sample.tags"
                :key="id"
                class="sample-card-tag"
              >#{{ name }}</span>
            </div>
          </div>

          <div class="ml1 justify-space-between cost-container">
            <form-icon
              icon-size="1em"
              class="vp-icon flex justify-center align-center"
              icon="fa-solid fa-gem"
              color="rgb(96, 239, 48)"
            >
              <template v-slot:pre-content>
                <span style="padding-right:0.5em;">3</span>
              </template>
            </form-icon>

            <form-icon
              icon-size="2.5em"
              class="vp-icon flex justify-end align-end download-icon"
              icon="fa-solid fa-file-arrow-down"
            />
          </div>
        </template>
      </form-card>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import FormCard from '@/components/form/FormCard.vue';
import FormImage from '@/components/form/FormImage.vue';
import FormIcon from '@/components/form/FormIcon.vue';
import { SORT_TYPES, makeNewSample } from '@/store/modules/sample';
import { axios, secureGet } from '@/axios.js';

export default {
  name:'SampleDetail',
  components:{
    FormCard,
    FormImage,
    FormIcon
  },
  data: () => ({
    isClipLoaded: false
  }),
  props: {
    sample: {
      type: Object,
      default: makeNewSample(),
    }
  },
  computed:{
    ...mapState('sample', ['sortType']),
    ...mapState('user', ['publicStorageToken']),
    isCollapsed() {
      return this.sortType == SORT_TYPES.GROUP;
    }
  },
  methods:{
    onHandleImageClicked() {
      this.isCollapsed = !this.isCollapsed;
    },
    async onPlaySample(){
      if(!this.isClipLoaded){
        try{
          const {sample:{clipUri: uri}, publicStorageToken:token} = this;
          const result = await secureGetBlob(axios, {uri, token});
          const data = result.data;
          const blob = new Blob([data], { type: "audio/wav" });
          const blobUrl = URL.createObjectURL(blob);

          const clip = document.createElement('audio');
          clip.id = 'audio-player';
          clip.controls = 'controls';
          clip.src = blobUrl;
          clip.type = 'audio/mpeg';
          this.$refs['audio-player'].appendChild(clip);
          this.isClipLoaded = true;
        }catch(e){
          // consume
        }
        
      }
    }
  } 
}
</script>
<style lang="scss">
.download-icon {
  transform: scale(1);
  transition: transform 0.1s ease-in-out;

  &:hover{
    transform: scale(1.2);
  }
}

.play-icon {
  font-size: 1.5em;
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-left: 0.1em;
}

.play-sample-button {
  opacity:0.33;
  transition: opacity 0.2s ease-in-out;
  &:hover{
    opacity: 1;
  }
  position:absolute;
  width:100%;
  top:0;
  bottom:0;
  left:0;
  right:0;
  display:flex;
  align-items: center;
  justify-content: center;
}

.play-sample-icon {
  z-index:1000;
  border: solid 2px white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sample-detail-container {
  transition: all 1s ease-in-out;
  .sample-detail-image-card {
    position:relative;
    padding: 0.5em 0.5em;
    cursor:pointer;
    transform: scale(1);
    transition: all 0.1s;
    &:hover {
      transform: scale(1.2);
    }
  }

  .sample-details {
    transition: width 0.33s;
    width: 100%;
    display:flex;
    padding: 0.5em;
  }

  .form-image{
    min-height:10em;
    min-width:10em;
    transition: min-width 0.33s,
    min-height 0.33s;
  }

  &.isCollapsed {
  
    .sample-details {
      width: 0;
    }

    .sample-detail-image-card {
      .form-image {
        min-height:10em;
        min-width:10em;
      }
    }
  }
}

.sample-card-classification {
  height: 2em;
  display: flex;
  justify-content: space-between;
  width: 100%;
  
}

.sample-card-seller {
  font-weight: bold;
}

.sample-card-description-container {
  flex:1;
  display: flex;
  align-items: flex-start;
  font-size: 1.25em;
  width: 100%;
}

.sample-card-description {
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  color: #ffffffad;
  max-height: 3em;
  word-break: break-all;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.sample-card-tag-container {
  height: 2em;
  display: flex;
  align-items: flex-end;
  color: rgb(117, 117, 117);

  .sample-card-tag:not(:first-child) {
    padding-left: 1em;
  }

  .sample-card-tag {
    font-size: .65em;
  }
}

.sample-card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  overflow-x: hidden;
}

.cost-container {
  display: flex;
  flex-direction: column;
}
</style>