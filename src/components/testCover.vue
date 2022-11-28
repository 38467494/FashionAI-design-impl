<template>
  <div style="margin: 10px;">
    <canvas width="950" height="400" id="cover"  style="border: 1px black solid;"></canvas>

    <el-button @click="getImg"></el-button>

    <el-image :src = "url" v-if="url"></el-image>
  </div>

</template>

<script>
// import {fabric} from "../static/js/fabric.js";
import {fabric} from "fabric";
import {getImg, getRenderImg,getOutfitImg,getCollaborateImg,getVtonImg, uploadImg,uploadURL} from "./personal/coverFunction";

export default {
  name: "testCover",
  data: function (){
    return {
      canvas: null,
      url: null
    }
  },
  mounted: async function() {
    var url = this.$store.state.domain + "cover_MMC_1654764593000_0.03652412370722535.png"

    uploadURL("test",url)
  },
  methods:{
    addImg: function (img,top,left,scale){
      var canvas = this.canvas
      // var image = new Image()
      // img.crossOrigin = "anonymous"
      fabric.Image.fromURL(img, function (oImg){
        oImg.top = top;
        oImg.left = left;
        oImg.scale(scale)
        oImg.crossOrigin = "anonymous"
        console.log(oImg.getCrossOrigin())
        canvas.add(oImg)
      },{crossOrigin: "anonymous"})
    },
    addText: function (text,top,left,weight){
      var canvas = this.canvas;
      var textBox = new fabric.Textbox(text,{
        left: left,
        top: top,
        width: 300,
        fontSize: 18,
        fontWeight: weight
        // textAlign: "center"
        // hasControls: false
      });
      this.canvas.add(textBox)
    },
    objToString: function (labels){
      var str = ""
      for(var i=0;i<labels.length;i++){
        if(i!=0)
          str +="、 "
        str+=labels[i];
      }
      return str;
    },
    getImg: function (){
      console.log(this.canvas)

      // var res = getRenderImg(this.canvas,data)
      // console.log("testRes",res)
      //
      // this.$nextTick(()=>{
      //   var img = this.canvas.toDataURL("png")
      //   console.log("nextTic", img)
      // })

      var res = getImg(this.canvas);
      console.log(res)
    },
    // urlToBase64(url) {
    //   var canvas = document.createElement("canvas");
    //   canvas.setAttribute("id","image")
    //   canvas = new fabric.Canvas("image")
    //   canvas.
    // }
  }
}
</script>

<style scoped>

</style>
