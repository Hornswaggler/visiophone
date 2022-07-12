<template>
<div class="sample-card flex fill">
  <form-image
    :url="'CaptAhab.jpg'"
  ></form-image>

  <form-card>
    <template v-slot:content>
      <form-icon
        class="flex align-center pl1 pr1" 
        icon="fas fa-play"
      ></form-icon>

      <div class="sample-card-body">
        <div class='sample-card-classification'>
          <div class="sample-card-seller">{{sample.seller}}</div>
          <div 
            v-for="{id,name} in sample.categories"
            :key="id"
            class="ml1"
          >{{name}}</div>
        </div>
        <div class="sample-card-description-container">
          <div 
            class="sample-card-description"
          >{{sample.description}}</div>
        </div>
        <div class="sample-card-tag-container">
          <span
            v-for="{id, name} in sample.tags"
            :key="id"
            class="sample-card-tag"
          >#{{name}}</span>
        </div>
      </div>

      <div class="ml1 justify-space-between cost-container">
        <form-icon
          iconSize="1em"
          class="cost-icon flex justify-center align-center"
          icon="fa-solid fa-gem"
        >
          <template v-slot:content>
            <span style="padding-right:0.5em;">3</span>
          </template>
        </form-icon>

        <form-icon
          iconSize="1em"
          class="flex justify-end align-end pb1"
          style="height:2em;"
          icon="fa-solid fa-file-arrow-down"
        ></form-icon>
      </div>
    </template>
  </form-card>


</div>
</template>

<script>
import FormCard from '@/components/form/FormCard.vue';
import FormImage from '@/components/form/FormImage.vue';
import FormIcon from '@/components/form/FormIcon.vue';

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
      default: () => ({}),
    }
  }           
}
</script>

<style lang="scss">

.sample-card {
  color:white;
  padding: 0.5em 1em;

  .sample-card-body {
    display:flex;
    flex-direction: column;
    align-items:flex-start;
    width:100%;
    overflow-x: hidden;

    .sample-card-classification {
      height:2em;
      display:flex;
      justify-content: space-between;
      width:100%;
      align-items: center;
    }

    .sample-card-seller {
      font-weight:bold;
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
      max-height: 2em;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
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
        font-size:.65em;
      }
    }
  }   

  .cost-container {
    display: flex;
    flex-direction: column;
    padding: 0 1em;
  }

  .cost-icon {
    height:2em;
    color:rgb(96, 239, 48);
  }
}
</style>