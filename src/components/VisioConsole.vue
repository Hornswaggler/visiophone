<template>
  <div style="height:100%;width:100%;display:flex;background-color:grey;">
    <div style="flex:1;background-color:black;margin:2em;display:flex;flex-direction:column;justify-content:flex-end;padding:1em;">
      
      <div  style="flex:1;text-align:left;">
        <span style="font-size:1.1em;">&lt;&quot;Trade Samples?&quot;&gt;</span><br/>
        <div class="choices">
          <span>&nbsp;&lt;&quot;Trade Samples&quot;&gt;</span><br/>
          <span>&nbsp;&lt;&quot;Buy Tokens&quot;&gt;</span><br/>
          <span>&nbsp;&lt;&quot;Sell Tokens&quot;&gt;</span><br/>
          <span>&nbsp;&lt;&quot;Play Game&quot;&gt;</span><br/>
        </div>
      </div>
    
      <div style="height:25px;width:100%;display:flex;">
        <img style="height:25px;width:25px;" :src="require(`@/assets/visiolad_walking_with_torch.gif`)"/><input v-model="consoleInput" class="consoleInput" type="text" style="color: #66FF00;border-top:solid 1px #66FF00;background-color:black;border:0;margin-left:0.25em;"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VisioConsole',
  data:()=>({
    consoleInput:'>'
  })
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
