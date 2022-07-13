<template>
  <div style="height:100%;width:100%;display:flex;background-color:grey;">
    <div style="flex:1;background-color:black;margin:2em;display:flex;flex-direction:column;justify-content:flex-end;padding:1em;">

      <div  style="flex:1;text-align:left;">
      
        <div>Hello {{userName}}</div>

        <div class="choices" v-if="authenticated">
          <span 
            class="button"
            @click="navTradeSamples"
          >&nbsp;&lt;&quot;Trade Samples&quot;&gt;</span><br/>
          <span class="button">&nbsp;&lt;&quot;Buy Tokens&quot;&gt;</span><br/>
          <span class="button">&nbsp;&lt;&quot;Sell Tokens&quot;&gt;</span><br/>
          <span @click="onLogout" class="button">&nbsp;&lt;&quot;Logout&quot;&gt;</span><br/>
        </div>

        <div class="choices" v-else>
          <span class="button" @click="onLogin">&nbsp;&lt;&quot;Login&quot;&gt;</span><br/>
          <span>&nbsp;&lt;&quot;Sign Up&quot;&gt;</span><br/>
        </div>

        <br/>
      </div>

      <div style="height:25px;width:100%;display:flex;">
        <img 
          style="height:25px;width:25px;"
          :src="require(`@/assets/visiolad_walking_with_torch.gif`)
        "/>
        <input 
          v-model="consoleInput"
          class="consoleInput"
          type="text"
          style="color: #66FF00;border-top:solid 1px #66FF00;background-color:black;border:0;margin-left:0.25em;"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex';

export default {
  name: 'VisioConsole',

  computed: {
    ...mapState('user',['authenticated', 'msal']),
    ...mapGetters('user',['userName', 'accessToken', 'idToken'])
  },
  data:()=>({
    consoleInput:'>'
  }),
  methods:{
    async onLogin() {
      try{
        this.$store.commit('app/isLoading', true);
        const valid = await this.$store.dispatch('user/login');
        if(valid) {
          this.error = '';
          this.$store.commit('user/authenticated', true);
          this.$router.push('/sample-search');
        } else{
          this.error = 'Supplied credentials were incorrect.';
        }
      } catch(e) {
        console.error('Login failed', e);
      } finally {
        this.$store.commit('app/isLoading', false);
      }
    },
    async onLogout(){
      await this.$store.dispatch('user/logout');
      this.$store.commit('user/authenticated', false);

    },
    navTradeSamples () {
      this.$router.push('/upload');
    }
  }
}
</script>
<style lang="scss">
.consoleInput{
  font-size:2em;
  font-family: "VCR_OSD_MONO";
  &:focus{
    outline: none;
  }
}
.choices{
  span{
    cursor:pointer;
    &:hover{
      color: rgb(255, 51, 153);
    }
  }
}

</style>
