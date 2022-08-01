<template>
  <form-input-base class="form-input">
    <template
      v-slot:title
    >
      {{ title }}
    </template>

    <template
      v-slot:input
      style="height:initial;"
    >
      <input
        v-model="internalValue"
        class="form-input-body"
        @focus="onShowPlaceholder(false)"
        @blur="onShowPlaceholder(true)"
      >
      <div
        class="search-input-icon-underlay toggle-show"
        :class="{ hide: !showPlaceholder }"
      >
        <form-icon
          icon-size="1.25em"
          icon="fa-solid fa-magnifying-glass"
        >
          <template v-slot:post-content>
            <div>&nbsp;Search</div>
          </template>
        </form-icon>
      </div>
    </template>
  </form-input-base>
</template>

<script>
import FormInputBase from './FormInputBase.vue';
import FormIcon from './FormIcon.vue';

export default {
  name:'FormInput',
  components:{FormInputBase,FormIcon},
  props:{
    title: {
      type: String,
      default: '',
    },
    initialValue:{
      type: String,
      default: ''
    }
  },
  data: () => ({
    internalValue:'This is some text',
    internalShowPlaceholder: true,
  }),
  computed: {
    showPlaceholder(){
      return this.internalShowPlaceholder && this.internalValue.length === 0;
    }
  },
  mounted(){
    this.internalValue = this.initialValue;
  },
  methods: {
    onShowPlaceholder(internalShowPlaceholder) {
      this.internalShowPlaceholder = internalShowPlaceholder;
    }
  }
}
</script>

<style lang="scss">

.toggle-show {
  opacity: 0.5;
  transition: opacity 0.5s;
  &.hide {
    opacity:0;
  }
}

.search-input-icon-underlay {
  font-family: 'VCR_OSD_MONO';
  position:absolute;
  top:0;
  left:1em;
  bottom:0;
  right:0;
  display:flex;
  align-items: center;
  
  z-index: -1;
}

.form-input {
  width:100%;
  display:flex;
}

.form-input-body {
  border:none;
  width:100%;
  color:rgb(96, 239, 48);
  z-index:2;
  flex:1;
  background-color:transparent;
  font-size: 2em;
  min-width: 0;
  font-family: 'VCR_OSD_MONO';
  transition: all 0.5s;

  &:focus {
    // border:solid white;
  }

  &::selection {
    background: rgb(96, 239, 48);
    color:black;
  }
}

</style>