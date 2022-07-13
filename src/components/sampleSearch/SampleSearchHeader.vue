<template>
  <div class="sample-search-header">
    <div class="flex-1">&nbsp;</div>
    <div class="search-input-container">
      <input
        class="vp-search-input"
        @focus="show = false"
        @blur="show = true"
        v-model="input"
      />
      <div 
        class="search-input-icon-underlay toggle-show"
        :class="{hide: !showIcon}"
      >
        <form-icon
          iconSize="1.25em"
          icon="fa-solid fa-magnifying-glass">
        </form-icon>
      </div>
    </div>
    <div class="user-button">
      <div class="circle user-icon"
        :style="{backgroundImage: 'url(\'' + require('@/assets/FB_IMG_1566951363267.jpg') + '\')'}"
      ></div>
    </div>

  </div>
</template>

<script>
import FormIcon from '../form/FormIcon.vue';

export default {
  name:'SampleSearchHeader',
  components:{
    FormIcon
  },
  data: () => ({
    show: true,
    input:'',
  }),
  computed:{
    showIcon(){
      return this.show && this.input.length === 0;
    }
  }
}
</script>

<style lang="scss">
.user-icon {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.user-button {
  flex:1;
  height:100%;
  display:flex;
  justify-content: flex-end;
  align-items: center;
}

.search-input-icon-underlay{
  position:absolute;
  height:100%;
  width:100%;
  display:flex;
  align-items: center;
  margin-left:1em;
}

.search-input-container {
  position:relative;
  height:2.5em;
  width:50%;
  display:flex;
}

.vp-search-input {
  color:rgb(96, 239, 48);
  z-index:2;
  flex:1;
  background-color:transparent;
  border-right:solid grey;
  border-bottom: solid grey;
  font-size: 2em;
  min-width: 0;
  font-family: 'VCR_OSD_MONO';
  &::selection {
    background: rgb(96, 239, 48);
    color:black;
  }
}

.toggle-show {
  opacity: 0.5;
  transition: opacity 0.5s;
  &.hide {
    opacity:0;
  }
}
</style>