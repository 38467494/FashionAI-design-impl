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
              :show-file-list="false"
              :data="uploadData"
              :auto-upload = "false"
              :multiple="false"
              :on-change = "handleChange"
              :on-remove = "handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :file-list="fileList"
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
            <div class="mb-2 text-black font-bold" v-if="imageDescription">{{imageDescription}}</div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="flex">
          <section class="basis-1/2">
            <div class="text-left font-bold text-black">世界风景图</div>
          </section>
          <section class="basis-1/2 flex justify-end">
            <el-link style="color:blue" @click="moreLandscapeImages">更多>></el-link>
          </section>
        </div>
        <div class="flex">
          <el-row type="flex">
            <template v-for="(item,index) in previewImages">
              <div class="show-card" style="width: 25%" @click="selectLandscapeImageFromPreviewImages(item)">
                <el-image :src="item.url" v-if="item.url" fit="contain"></el-image>
              </div>
            </template>
          </el-row>
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
    <div>
      <el-dialog :visible.sync="landscapeVisible" width="55%"
                 style="min-width: 840px;">
        <template #title>
          <div class="text-left font-bold text-2xl px-5 py-2">世界风景图</div>
        </template>
        <slot></slot>
        <template>
          <div class="flex divide-x px-6">
            <section class="basis-1/6 flex-none border-r p-0" style="min-height: 300px">
              <template v-for="(item, index) in landscapeNavs">
                <div
                  class="ats-sidenav"
                  :class="selectedContinentIdx === item.idx ? 'active' : ''"
                  @click="selectLandscapeImages(item)"
                >
                  <div class="flex is-justify-end">
                    <i class="bi mr-2 text-xl" :class="'bi-' + item.icon"></i>
                    <span class="text-lg">{{ item.continent }}</span>
                  </div>
                </div>
              </template>
            </section>
            <section class="basis-5/6">
              <!--              <div style="width: 50%">-->
              <!--                <el-input-->
              <!--                  placeholder="请输入你想选择的风景地名称"-->
              <!--                  v-model="searchLandscape">-->
              <!--                  <i slot="suffix" class="el-input__icon el-icon-search"></i>-->
              <!--                </el-input>-->
              <!--              </div>-->
              <div style="margin-left: 10px">
                <landscape-image-show
                  v-bind:module="moduleType"
                  v-bind:urls="selectedImages"
                  v-bind:isDescriptionVisible="true"
                  v-if="landscapeReady"
                  @selectLandscapeImage="selectLandscapeImage(arguments)">
                </landscape-image-show>
              </div>
            </section>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>

</template>


