<template>
  <FormInput>
    <template v-slot:title>
      {{ title }}
    </template>
    <template v-slot:input>
      <select v-model="internalValue" class="vp-select">
        <option v-for="tagType in tagTypes" :key="tagType._id">
          {{ tagType.name }}
        </option>
      </select>
    </template>
  </FormInput>
</template>
<script>
import FormInput from "@/components/form/FormInput";

const TAG_TYPES = [{ name: "InfluencerCore" }].map((type, i) => ({
  ...type,
  _id: i,
}));

export default {
  name: "FormSelect",
  components: { FormInput },
  data: () => ({
    tagTypes: TAG_TYPES,
    internalValue: "",
  }),
  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    changeHandler: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    internalValue(val) {
      this.changeHandler(val);
    },
  },
  mounted() {
    this.internalValue = this.tagTypes
      .map(({ name }) => name)
      .find((name) => name === this.value);
  },
};
</script>
<style lang="scss">
.vp-select {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  width: 100%;
  font-size: 1.25em;
  background-color: #333333;
  border: solid 1px white;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: transparent;
  }
}
</style>
