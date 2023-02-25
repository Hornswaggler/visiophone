<template>
<div class="sample-upload">
  <div class="sample-pack-header">
    <form-toggle-select
      :initial-index="initialIndex"
      :options="options"
      :on-changed="option => uploadTypeSelected(option)"
    >
    </form-toggle-select> 
  </div>
  <scrolling-container>
    <template v-slot:scrolling-content>
      <router-view/>
    </template>
  </scrolling-container>
</div>
</template>
<script>
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import FormToggleSelect from '../../form/FormToggleSelect.vue';

export default {
  name: 'SampleUpload',
  components: {
    ScrollingContainer,
    FormToggleSelect,
  },

  //TODO: Fix this...
  data: () => ({
    options: ['Pack',/*'Single'*/],
    selectedUploadType: 'Pack',
    initialIndex: 0
  }),

  async mounted() {
    const selectedIndex = this.options.indexOf(this.$route.name);
    this.initialIndex = selectedIndex;
    this.selectedUploadType = this.options[selectedIndex];
  },

  methods: {
    uploadTypeSelected(option){
      if(this.selectedUploadType !== option) {
        this.selectedUploadType = option;
        if(option ==='Single'){
          this.$router.push('single')
        } else {
          this.$router.push('pack');
        }
      }
    },
  }
}
</script>

