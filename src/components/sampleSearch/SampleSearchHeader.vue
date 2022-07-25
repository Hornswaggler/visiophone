<template>
  <div class="sample-search-header">
    <div class="flex-1">
&nbsp;
    </div>
    <div class="search-input-container">
      <input
        v-model="input"
        class="vp-search-input"
        @focus="show = false"
        @blur="show = true"
      >
      <div
        class="search-input-icon-underlay toggle-show"
        :class="{ hide: !showIcon }"
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
    </div>

    <div class="user-button">
      <div
        class="circle user-icon"
        :style="{backgroundImage: 'url(\'' + require('@/assets/FB_IMG_1566951363267.jpg') + '\')'}"
        @click="onUserMenuClicked"
      />
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import FormIcon from '../form/FormIcon.vue';
import FormInput from '../form/FormInput.vue';

export default {
  name:'SampleSearchHeader',
  components:{
    FormIcon,
  },
  data: () => ({
    menuItems: {
      logout:{
        displayName: 'Log Out',
        handler: async ({$store, $router}) => {
          await $store.dispatch('app/hideOverlay');
          await $store.dispatch('dropdown/hideDropdown', {showLoading: false, opacity: '0'});
          if (await $store.dispatch('user/logout')) {
            $router.push('landingPage');
          }
        }
      }
    },
    show: true,
    showDropdown: false,
    input:'',
    lastClientX: 0,
    lastClientY: 0,
    inputWidth: '10em'
  }),
  computed:{
    ...mapState('user', ['msal']),
    showIcon(){
      return this.show && this.input.length === 0;
    }
  },
  async mounted(){
    // TODO: refactor this nonsense into the part and make it more elegant... :|
    //Initialize the menu
    await this.onUserMenuClicked({clientX: 0, clientY: 0});
    await this.onFormDropdownChanged(true);
    await this.$store.dispatch('app/hideOverlay');
  },
  methods: {
    async onUserMenuClicked(e) {
      const {clientX = 0, clientY = 0} = e;
      const {menuItems} = this;
      await this.$store.dispatch('dropdown/showDropdown', {
        clientX: `calc(${clientX}px - ${this.inputWidth})`,
        clientY: `${clientY}px`,
        menuItems,
        onChanged: this.onFormDropdownChanged
      });
      this.$nextTick(() => {
        this.$store.commit('dropdown/setItemWidth', this.inputWidth);
      });

      this.$store.dispatch('app/showOverlay', {showLoading: false, opacity: '0.9'});
    },
    async onFormDropdownChanged(value) {
      await this.$store.dispatch('dropdown/hideDropdown', {showLoading: false, opacity: '0'});
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
  height:100%;
  display:flex;
  justify-content: flex-end;
  align-items: center;
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
  border:solid grey;
  border-radius: 4px;
  font-size: 2em;
  min-width: 0;
  font-family: 'VCR_OSD_MONO';
  padding: 0 0.2em;
  transition: all 0.5s;

  &:focus {
    border:solid white;
    border-radius: 6px;
  }

  &::selection {
    background: rgb(96, 239, 48);
    color:black;
  }
}

</style>