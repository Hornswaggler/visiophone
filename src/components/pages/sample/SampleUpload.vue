<template>
  <scrolling-container>
    <template v-slot:scrolling-content>
      <div class="vp-form-row flex justify-space-between">
        <form-toggle-select
          :options="options"
          :on-changed="option => isSamplePack = option === 'Pack'"
        >
        </form-toggle-select>
        <div
          class="flex"
        >
          <div
            @click="canCollapseAll && onCollapseExpandAll(true)"
            :style="{opacity: !canCollapseAll ? 0.2 : 1}"
            class="vp-button"
          >
            <font-awesome-icon
              icon="fa-solid fa-window-minimize"
              style="height:1.25em;width: 1.25em;"
            />
          </div>
          <div
            @click="canExpandAll && onCollapseExpandAll(false)"
            :style="{opacity: !canExpandAll ? 0.2 : 1}"
            class="vp-button"
            style="margin-left: 0.5em;"
          >
            <font-awesome-icon
              icon="fas fa-maximize"
              style="height:1.25em;width:1.25em;"
            />
          </div>
        </div>

      </div>
      <div class="sample-upload">
        <div class="form-base pt05 flex-1"
          :style="{ backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` }"
        >
          <div class="add-sample-panel">
            <div class="form-column" style="padding-left:0;">
              <div class="vp-form-row">
                <form-input
                  fieldName="name"
                  :value="samplePack.name"
                  title="sample pack name"
                  :on-changed="name => samplePack.name = name"
                >
                </form-input>
              </div>
              <div class="vp-form-row">
                <form-input
                  fieldName="description"
                  :value="samplePack.description"
                  title="sample pack description"
                  :on-changed="description => samplePack.description = description"
                >
                </form-input>
              </div>
            </div>
            <div class="form-column" style="padding-right:0;">
              <div class="vp-form-row user-settings-image-container">
                <form-image-editor
                  class="flex-3"
                  :img-src="imageSrc"
                  :change-handler="onThumbnailGenerated"
                />
              </div>
            </div>
          </div>


          <collapsible-panel
            v-for="(sample, key) in samplePack.sampleData"
            :collapsed="samplePanelState[key]"
            :key="key"
            :on-changed="value => onPanelChanged({key, value})"
          >
            <template v-slot:header>
              <div class="flex" style="justify-content:space-between;">
                <button
                  class="vp-button sm delete-button"
                  type="button"
                  @click="deleteSample(key)"
                >
                  -
                </button>
              </div>
            </template>
            <template v-slot:content>
              <div class="form-column">
                <div class="vp-form-row">
                  <form-input
                    :fieldName="`sampleData.${key}.name`"
                    :value="sample.name"
                    title="name"
                    :on-changed="name => sample.name = name">
                  </form-input>
                </div>

                <div class="vp-form-row mt0">
                  <form-input 
                    :fieldName="`sampleData.${key}.key`"
                    :value="sample.key" 
                    title="key"
                    :on-changed="key => sample.key = key">
                  </form-input>
                </div>

                <div class="vp-form-row">
                  <text-area-input
                    title="description"
                    :value="sample.description"
                    :fieldName="`sampleData.${key}.description`"
                    :on-changed="description => sample.description = description" />
                </div>
              </div>

              <div class="form-column">
                <div class="vp-form-row">
                  <form-upload-file title="audio file"
                    :fieldName="`sampleData.${key}.clipUri`" 
                    :value="sample.clipUri"
                    :accept="AUDIO_MIME_TYPE" 
                    button-text="Upload" 
                    :change-handler="file => onSamplechanged(file, sample)" />
                </div>

                <div class="vp-form-row">
                  <form-select 
                    title="tag"
                    :fieldName="`sampleData.${key}.tag`"
                    :options="tags" 
                    :value="sample.tag"
                    :on-changed="tag => sample.tag = tag" 
                  />
                </div>

                <div 
                  class="vp-form-row flex-column flex">
                  <form-number-input 
                    title="cost" 
                    :fieldName="`sampleData.${key}.cost`" 
                    :value="sample.cost"
                    :onChanged="cost => sample.cost = cost" />
                </div>

                <div class="vp-form-row">
                  <form-number-input title="bpm" :fieldName="`sampleData.${key}.bpm`" :value="sample.bpm"
                    :change-handler="bpm => sample.bpm = bpm" />
                </div>

              </div>

            </template>
          </collapsible-panel>
        </div>

      </div>
      <div class="vp-form-row flex justify-end pb1">

      </div>
      <div class="vp-form-row flex-1">
        <div class=" flex fill-height" style="justify-content:space-between">
          <div style="flex:1">&nbsp;</div>
          <div class="flex-1 flex justify-center align-end" style="flex:1">
            <button class="vp-button sm" type="button" @click="addSample">
              +
            </button>
          </div>
          <div class="flex-1 flex justify-end  align-end">
            <button ref="submitButton" class="vp-button" type="button" @click="handleSubmitForm">
              Upload
            </button>
          </div>
        </div>
      </div>

      <!-- TODO Implement this for something... -->
      <!-- <compact
        v-model="colors"
      ></compact> -->
    </template>
  </scrolling-container>

