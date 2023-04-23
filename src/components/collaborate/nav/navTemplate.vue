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
    <div>
      <el-upload
        action="http://upload-z2.qiniup.com"
        :show-file-list="false"
        :on-success="handleSuccess"
        :data="uploadData"
        :before-upload="beforeUpload"
        class="innerUpload"
      >
        <AtsButton type="primary" plain round size="mini">
          <i class="bi bi-arrow-clockwise"></i>
          本地上传
        </AtsButton>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { addObj } from "./objFunction";
import { getMaterial } from "../../../api/collaborateAPI";
import AtsButton from "../../common/AtsButton";
import {getUploadToken} from "../../../api/design";

export default {
  name: "navTemplate",
  components:{AtsButton},
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    },
    uploadToken:{
      type: String,
      default: null,
    }
  },
  watch:{
    uploadToken:{
      handler(newValue,oldValue){
        this.uploadData.token = newValue;
      },
      deep:true,
      immediate:false,
    }
  },
  data: function() {
    return {
      files: [],
      hover: false,
      filePath: "/static/template/",

      // 新增上传本地图片
      imageUrl: null,
      imageKey: null,
      uploadData: {
        token: "",
        key: ""
      },
    };
  },
  mounted() {
    let _this=this;
    getUploadToken({
      forever: false
    }).then(res=>{
      console.log("getUploadToken:",res.data);
      _this.uploadData.token = res.data;
    })
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
      console.log(url);
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
    },
    // 上传相关钩子
    handleSuccess: function (res, file) {
      console.log("success:", res, file)
      this.imageUrl = this.$store.state.domain + res.key;
      this.imageKey = res.key;
      this.uploadPicture(this.imageUrl);
    },
    beforeUpload: function (file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        this.$message.error('上传图片只能为JPG或PNG格式');
        this.fileList = [];
        return false;
      }
      this.uploadData.key = this.getName(file.name);
      return true;
    },
    //设置上传文件的文件名
    getName: function (name) {
      var timestamp = Date.parse(new Date());
      var newName = "render_" + timestamp + name;
      console.log("newName", newName);
      return newName;
    },
    uploadPicture(url){
      var _canvas = this.canvas;
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
