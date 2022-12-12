<template>
  <form 
    class="redirect-button" 
    :action="action" method="POST" 
    style="height:100%;"
  >
    <input
      type="text"
      name="prices"
      v-model="internalPrices"
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
    prices: {
      type: Array,
      default: () => []
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
  height:100%;

  input {
    display:none;
  }

  .redirect-button-submit {
    display:flex;
    justify-content: center;
    align-items: center;
    background-color:transparent;
    color:white;
    height:100%;
    width:100%;
    border:none;
    transition: transform 0.3s;
    transform: scale(1);

    &:hover {
      transform: scale(1.5);
    }

  }
}
</style>