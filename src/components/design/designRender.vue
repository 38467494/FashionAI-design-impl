<template>
  <div>
    <div class="flex divide-x">
      <section class="basis-9/12 px-8 py-4">
<!--        <h4>服装式样</h4>-->
          <el-tabs v-model="activeName" style="width: 100%">
            <template v-for="(item,index) in tabList">
              <el-tab-pane :key="index" :label="item.label" :name="item.name">
                <image-show
                  v-bind:name="item.name"
                  v-bind:module="moduleType"
                  v-bind:urls="urls[index]"
                  v-bind:index="index"
                  v-if="renderReady"
                            @selectCloth="selectCloth(arguments)">
                </image-show>
              </el-tab-pane>
            </template>
          </el-tabs>

      </section>

      <section class="basis-3/12 p-4 flex flex-col items-stretch" >
        <div class="text-left font-bold text-black">颜色抽取</div>
        <div class="my-4">
          <div class="upload-div w-full">
            <el-upload
              class="avatar-uploader w-full h-auto"
              ref="upload"
              action="http://upload-z2.qiniup.com"
              accept="image"
              :data="uploadData"
              :auto-upload = "false"
              :multiple="false"
              :on-change = "handleChange"
              :on-remove = "handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :on-Error="handleError"
              :file-list="fileList"
              :limit = "1"
              :on-exceed="handleExceed"
            >
              <el-image v-if="imageUrl" :src="imageUrl" class="avatar" fit="contain">
              </el-image>
              <div v-else
                   class="uploader-tips mx-auto flex flex-col items-center justify-center text-center"
              >
                <i class="uploader-tips-txt bi bi-plus-circle "></i>
                <p class="uploader-tips-txt">抽取图片颜色合成衣服</p>
              </div>
            </el-upload>
          </div>
        </div>
        <div>
          <AtsButton expand type="primary" @click="handleUpload">提交</AtsButton>
        </div>
      </section>
    </div>

    <div>
      <my-collect-dialog title="渲染生成结果" :visible.sync ="dialogVisible" :collect-info="collect">
        <render-result v-bind:sketch="resultSketch" v-bind:color="resultColor" v-bind:result="renderResult"
                       v-loading="resultLoading"  v-bind:uploadToken="uploadData.token" v-bind:dialogVisible="dialogVisible" ref="renderResult"></render-result>
      </my-collect-dialog>
<!--      <el-dialog title="渲染生成结果" :visible.sync="dialogVisible" width="70%" style="min-width: 840px">-->
<!--        <render-result v-bind:sketch="resultSketch" v-bind:color="resultColor" v-bind:result="renderResult"-->
<!--        v-loading="resultLoading"  v-bind:uploadToken="uploadData.token"></render-result>-->
<!--      </el-dialog>-->
    </div>
  </div>

</template>


