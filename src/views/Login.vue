<template>
  <div v-on:keyup.enter="login"  style="height:100vh;width:100vw;display:flex;justify-content:center;align-items:center;">
    <div style="background-color:grey;height:60vh;width:60vh;padding:2em;display:flex;justify-content:center;flex-direction:column;">
      <div>
        <div style="display:flex;justify-content:space-around;">
          <span>User Name:</span>
          <input type="text" name="username" v-model="username"/>
        </div>
        <div style="margin-top:2em;display:flex;justify-content:space-around;"  name="password">
          <span>Password:</span>
          <input type="password" v-model="password" />
        </div>
      </div>
      <div style="color:darkred;padding-top:2em;display:flex;justify-content:flex-start;">
        <div v-if="error">ERROR: {{error}} </div></div>
      <div style="flex:1;display:flex;align-items:flex-end;justify-content:flex-end;">
        <button @click="login" style="cursor:pointer;" alt="login">Login</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'Login',
  mounted(){
    console.log('mounted', process.env.VUE_APP_BASE_URL);
  },
  data:() => ({
    username:'',
    password:'',
    error:'',
  }),
  methods:{
    async login() {
      const {username, password} = this;

      if(!username || !password) return this.error = 'Please provide both a username and password';

      try{
        this.$store.commit('app/isLoading', true);
        const valid = await this.$store.dispatch('user/login',{username, password});
        if(valid) {
          this.error = '';
          this.$router.push('/console')
        } else{
          this.error = 'Supplied credentials were incorrect.';
        }
      } catch(e) {
        console.error('Login failed', e);
      } finally {
        this.$store.commit('app/isLoading', false);
      }
    }
  }
}
</script>