</template>
<script>
import Vue from 'vue';
import FormUploadFile from '@/components/form/FormUploadFile.vue';
import FormImageEditor from '@/components/form/FormImageEditor.vue';
import TextAreaInput from '@/components/form/TextAreaInput.vue';
import FormNumberInput from '@/components/form/FormNumberInput.vue';
import CollapsiblePanel from '../../form/CollapsiblePanel.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import { mapState } from 'vuex';
import FormSelect from '@/components/form/FormSelect.vue';
import { AUDIO_MIME_TYPE, IMAGE_MIME_TYPE } from '@/config';
import { makeNewSample } from '@/store/modules/sample';
import FormInput from '@/components/form/FormInput.vue';
import FormToggleSelect from '../../form/FormToggleSelect.vue';
import { Photoshop, Compact } from 'vue-color';
import { v4 as uuidv4 } from 'uuid';

const TAG_TYPES = [
  { name: 'InfluencerCore' },
  { name: 'jazz' },
  { name: 'rnb' },
  { name: 'smooth influencercore' }
].map((type, i) => ({ ...type, _id: i }));

export default {
  name: 'SampleUpload',

  components: {
    FormUploadFile,
    FormSelect,
    TextAreaInput,
    FormImageEditor,
    FormNumberInput,
    ScrollingContainer,
    FormInput,
    Photoshop,
    Compact,
    FormToggleSelect,
    CollapsiblePanel
  },

  data: () => ({
    sampleMetadata: makeNewSample(),
    samplePanelState: {},
    samplePack: {
      description: '',
      name: '',
      imgUrl: '',
      sampleData: {}
    },
    tags: [...TAG_TYPES],
    AUDIO_MIME_TYPE,
    IMAGE_MIME_TYPE,
    resampledBlob: {},
    imageSrc: '',
    imageBlob: {},
    sampleBlobs: {},
    description: '',
    colors: { r: 255, g: 0, b: 0 },
    isSamplePack: false,
    options: ['Single', 'Pack'],
  }),

  computed: {
    ...mapState('user', ['authenticated', 'customUserName']),
    ...mapState('sample', ['sampleForEdit']),
    rgba() {
      return this.colors.rgba || { r: 0, g: 0, b: 0, a: 0 };
    },

    samplePackArray() {
      const result = Object.keys(this.samplePack).map(key => {
        return { ...this.samplePack[key], key };
      });
      return result;
    },

    canCollapseAll() {
      const keys =  Object.keys(this.samplePanelState);
      for(let i = 0; i < keys.length; i++) {
        if(!this.samplePanelState[keys[i]]) {
          return true;
        }
      }
      return false;
    },

    canExpandAll() {
      const keys =  Object.keys(this.samplePanelState);
      for(let i = 0; i < keys.length; i++) {
        if(this.samplePanelState[keys[i]]) {
          return true;
        }
      }
      return false;
    }
  },

  async mounted() {
    this.addSample({scrollToElement: false});
    this.$store.dispatch('form/initialize', { formName: 'sample' });
  },

  beforeDestroy() {
    this.$store.dispatch('sample/persistToStorage', this.sampleMetadata);
  },

  methods: {
    onPanelChanged({key, value}){
      this.samplePanelState[key] = value;
    },

    onCollapseExpandAll(isCollapsed){
      const keys = Object.keys(this.samplePanelState);
      for(let i = 0; i < keys.length; i++) {
        this.samplePanelState[keys[i]] = isCollapsed;
      }
    },

    addSample({scrollToElement = false}) {
      const _tempId = uuidv4();
      Vue.set(this.samplePack.sampleData, _tempId, {
        _tempId,
        ...makeNewSample()
      });

      Vue.set(this.samplePanelState, _tempId, false);
      if(scrollToElement) {
        this.$nextTick(() => {
          this.$store.dispatch('app/scrollToElement', this.$refs.submitButton);
        });
      }
    },

    deleteSample(key) {
      Vue.delete(this.samplePack.sampleData, key)
    },

    // TODO: Move the image processing to the back end so it cannot be overridden
    onThumbnailGenerated({ file, clipUri }) {
      Vue.set(this, 'imageBlob', file);
      Vue.set(this.samplePack, 'imgUrl', clipUri);
    },

    onImageUpload({clipUri, file}) {
      Vue.set(this.sampleMetadata, 'fileName', file.name)
      Vue.set(this.imageBlob, file);
      this.imageSrc = clipUri;
    },

    onSamplechanged({ clipUri, file }, sample) {
      sample.clipUri = clipUri;
      Vue.set(sample, 'sampleBlob', file);
    },

    async handleSubmitForm() {
      if (await this.$store.dispatch('form/validateForm', { formData: this.samplePack })) {
        try {
          this.$store.commit('app/isLoading', true);

          const { samplePack, sampleBlobs, imageBlob, imageSrc } = this;

          await this.$store.dispatch('sample/uploadSample', {
            samplePack,
            sampleBlobs,
            imageBlob,
            imageSrc
          });

          // await this.$store.dispatch('sample/uploadSamplePack',{
          //   name: 'New Sample Pack',
          //   samples: [{
          //     sampleData: {...this.sampleMetadata},
          //     sample: this.sampleBlobs,
          //     image: this.imageBlob,
          //     imageSrc: this.imageSrc,
          //   }]
          // });

          Vue.set(this.sampleMetadata, makeNewSample());

          // this.$router.push('/search');
        } catch (e) {
          console.error(e);
        } finally {
          this.$store.commit('app/isLoading', false);
        }
      } else {
        this.onCollapseExpandAll(false);
        this.$store.dispatch('app/scrollToFirstError');
      }
    },
  }
}
</script>
<style lang="scss">
.delete-button {
  cursor: pointer;
  .show {
    cursor: initial;
  }
}
</style>
