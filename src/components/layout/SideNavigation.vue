<template>
  <div
    class="side-navigation-container"
  >
    <!-- TODO: Logo Path Should be configurable -->
    <div
      class="site-logo"
      :style="{backgroundImage: 'url(\'' + require('@/assets/glitchy.gif') + '\')'}"
    />
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
  </div>
</template>
<script>
import {mapGetters} from 'vuex';

//TODO organize this...
const DEFAULT_ROUTE = {name: 'Browse', slug:'/sample'};

export default {
  name:'SideNavigation',
  data: () => ({
    selectedMenuOption: 0,
    menuOptions: [
      DEFAULT_ROUTE,
      {name: 'Upload', slug:'/sample/upload'},
      // {name: 'Random'},
      // {name: 'Free'},
      // {name: 'Presets'},
      // {name: 'Library'}
    ].map((o,i) => ({slug: '/sample/search', ...o,_id: i}))
  }),
  computed:{
    ...mapGetters('user',['userName'])
  },
  mounted() {
    this.$router.beforeEach(({fullPath}, from, next) => {
      try {
        this.$nextTick(() => {
          this.selectedMenuOption = this.menuOptions.findIndex(({slug}) => slug === fullPath) || 0;
        });
      } finally {
        next();
      }
    });
  },
  methods:{
    onMenuItemSelected(id){
      if(this.selectedMenuOption !== id) {
        this.selectedMenuOption = id;
        this.$router.push(this.menuOptions[id].slug);
      }
    }
  }
}
</script>
<style lang="scss">

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
.site-logo {
  background-size: cover;
  width: 100%;
  height: 5.5em;
  background-repeat: no-repeat;
  aspect-ratio: 16/9;
  background-position: center;
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