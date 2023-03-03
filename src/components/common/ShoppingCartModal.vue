<template>
  <div
    ref="modal"
    :class="{show: showCartModal}"
    class="shopping-cart-modal flex flex-column"
    :style="{
      left: `${cartModalOffsetX - clientWidth}px`,
      top:  `${cartModalOffsetY}px`
    }"
  >
    <div 
      v-for="samplePack in items"
      :key="samplePack.id"
      class="flex"
    >
      <span class="flex-1">{{ samplePack.name }}</span>
      <span class="flex-1 text-align-right">{{ `${samplePack.costFormatted}` }}</span>
    </div>

    <div class="flex-1">&nbsp;</div>

    <form-redirect-button
      v-if="authenticated"
      :action="samplePurchaseUri"
      :idToken="idToken"
      :payload="JSON.stringify([...priceIds])"
    >
      <template v-slot:content>
        <button
          type="button"
          class="vp-button"
        >
          Checkout
        </button>
      </template>
    </form-redirect-button>

    <!-- <button
      type="button"
      class="vp-button"
    >
      Checkout
    </button> -->
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex';
import config from '@/config';
import FormRedirectButton from '@/components/form/FormRedirectButton.vue';
import {slugs, getUriForSlug} from '@/slugs';

const {VITE_CART_MODAL_TIMEOUT} = config;

const cartModalTimeout =  parseInt(VITE_CART_MODAL_TIMEOUT) || 5000;

export default {
  name: 'ShoppingCartModal',
  components:{
    FormRedirectButton
  },
  data: () => ({
    clientWidth: 0,
    timeoutId: 0,
    isMouseOver: false,
    samplePurchaseUri: getUriForSlug(slugs.SamplePackPurchase)
  }),
  computed:{
    ...mapState('cart',['items', 'showCartModal', 'cartModalOffsetX', 'cartModalOffsetY']),
    ...mapGetters('cart',['priceIds']),
    ...mapState('user', ['idToken', 'authenticated']),
  },
  watch:{
    showCartModal(newShowCartModal) {
      this.clearTimeout();
      if(newShowCartModal) {
        this.clientWidth = this.$refs.modal.clientWidth;
        this.timeoutId = this.getTimeout();
      }
    }
  },
  
  mounted() {
    this.clientWidth = this.$refs.modal.clientWidth;
    this.$refs.modal.addEventListener('mouseenter', this.onMouseEntered);
    this.$refs.modal.addEventListener('mouseleave', this.onMouseLeave);
  },

  beforeDestroy(){
    this.clearTimeout(this.timeoutId); 
    this.$refs.modal.removeEventListener('mouseenter', this.onMouseEntered);
    this.$refs.modal.removeEventListener('mouseleave', this.onMouseLeave);
  },
  methods: {
    getTimeout(){
      return setTimeout(
        () => {
          if(this.isMouseOver) {
            this.timeoutId = this.getTimeout();
          } else {
            this.$store.dispatch('cart/showCartModal', { show: false });
            this.timeoutId = 0;
          }
        }, 
        cartModalTimeout
      );
    },
    onMouseEntered() {
      if(this.showCartModal) {
        this.isMouseOver = true;
      }
    },
    onMouseLeave() {
      this.isMouseOver = false;
    },
    clearTimeout() {
      if(this.timeoutId != 0){
        clearTimeout(this.timeoutId);
      }
    }
  }
}
</script>

<style lang="scss">
// TODO: Move to scss
.shopping-cart-modal {
  font-size: 0.9rem;
  padding: 1rem;
  height:15rem;
  width: 15rem;
  background-color: var(--primary-background-color);
  position: absolute;
  z-index:-1;
  opacity: 0;
  transition: opacity 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
  border-radius: 1rem;

  -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);

  &.show {
    z-index:2;
    opacity: 1;
  }
}
</style>