<script>
import ImageShow from "./ImageShow";
import RenderResult from "./renderResult";
import {Render} from "../../api/design";
import renderResult from "./renderResult";
import * as qiniu from "qiniu-js";
import {getUploadToken} from "../../api/design";
import {initRender} from "../../api/design";
import {showError} from "./alert";
import MyCollectDialog from "../my-collect-dialog";
import {getCoverImg, getImg} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";
export default {
  name: "designRender",
  components: {MyCollectDialog, RenderResult, ImageShow, AtsButton},
  data() {
    return {
      moduleType:"render",
      isCollapse: true,
      hasSubmit: false,
      activeName: "Jackets",

      tabList: [
        {
          label: "夹克衫",
          name: "Jackets"
        },
        {
          label: "上衣",
          name: "Tops"
        },
        {
          label: "牛仔裤",
          name: "Jeans"
        },
        {
          label: "短裤",
          name: "Shorts"
        },
        {
          label: "裙子",
          name: "Skirts"
        },
        {
          label: "包",
          name: "Bags"
        },
        {
          label: "帽子",
          name: "Hats"
        },
      ],
      fileNames:[],
      urls:[
        [
          // "http://shoplook.voguexplorer.com/000000221f00000b30e99368f4b72eed.jpg"
        ],
        [],[], [],[],[],[]
      ],
      renderReady:false,  //记录图片是否加载完成

      fileList:[],
      imageUrl :null, //图片在七牛云上的url，通过这个url可以直接访问到图片
      imageKey:null,  //图片上传到七牛云上，返回的key
      uploadData: {
        token:"",
        key:""
      },

      //图像相关

      dialogVisible: false,
      resultLoading: false,
      resultSketch: null,
      resultColor:null,
      renderResult: null,

    };
  },
  mounted:function() {
      //生成七牛云上传凭证
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
    //获取数据库中图像数据
    getFiles: function(){
      let _this = this;
      this.urls = [];
      this.fileNames = [];
      var nameList=["jacketList","topList","jeansList","shortsList","skirtList","bagList","hatList"];
      initRender().then(res => {
        console.log("init render",res.data);
        var files = res.data.data;
        for(var i=0;i<nameList.length;i++){
          var list = files[nameList[i]];
          var arr = [];
          for(var j=0;j<list.length;j++){
            console.log('看看list[j]'+list[j]);
            var name = this.$store.state.domain  + list[j];
            arr.push(name);
          }
          _this.urls.push(arr);
          _this.fileNames.push(list);
        }
        console.log(_this.urls,_this.fileNames);
        _this.renderReady = true;
      })
    },
    //某个tab中某张图片被选中，出发该函数，需要修改元素的className和保存id
    selectCloth: function(msg){
      var dom = msg[0];
      var index = msg[1];
      var type = msg[2];
      console.log("select render",msg);


      var typeIndex = this.getType(type);
      this.selectClothId = this.urls[typeIndex][index];
      this.selectClothType = type;

      console.log(this.selectClothId);

    },

    getType:function(name){
      var list = this.tabList;
      for(var i=0;i<list.length;i++){
        if(name == list[i].name)
          return i;
      }
      return -1;
    },

  handleChange: function (file,fileList){
    console.log("change",file,fileList);
    if(!this.beforeUpload(file.raw))
      return ;

    var This = this;
    //this.imageUrl = URL.createObjectURL(file.raw);
    var reader = new FileReader();
    reader.readAsDataURL(file.raw);
    reader.onload = function(e){
      // this.result // 这个就是base64编码了
      This.imageUrl = this.result;
    }
  },

    handleRemove:function (file){
      console.log('remove',file);
      this.imageUrl = '';
      this.imageKey = null;
    },

    handleExceed: function (files,fileList){
      console.log("exceed");
      this.$message.warning('只能上传一张图片！如需要更换，请先删除原图片');
    },

    beforeUpload: function (file){
      const isJPG = (file.type === "image/jpeg") || (file.type === "image/png");
      console.log("beforeUpload",isJPG)
      if(!isJPG){
        this.$message.error('上传图片只能为JPG或PNG格式');
        this.fileList = [];
        return false;
      }

      this.uploadData.key=this.getName(file.name);
      return true;
    },
    //设置上传文件的文件名
    getName: function (name){
      var timestamp = Date.parse(new Date());
      var newName = "render_" + timestamp + name;
      console.log("newName",newName);
      return newName;
    },

    handleSuccess(res,file) {
      console.log("success:",res,file)
      this.imageUrl =this.$store.state.domain  + res.key;
      this.imageKey = res.key;

      console.log('上传成功handlesuccess:'+this.imageUrl);

      //2. 将信息传提给后端
      this.submit();
    },
    handleError(res){
      console.log("Error:",res );
    },

    handleUpload:function (){

      console.log('上传进行时handleupload:'+this.imageUrl); // 这里的imageUrl还是base64编码
      var cloth = this.selectClothId;
      var color = this.imageUrl;

      if(cloth == null){
        this.$message.error("请选择你想要的服装！");
        return;
      }
      if(color == ''){
        this.$message.error("请上传颜色抽取图像！");
        return;
      }

      //1. 将图片上传到七牛云
      if(this.imageKey==null) // 注意 这里的imageKey是空的，图片上传成功后，imageUrl会从base64变为下载外链
        this.$refs.upload.submit();
      else
        this.submit();
      console.log('看看结束没有');

    },

    submit: function (){
        //上传两张图片并返回结果
      var sketch = this.selectClothId.slice(33);
      var color= this.imageKey;
      let _this=this;
      _this.resultSketch = _this.selectClothId;
      _this.resultColor = _this.imageUrl
      _this.renderResult = null

      this.resultLoading = true;
      this.dialogVisible = true;


      console.log(sketch);
      console.log(color);

      Render({
        originFileName: sketch,
        colorFileName: color
      }).then(res=>{
        console.log(res.data);


        _this.renderResult = res.data.data.fileUrl

        _this.resultLoading = false;
        // this.$refs.renderResult.getData(sketch,color,res.data.data);

        // console.log(color);
      }).catch(res=>{
        console.log("error",res);
        _this.dialogVisible=false;
        showError(_this,res);

      })

    },

    collect:async function (){
      var res =await this.$refs.renderResult.collect()
      console.log("design Render",res)
      return res
    },



    //上传后端待处理

    //按钮行为

    sure() {
      this.hasSubmit = false;
    },
  },
};
</script>

<style>
@import "../../assets/css/design/render.css";
</style>
