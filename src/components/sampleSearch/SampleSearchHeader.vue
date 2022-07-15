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
        :class="{ hide: !showIcon }"
      >
        <form-icon
          iconSize="1.25em"
          icon="fa-solid fa-magnifying-glass">
          <template v-slot:post-content>
            <div>&nbsp;Search</div>
          </template>
        </form-icon>
      </div>
    </div>

    <div class="user-button">
      <div
        @click="onUserMenuClicked"
        class="circle user-icon"
        :style="{backgroundImage: 'url(\'' + require('@/assets/FB_IMG_1566951363267.jpg') + '\')'}"
      ></div>
    </div>

  </div>
</template>
<script>
import {mapState} from 'vuex';
import FormIcon from '../form/FormIcon.vue';

export default {
  name:'SampleSearchHeader',
  components:{
    FormIcon,
  },
  data: () => ({
    menuItems: {
      logout:{
        displayName: 'Log Out',
        handler: context => {
          // TODO Handler logic should be here, not in the drop down
          console.log(context, this);
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
    await this.onFormDropdownChanged({value:'YES PLEASE'});
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
    onFormDropdownChanged({value}) {
      return this.$store.dispatch('dropdown/hideDropdown', {showLoading: false, opacity: '0'});
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
  font-family: 'VCR_OSD_MONO';
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

.toggle-show {
  opacity: 0.5;
  transition: opacity 0.5s;
  &.hide {
    opacity:0;
  }
}
</style>