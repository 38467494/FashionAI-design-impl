<template>
  <div class="template flex flex-col gap-y-4">
    <div class="text-lg font-bold text-center">点击添加模板图片</div>
    <!-- 以后可以通过v-for进行批量的渲染 -->
    <div style="height:550px">
      <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;">
        <template v-for="(item, index) in files">
          <el-row type="flex" :key="index" v-if="index % 2 == 0">
            <el-col :span="12">
              <div class="template-div" @click="addPicture(index)">
                <el-image
                  :src="files[index]"
                  v-if="files[index]"
                  fit="contain"
                  class="template-img"
                ></el-image>
              </div>
            </el-col>
            <el-col :span="12" v-if="index + 1 < files.length">
              <div class="template-div" @click="addPicture(index + 1)">
                <el-image
                  :src="files[index + 1]"
                  v-if="files[index + 1]"
                  fit="contain"
                  class="template-img"
                ></el-image>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { addObj } from "./objFunction";
import { getMaterial } from "../../../api/collaborateAPI";
export default {
  name: "navTemplate",
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  data: function() {
    return {
      files: [],
      hover: false,
      filePath: "/static/template/"
    };
  },
  mounted() {
    this.getFiles();
  },
  methods: {
    getFiles: function() {
      let _this = this;
      getMaterial({ category: "template" }).then(res => {
        console.log("template material", res.data.data);
        _this.files = [];
        var files = res.data.data;
        for (var i = 0; i < files.length; i++) {
          _this.files.push(this.$store.state.domain + files[i]);
        }
      });
    },
    // getSrc: function (index){
    //     var path = this.filePath + this.files[index].slice(2);
    //     // console.log(path);
    //     return path;
    // },
    addPicture: function(index) {
      var _canvas = this.canvas;
      var url = this.files[index];
      fabric.Image.fromURL(
        url,
        function(oImg) {
          console.log(oImg.width, oImg.height);
          var s1 = 450 / oImg.width;
          var s2 = 600 / oImg.height;
          oImg.left = 0;
          oImg.top = 0;
          if (s1 < s2) {
            oImg.scale(s1);
            oImg.top = 300 - (oImg.height * s1) / 2;
          } else {
            oImg.scale(s2);
            oImg.left = 225 - (oImg.width * s2) / 2;
          }

          addObj(oImg, _canvas);
        },
        { crossOrigin: "anonymous" }
      );
    }
  }
};
</script>

<style scoped>
@import "../../../assets/css/collaborate/navTemplate.css";
</style>
