<template>
  <div>
    <div class="upload-div w-full">
      <el-upload
        class="avatar-uploader w-full h-auto"
        action="http://upload-z2.qiniup.com"
        accept="image"
        :auto-upload = "false"
        :multiple="true"
        :on-change = "handleChange"
        :file-list="fileList"
      >
        <i class="uploader-tips-txt bi bi-plus-circle "></i>
        <p class="uploader-tips-txt">世界风景图</p>
      </el-upload>
      <ats-button @click="handleUpload">
        上传
      </ats-button>
    </div>
  </div>
</template>

<script>

import {getUploadToken, ripupload} from "../../api/design";
import {showError} from "./alert";
import AtsButton from "../common/AtsButton.vue";
export default {
  name: "designTest",
  components: {AtsButton},
  data() {
    return {
      fileList:[],
      token:'',
    };
  },
  mounted:function() {
    //生成七牛云上传凭证
    let _this=this;
    getUploadToken({
      forever: true
    }).then(res=>{
      console.log("getUploadToken:",res.data);
      _this.token = res.data;
    })
  },
  methods:{
    handleChange: function (file,fileList){
      console.log("change",file,fileList);
      this.fileList = fileList;
    },
    handleUpload: function (){
      if (this.fileList.length !== 0 ){
        this.fileList.forEach(file =>{
          let formData = new FormData();
          formData.append('file', file.raw);
          formData.append('fileName', file.name);
          this.upload({
            action:"http://upload-z2.qiniup.com",
            filename:file.name,
            file:file.raw
          });
          // ripupload(formData,this.token).then(res=>{
          //   console.log(res);
          //
          // })
        })
      }
    }
  },
}
</script>

<style scoped>

</style>
