<template>
  <div
    class="fill"
    style="color:#66FF00;"
  >
    <!-- {{ sampleData }} -->

    <div style="display:flex;">
      <div
        style="flex:1;"
        class="vp-form"
      >
        <div class="vp-form-row mt0">
          <upload-file
            :value="sampleData.imgUrl || ''"
            title="cover art"
            :accept="IMAGE_MIME_TYPE"
            button-text="Upload"
            :change-handler="onImageUpload"
          />
        </div>

        <div class="vp-form-row">
          <upload-file
            title="audio file"
            :accept="AUDIO_MIME_TYPE"
            button-text="Upload"
            class="flex-3"
            :change-handler="onSamplechanged"
          />
        </div>

        <div class="vp-form-row">
          <form-select
            title="tag"
            :options="tags"
            :value="sampleData.tag"
            class="flex-3"
          />
        </div>

        <div class="vp-form-row">
          <div class="vp-input-body">
            <form-number-input
              title="cost"
              :value="sampleData.cost"
              :change-handler="cost => sampleData.cost = cost"
            />
          </div>
        </div>

        <div class="vp-form-row">
          <text-area-input
            class="flex-3"
            title="description"
            :value="description"
            :on-changed="description => sampleData.description = description"
          />
        </div>
      </div>

      <div style="flex:1;">
        <div class="user-settings-image-container">
          <image-editor
            class="flex-3"
            :img-src="imageSrc"
            :change-handler="onThumbnailGenerated"
          />
        </div>
      </div>
    </div>
    <div class="vp-form-row pt2">
      <div class="flex-3 flex justify-end">
        <button
          class="vp-button ml1"
          type="button"
          @click="handleSubmitForm"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import UploadFile from '@/components/form/UploadFile.vue';
import ImageEditor from '@/components/form/ImageEditor.vue';
import TextAreaInput from '@/components/form/TextAreaInput';
import FormNumberInput from '@/components/form/FormNumberInput.vue';
import { mapState, mapGetters } from 'vuex';
import FormSelect from '@/components/form/FormSelect.vue';
import { AUDIO_MIME_TYPE, IMAGE_MIME_TYPE } from '@/config';
import { makeNewSample } from '@/store/modules/sample'

const TAG_TYPES = [
  { name: 'InfluencerCore'},
  { name: 'jazz' },
  { name: 'rnb' },
  { name: 'smooth influencercore' }
].map((type, i) => ({...type, _id: i }));

export default {
  name: 'SampleUpload',
  data: () => ({
    sampleData: makeNewSample(),
    tags: [...TAG_TYPES],
    AUDIO_MIME_TYPE,
    IMAGE_MIME_TYPE,
    resampledBlob: {},
    imageSrc: '',
    imageBlob:{},
    sampleBlob:{},
    description:''
  }),
  computed: {
    ...mapGetters('user',['idToken']),
    ...mapState('user',['authenticated','shelfCapacity']),
    ...mapState('sample', ['sampleForEdit']),
  },
  components: {
    UploadFile,
    FormSelect,
    TextAreaInput,
    ImageEditor,
    FormNumberInput
  },
  mounted() {
    Vue.set(this.sampleData, this.sampleForEdit);
    this.description = this.sampleData.description;
    this.$store.commit('app/setSideNavigationIndex', 1);
  },
  beforeDestroy(){
    this.$store.dispatch('sample/persistToStorage', this.sampleData);
  },
  methods: {
    onThumbnailGenerated(file) {
      Vue.set(this, 'imageBlob', file);
      Vue.set(this.sampleData, 'imgUrl', URL.createObjectURL(file));
    },
    onImageUpload(file){
      Vue.set(this.sampleData, 'fileName',file.name)
      Vue.set(this.imageBlob, file);
      this.imageSrc =  URL.createObjectURL(file);
    },
    onSamplechanged(file) {
      Vue.set(this, 'sampleBlob', file);
      Vue.set(this.sampleData, 'clipUri', URL.createObjectURL(file));
    },
    async handleSubmitForm() {
      try {
        this.$store.commit('app/isLoading', true);
        await this.$store.dispatch('sample/uploadSample', {
          sampleData: this.sampleData,
          token: this.idToken,
          sample: this.sampleBlob,
          image: this.imageBlob,
          imageSrc: this.imageSrc
        });

        Vue.set(this.sampleData, makeNewSample());

        this.$router.push('/sample');
      } catch (e) {
        console.error(e);
      } finally {
        this.$store.commit('app/isLoading', false);
      }
    },
  }
}
</script>
<style lang="scss">

</style>