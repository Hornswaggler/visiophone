<template>
  <form-input-base
    :title="title"
    :value="internalValue"
    :blurred="blurred"
    :fieldName="fieldName"
  >
    <template
      v-slot:title
    >
      {{ title }}
    </template>

    <!-- TODO: Inline Style -->
    <template
      v-slot:input
    >
      <input
        v-model="internalValue"
        v-debounce="onChangeHandler"
        class="form-input-body"
        @focus="onShowPlaceholder(false)"
        @blur="onBlur"
      >
      <div
        class="form-input-icon-underlay toggle-show"
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
    fieldName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '',
    },
    initialValue: {
      type: String,
      default: ''
    },
    onChanged: {
      type: Function,
      default: () => {}
    },
    preview: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    internalValue:'',
    internalShowPlaceholder: true,
    blurred: false
  }),
  computed: {
    showPlaceholder(){
      return this.internalShowPlaceholder && this.internalValue.length === 0;
    },
  },
  mounted(){
    this.internalValue = this.initialValue;
  },
  methods: {
    onShowPlaceholder(internalShowPlaceholder) {
      this.internalShowPlaceholder = internalShowPlaceholder;
    },
    onChangeHandler(value){
      this.onChanged(value);
    },
    onBlur() {
      this.onShowPlaceholder(true);
      this.blurred = !this.blurred
    }
  }
}
</script>