<script>
import ImageShow from "./ImageShow";
import RenderResult from "./renderResult";
import {initLandscape, Render} from "../../api/design";
import renderResult from "./renderResult";
import * as qiniu from "qiniu-js";
import {getUploadToken} from "../../api/design";
import {initRender} from "../../api/design";
import {showError} from "./alert";
import MyCollectDialog from "../my-collect-dialog";
import {getCoverImg, getImg} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";
import LandscapeImageShow from "./landscapeImageShow.vue";
export default {
  name: "designRender",
  components: {MyCollectDialog, RenderResult, ImageShow, AtsButton, LandscapeImageShow},
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
      imageDescription:"",
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

      //世界风景图相关
      landscapeVisible:false,
      landscapeNavs:[
        {
          continent: '热门图片',
          icon:'house-heart',
          idx: 0,
        },
        {
          continent: '北美洲',
          icon:'apple',
          idx: 1,
        },
        {
          continent: '大洋洲',
          icon:'tsunami',
          idx: 2,
        },
        {
          continent: '非洲',
          icon:'patch-question',
          idx: 3,
        },
        {
          continent: '加勒比',
          icon:'patch-question',
          idx: 4,
        },
        {
          continent: '南美洲',
          icon:'patch-question',
          idx: 5,
        },
        {
          continent: '欧洲',
          icon:'patch-question',
          idx: 6,
        },
        {
          continent: '亚洲',
          icon:'patch-question',
          idx: 7,
        },
        {
          continent: '中东',
          icon:'patch-question',
          idx: 8,
        },
        {
          continent: '中美洲',
          icon:'patch-question',
          idx: 9,
        },
      ],
      selectedContinentIdx:0,
      landscapeImages:[
        {
          continent: "热门图片",
          description: "故宫红墙",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/forbiddencity.jpeg"
        },
        {
          continent: "热门图片",
          description: "埃菲尔铁塔",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/EiffelTower.jpg"
        },
        {
          continent: "热门图片",
          description: "卢浮宫",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/Louvre.jpg"
        },
        {
          continent: "热门图片",
          description: "极光",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/aurora.jpg"
        },
      ],
      selectedImages:[
        {
          continent: "热门图片",
          description: "故宫红墙",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/forbiddencity.jpeg"
        },
        {
          continent: "热门图片",
          description: "埃菲尔铁塔",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/EiffelTower.jpg"
        },
        {
          continent: "热门图片",
          description: "卢浮宫",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/Louvre.jpg"
        },
        {
          continent: "热门图片",
          description: "极光",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/aurora.jpg"
        },
      ],
      previewImages:[
        {
          continent: "热门图片",
          description: "故宫红墙",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/forbiddencity.jpeg"
        },
        {
          continent: "热门图片",
          description: "埃菲尔铁塔",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/EiffelTower.jpg"
        },
        {
          continent: "热门图片",
          description: "卢浮宫",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/Louvre.jpg"
        },
        {
          continent: "热门图片",
          description: "极光",
          id: -1,
          url: "http://resource.voguexplorer.com/fashion/aicolor/landscape/aurora.jpg"
        },
      ],
      landscapeReady:true,
      searchLandscape:"",

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
    getFiles: async function(){
      // let _this = this;
      this.urls = [];
      this.fileNames = [];
      var nameList=["jacketList","topList","jeansList","shortsList","skirtList","bagList","hatList"];
      const res1 = await initRender();
      var files = res1.data.data;
      for(var i=0;i<nameList.length;i++){
        var list = files[nameList[i]];
        var arr = [];
        for(var j=0;j<list.length;j++){
          var name = this.$store.state.domain  + list[j];
          arr.push(name);
        }
        this.urls.push(arr);
        this.fileNames.push(list);
      }
      this.renderReady = true;

      const res2 = await initLandscape();
      var landscapeList = res2.data;
      landscapeList.forEach((i)=>{
        this.landscapeImages.push(i);
      })
      this.aicolorReady = true;

      // initRender().then(res => {
      //   console.log("init render",res.data);
      //   var files = res.data.data;
      //   for(var i=0;i<nameList.length;i++){
      //     var list = files[nameList[i]];
      //     var arr = [];
      //     for(var j=0;j<list.length;j++){
      //       console.log('看看list[j]'+list[j]);
      //       var name = this.$store.state.domain  + list[j];
      //       arr.push(name);
      //     }
      //     _this.urls.push(arr);
      //     _this.fileNames.push(list);
      //   }
      //   console.log(_this.urls,_this.fileNames);
      //   _this.renderReady = true;
      // })

      // initLandscape().then(res => {
      //   console.log("init aicolor",res.data);
      //   var landscapeList = res.data;
      //   landscapeList.forEach((i)=>{
      //     _this.landscapeImages.push(i);
      //   })
      //   console.log(_this.landscapeImages);
      //   _this.aicolorReady = true;
      // });
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
    if(fileList.length>1){
      fileList.splice(0,1);
    }
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
      This.imageKey = null;
      This.imageDescription = "";
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

    // 引入世界风景图相关
    moreLandscapeImages: function(){
      console.log('test');
      this.landscapeVisible = true;
    },
    selectLandscapeImages:function (item){
      if(item.idx === this.selectedContinentIdx) return;
      this.selectedContinentIdx = item.idx;
      this.selectedImages.length = 0;
      this.landscapeImages.forEach((i)=>{
        if(i.continent === item.continent){
          console.log(i);
          this.selectedImages.push(i);
        }
      })
    },
    selectLandscapeImage: function (msg){
      console.log('msg0:'+msg[0]); // dom节点 没啥用
      console.log('msg1:'+msg[1]); // 图片id
      console.log('msg2:'+msg[2]); // 图片名字
      this.imageUrl = this.selectedImages[msg[1]].url;
      this.imageKey = this.imageUrl.slice(33);
      this.imageDescription = this.selectedImages[msg[1]].description;
      console.log(this.imageUrl);
      this.landscapeVisible = false;
    },
    selectLandscapeImageFromPreviewImages: function (item){
      this.imageUrl = item.url;
      this.imageKey = this.imageUrl.slice(33);
      this.imageDescription = item.description;
    }
  },
};
</script>

<style>
@import "../../assets/css/design/render.css";
@import "../../assets/css/ats-sidenav.css";
.show-card {
  margin-right: 1.5rem; /* 24px */
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-width: 1px;
  border-radius:  0.5rem; /* 8px */;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all .2s ease-out;
}
.show-card:hover {
  cursor: pointer;
  border-width: 2px;
  border-color: var(--base-primary);
  border-radius:  0.5rem; /* 8px */;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.show-card.img-div-selected {
  border-width: 2px;
  border-color: var(--base-primary);
  border-radius:  0.5rem; /* 8px */;
  background-color: var(--base-primary-opac);
  box-shadow: 0 20px 25px -5px var(--base-primary-shadow), 0 8px 10px -6px var(--base-primary-shadow);
}
</style>
