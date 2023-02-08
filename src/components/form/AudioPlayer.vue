<template>
  <div class="flex">
    <span class="flex-1" @click="loadAudio">:D</span>
    <div>asdf</div>
    <audio controls :src="src">
    </audio>
    <canvas
      ref="canvas"
      style="
        height:2rem;
        width:10rem;
        background-color:purple"
    />
    
  </div>
</template>
<script>
import {axios, secureGet} from '@/axios';

const src = '';
var BASE64_MARKER = ';base64,';

export default {
  name:'AudioPlayer',
  mounted(){


  },
  data:() => ({
    src:''
  }),
  props:{
    sample:{
      type: Object,
      default: () => {}
    }
  },
  methods:{
    convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
},

    async loadAudio() {
      const canvas = this.$refs['canvas'];
      const ctx = canvas.getContext("2d");
      console.log('Canvas loaded:', canvas, this.sample);

      const ogg = await secureGet(axios, {uri: this.sample.clipUri});
      
      // const binary = btoa(this.convertDataURIToBinary(ogg.data));
      // var blob = new Blob([binary], {type : 'audio/ogg'});
      // var blobUrl = URL.createObjectURL(blob);
      // const aud = new Audio(ogg.data);
      // aud.load();
      console.log('downloaded file', ogg.data);


      var blob = new Blob([ogg.data], {type: 'audio/ogg'});
      var objectUrl = URL.createObjectURL(blob);
      this.src = objectUrl;

      // this.$refs.canvas.onload = function(evt) {
      //   URL.revokeObjectURL(objectUrl);
      // };

      // const data = [];
      // data.push(ogg.data);
      // const url = window.URL.createObjectURL(new Blob(data, {type: "audio/wav"}))

      console.log('url', objectUrl);
    }
  }
}
</script>