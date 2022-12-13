<template>
  <form 
    class="redirect-button" 
    :action="action"
    method="POST" 
  >
    <input
      v-if="payload !== ''"
      type="text"
      name="payload"
      v-model="payload"
    >
    <input 
      type="text"
      name="idToken"
      id="idToken"
      v-model="internalIdToken"
    >
    <button 
      type="submit"
      class="redirect-button-submit"
    >
      <slot name="content" />
    </button>
  </form>
</template>
<script>
export default {
  name:'RedirectButton',
  data: () => ({
    internalIdToken:"",
    internalPrices: ""
  }),
  props: {
    action: {
      type: String,
      default: ""
    },
    idToken: {
      type: String,
      default: ""
    },
    payload: {
      type: String,
      default: ""
    }
  },
  mounted() {
    this.internalIdToken = this.idToken;
    this.internalPrices = JSON.stringify(this.prices);
  }
}
</script>

<style lang="scss">
.redirect-button {
  input {
    display:none;
  }

  .redirect-button-submit {
    display:flex;
    justify-content: center;
    align-items: center;
    background-color:transparent;
    color:white;
    width:100%;
    border:none;
    transition: transform 0.3s;
    transform: scale(1);

    &:hover {
      // transform: scale(1.5);
    }

  }
}
</style>