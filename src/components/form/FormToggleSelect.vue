<template>
  <div class="toggle-select">
    <div 
      v-for="option in internalOptions"
      :key="option.key"
      class="toggle-select-option"
      :class="{selected: internalIndex === option.key}"
      @click="selectOption(option.key)"
    >
      {{ option.value }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormToggleSelect',
  props:{
    options:{
      type: Array,
      default: () => []
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    onChanged:{
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    internalOptions:[],
    internalIndex: 0
  }),
  mounted(){
    this.internalOptions = this.options.map((value, key) => ({value, key}));
  },
  methods:{
    selectOption(index){
      this.internalIndex = index;
      this.onChanged(this.internalOptions[index].value);
    }
  }
}
</script>
