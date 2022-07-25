<template>
  <CenteredResponsiveLayoutVue>
    <template v-slot:content>
      <div class="sample-search-container mt1 mb1">
        <div class="sample-search-input">
          <div class="sample-search-input-content">
            <form-input />
          
            <div
              class="fill flex justify-end pr1"
            >
              <bootleg-list-sort-icon />

              <!-- todo merge these / use the component from the lib -->
              <div
                class="sort-icon"
              >
                <font-awesome-icon icon="fas fa-square-plus" />
              </div>

              <div
                class="user-button"
              >
                <div
                  class="circle user-icon"
                  :style="{backgroundImage: `url('${userIcon}')` }"
                  @click="onUserMenuClicked"
                />
              </div>
            </div>
          </div>
          <div
            class="sample-search-input-background"
          />
        </div>
        <scrolling-container style="border-radius:6px;">
          <router-view />
          <!-- <template v-slot:scrolling-content>
            <sample-card
              v-for="sample in samples" 
              :key="sample.id"
              :sample="sample"
            />
          </template> -->
        </scrolling-container>
      </div>
    </template>
  </CenteredResponsiveLayoutVue>
</template>
<script>
import {mapGetters, mapState} from 'vuex';
import ScrollingContainer from '../layout/ScrollingContainer.vue';
import CenteredResponsiveLayoutVue from '../layout/CenteredResponsiveLayout.vue';
import SampleCard from './SampleCard.vue';
import FormInput from '../form/FormInput.vue';
import BootlegListSortIcon from './BootlegListSortIcon.vue';

export default {
  name: 'SampleSearch',
  components: { 
    ScrollingContainer,
    CenteredResponsiveLayoutVue,
    SampleCard,
    FormInput,
    BootlegListSortIcon,
    BootlegListSortIcon
  },
  data: () => ({
    samples: [],
    inputWidth: '10em',
    menuItems: {
      logout:{
        displayName: 'Log Out',
        handler: async ({$store, $router}) => {
          await $store.dispatch('app/hideOverlay');
          await $store.dispatch(
            'dropdown/hideDropdown',
            {
              showLoading: false, 
              opacity: '0'
            }
          );
          if (await $store.dispatch('user/logout')) {
            $router.push('landingPage');
          }
        }
      },
    } 
  }),
  computed:{
    ...mapGetters('user',['userName']),
    ...mapState('user', ['userIcon']),
    ...mapState('dropdown', ['show', 'itemWidth', 'clientX', 'clientY', 'onChanged']),
  },
  async mounted(){
    this.samples = await this.$store.dispatch('sample/getAll');
  },
  methods: {
    async onUserMenuClicked(e) {
      const {clientX = 0, clientY = 0} = e;

      await this.$store.dispatch('dropdown/showDropdown', {
        clientX: `calc(${clientX}px - ${this.inputWidth})`,
        clientY: `${clientY}px`,
        menuItems: this.menuItems,
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
$nodeStreak: #a2cef4;
$computationalFogTop: #6084d7;
$computationalFogBot: #6084d7;
$visualDistortionZapper: 360px;
$nanoVelocity: 2s;

.sample-search-action-panel {
  padding:1em;
}

.sample-search-input-background {
  position:absolute;
  top: 0;
  bottom:0;
  left:0;
  right:0;
  background-color:rgb(33, 35, 35);
  z-index:-2
}

.sample-search-input-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.sample-search-input {
  margin: 1em 0;
  position: relative;
  height:3em;
  width:calc(100% - 12px - 1em);
  border-radius:6px;
  margin-right:1em;
  border:solid 2px grey;

  .form-input {
    border:none;
    position:relative;
  }
}
            
.user-icon {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.sample-search-action-container{
  display:flex;
  justify-content: flex-end;
}

.form-input-container {
  display:flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  padding: 0 1em;
}

// .sample-search-input {
//   position: relative;
//   height:3em;
//   width:calc(100% - 12px - 1em);
//   border-radius:6px;
//   margin-right:1em;
//   border:solid 2px grey;
// }

.sort-icon {
  padding-right:0.5em;
  font-size:1.5em;
  justify-content: center;
  align-content: center;
  display:flex;
  flex-direction: column;
  cursor:pointer;
  transform: scale(1);
  transition: transform 0.25s ease, color 0.25s ease;
  color:darkgray;

  &:hover{
    transform: scale(1.2);
    color:white;
  }
}

.sample-search-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.sample-search-header {
  height:5.5em;
  display:flex;
  justify-content: center;
  align-items:center;
  padding: 1em;
}

.navigation-button {
  margin:0.5em 1em;
  background-color:transparent;
  cursor:pointer;
  transition: all 0.5s ease-in-out;
  border-radius: 10px;

  &:hover {
    background-color:white;
    color:black;
    scale: 1.25;
  }

  &.selected {
    background-color:rgb(17, 17, 17);
  }
}
</style>