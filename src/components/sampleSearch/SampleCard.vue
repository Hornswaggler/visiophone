<template>
  <div class="sample-card flex fill">
    <form-image
      :url="`${sample.imgUrl}`"
    />

    <form-card>
      <template v-slot:content>
        <form-icon
          class="flex align-center pl1 pr1" 
          icon="fas fa-play"
        />

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
            icon-size="1em"
            class="vp-icon flex justify-end align-end pb1"
            icon="fa-solid fa-file-arrow-down"
          />
        </div>
      </template>
    </form-card>
  </div>
</template>

<script>
import FormCard from '@/components/form/FormCard.vue';
import FormImage from '@/components/form/FormImage.vue';
import FormIcon from '@/components/form/FormIcon.vue';
import { makeNewSample } from '../../store/modules/sample';

export default {
  name:'SampleCard',
  components:{
    FormCard,
    FormImage,
    FormIcon
  },
  props: {
    sample: {
      type: Object,
      default: makeNewSample,
    }
  }           
}
</script>

<style lang="scss">

.sample-card-classification {
  height: 2em;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.sample-card-seller {
  font-weight: bold;
}

.sample-card-description-container {
  max-height: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  font-size: 1.25em;
  width: 100%;
}

.sample-card-description {
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  color: #ffffffad;
  font-size: 0.75em;
  max-height: 3em;
  word-break: break-all
}

.sample-card-tag-container {
  height: 2em;
  display: flex;
  align-items: center;
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

.sample-card {
  color: white;
  padding: 0.5em 0;
}

.cost-container {
  display: flex;
  flex-direction: column;
  padding: 0 1em;
}

.vp-icon {
  height: 2em;
}

</style>