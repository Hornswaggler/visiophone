<template>
  <div style="height:100vh;width:100vw;display:flex;justify-content:center;align-items:center;">
    <div style="background-color:grey;height:60vh;width:60vh;padding:2em;display:flex;justify-content:center;flex-direction:column;">
      <div>
        <div>UserName: <input type="text" name="username" v-model="username"/></div>
        <div style="margin-top:2em;"  name="password" >Password: <input type="password" v-model="password" /></div>
      </div>
      <div style="color:darkred;padding-top:2em;display:flex;justify-content:flex-start;"><div v-if="error">ERROR: {{error}}</div></div>
      <div style="flex:1;display:flex;align-items:flex-end;justify-content:flex-end;">
        {{username}}
        <button @click="login" style="cursor:pointer;" alt="login">Login</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'Login',
  data:() => ({
    username:'',
    password:'',
    error:''
  }),
  methods:{
    async login(){
      const {username, password} = this;
      if(await this.$store.dispatch('user/login',{username, password})) this.$router.push('/console');
    }
  }
}
</script>