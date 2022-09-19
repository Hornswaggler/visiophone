<template>
  <!-- <div
    class="side-navigation-container"
  >
    <SiteLogo />
    <div class="user-name-container">
      {{ userName }}
    </div>

    <div
      v-for="option in menuOptions" 
      :key="option.id"
      class="navigation-button"
      :class="{selected: selectedMenuOption == option._id}"
      @click="() => onMenuItemSelected(option._id)"
    >
      {{ option.name }}
    </div>
  </div> -->
  <div class="side-navigation-menu">
    <div class="logo-container pt1">
      <div class="animated-text">
        VISIOPHONE
      </div>
    </div>
    <div
      v-for="option in menuOptions"
      :key="option._id"
      class="side-naviagation-option"
      :class="{ selected: selectedMenuOption === option._id }"
      @click="onMenuItemSelected(option)"
    >
      <font-awesome-icon 
        class="form-icon"
        style="font-size:0.5em;height:2em;"
        :icon="option.icon"
      />
      <div>{{ option.name }}</div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import SiteLogo from './SiteLogo.vue';

//TODO organize this...
const DEFAULT_ROUTE = {name: 'Browse', slug:'/sample', icon:'fa-gear', _id: '0'};

export default {
  name:'SideNavigation',
  components:{
    SiteLogo
  },
  data: () => ({
    selectedMenuOption: '0',

    menuOptions: [
      DEFAULT_ROUTE,
      {name: 'Upload', slug:'/sample/upload', icon:'fa-gear', _id: '1'},
      // {name: 'Random'},
      // {name: 'Free'},
      // {name: 'Presets'},
      // {name: 'Library'}
    ]
  }),
  computed:{
    ...mapGetters('user',['userName'])
  },
  mounted() {
    this.$router.beforeEach(({fullPath}, from, next) => {
      try {
        this.$nextTick(() => {
          this.selectedMenuOption = `${this.menuOptions.findIndex(({slug}) => slug === fullPath) || 0}`;
        });
      } finally {
        next();
      }
    });
  },
  methods:{
    onMenuItemSelected({_id,slug}){
      // console.log(option);
      console.log(_id, slug);
      if(this.selectedMenuOption !== _id) {
        this.selectedMenuOption = _id;
        this.$router.push(slug);
      }
    }
  }
}
</script>
<style lang="scss">

.logo-container {
  display:flex;
  justify-content: center;
  width:100%;

  .animated-text {
    font-size: 1.2em;
    background: linear-gradient(180deg, #2cd8d5 0%, #9fafd3 50%, #5a2288 100%);
    animation: animated_text 10s ease infinite;
    background-size: 300%;

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Inter;
    font-weight: 800;
    letter-spacing: 0.2em;

  }
}

@keyframes animated_text {
	0% { background-position: 0px 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0px 50%; }
}

.side-navigation-menu {
  box-shadow: 0px 4em 4em rgba(100,100,100,0.4);

  height:100%;
  width:13em;
  display:flex;
  align-items: flex-end;
  flex-direction: column;

  .side-naviagation-option {
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    max-height:2em;
    min-height:2em;
    width:75%;
    display: flex;
    justify-content: space-evenly;
    margin-top: 1em;
    transition: all 0.18s linear;
    cursor:pointer;

    &:not(.selected){
      &:hover{
        background-color: white;
        color: black;
      }
    }

    &.selected{
      background: linear-gradient(to  top, rgba(75, 75, 75, 0.503), rgba(196, 196, 196, 0.756));
    }
  }
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

.user-name-container {
  height: 6.5em;
  color: #65FE00;
  display: flex;
  align-items: center;
  justify-content: center;
}


.side-navigation-container {
  max-width: 8em;
  width:100%;
  background-color: rgba(33, 35, 35, 0.9);
  margin: 0 1em;
  color: rgb(161, 161, 162);
  display:flex;
  flex-direction: column;
  border-radius: 10px;
}
</style>