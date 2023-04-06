<template>
  <div>
    <div class="flex divide-x">
      <section class="basis-9/12 px-8 py-4">
        <!--        <h4>服装式样</h4>-->
        <el-tabs v-model="activeName" style="width: 100%">
          <template v-for="(item,index) in tabList">
            <el-tab-pane :key="index" :label="item.label" :name="item.name">
              <aicolor-image-show
                ref="aicolorImageShow"
                v-bind:name="item.name"
                v-bind:module="moduleType"
                v-bind:urls="urls[index]"
                v-bind:index="index"
                v-bind:token="uploadData.token"
                v-if="aicolorReady"
                @selectCloth="selectCloth(arguments)">
              </aicolor-image-show>
            </el-tab-pane>
          </template>
        </el-tabs>
      </section>

      <section class="basis-3/12 p-4 flex flex-col items-stretch" >
<!--        <div class="text-left font-bold text-black">颜色抽取</div>-->
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
              :multiple="true"
              :on-change = "handleChange"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :on-Error="handleError"
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
          <AtsButton expand type="primary" @click="handleUpload1">颜色抽取</AtsButton>
        </div>

      </section>
    </div>

    <div>
      <my-collect-dialog title="AI着色结果" :visible.sync ="dialogVisible" :collect-info="collect">
        <aicolor-result
          v-bind:sketch="resultSketch"
          v-bind:sketchFromLocal="selectClothFromLocal"
          v-bind:color="resultColor"
          v-bind:body-type="bodyType"
          v-bind:result="aicolorResult"
          v-loading="resultLoading"
          v-bind:uploadToken="uploadData.token"
          v-bind:dialogVisible="dialogVisible"
          ref="aicolorResult">
        </aicolor-result>
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
import landscpaeImageShow from "./landscapeImageShow.vue";
import AIColorResult from "./aicolorResult.vue";
import {AIColor} from "../../api/design";
import * as qiniu from "qiniu-js";
import {getUploadToken} from "../../api/design";
import {initAIColor} from "../../api/design";
import {showError} from "./alert";
import MyCollectDialog from "../my-collect-dialog";
import {getCoverImg, getImg} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";
import AicolorResult from "./aicolorResult.vue";
import NavTemplate from "../collaborate/nav/navTemplate.vue";
import LandscapeImageShow from "./landscapeImageShow.vue";
import AicolorImageShow from "./aicolorImageShow";
export default {
  name: "designAIColor",
  components: {
    AicolorImageShow,
    LandscapeImageShow, NavTemplate, AicolorResult, MyCollectDialog, AIColorResult, ImageShow, AtsButton},
  data() {
    return {
      moduleType:"aicolor",
      isCollapse: true,
      hasSubmit: false,
      activeName: "Tops",

      tabList: [
        {
          label: "上衣",
          name: "Tops"
        },
        {
          label: "下装",
          name: "Bottoms"
        },
        {
          label: "全身",
          name: "Wholes"
        },
      ],
      fileNames:[],
      // 该模块模特服装urls写死，即预设少量模特图片，主要支持用户自己上传模特图片
      urls:[
        [],
        [],
        [],
      ],
      aicolorReady:false,  //记录图片是否加载完成

      fileList:[],
      imageUrl :null, //图片在七牛云上的url，通过这个url可以直接访问到图片
      imageKey:null,  //图片上传到七牛云上，返回的key
      imageDescription:"",
      uploadData: {
        token:"",
        key:""
      },

      // 模特图像相关
      selectClothId:'',
      selectClothKey: '',
      selectClothType:'',
      selectClothFromLocal:false, // 判断模特图象是否来自本地上传，默认为false
      selectClothBase64:'',
      bodyType: 0,

      // 图像相关
      dialogVisible: false,
      resultLoading: false,
      resultSketch: null,
      resultColor:null,
      aicolorResult: null,


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
    getFiles: function(){
      let _this = this;
      this.urls = [];
      this.fileNames = [];
      var nameList=["topList","bottomList","wholeList"];

      // 临时
      // 注意，这里的urls在push具体的值前必须先设置为空array，否则子组件会报props default的错
      _this.urls.push(
        [
          'http://resource.voguexplorer.com/fashion/aicolor/model/2c7562f723b6cccd72bbda89b9a2150.jpg',
          'http://resource.voguexplorer.com/fashion/aicolor/model/white_tshirt.jpg',
        ]
      );
      _this.urls.push(
        [
          'http://resource.voguexplorer.com/fashion/aicolor/model/ORAWK%5D%25%60M%291%40X_TFL98%25DDA.jpg',
        ]
      );
      _this.urls.push(
        [
          'http://resource.voguexplorer.com/fashion/aicolor/model/0%24IW%5D%7B8%60UCUBGNN~K%29YA677.jpg',
        ]
      );
      initAIColor().then(res => {
        console.log("init aicolor",res.data);
        var landscapeList = res.data;
        landscapeList.forEach((i)=>{
          _this.landscapeImages.push(i);
        })
        console.log(_this.landscapeImages);
        _this.aicolorReady = true;
      });


    },
    //某个tab中某张图片被选中，触发该函数，需要修改元素的className和保存id
    selectCloth: function(msg){
      var dom = msg[0];
      var index = msg[1];
      var type = msg[2];
      console.log("select aicolor",msg);
      this.selectClothType = type;

      if(index > 0){
        this.selectClothFromLocal = false;
        var typeIndex = this.getType(type);
        this.selectClothId = this.urls[typeIndex][index-1];
        console.log('选中模特'+this.selectClothId);
      }
      // 如果index=0，那么

      else{
        // 这里区分一下success、change和border（子组件中有三种回调情况）
        // success获取到的modelUrl是七牛云的下载地址，是父组件最终需要的
        // change获取到的modelUrl是图像base64，
        // border是点到边框而没有选中upload组件，这种情况
        console.log('回调情况'+msg[3]);
        if(msg[3] === 'success'){
          this.selectClothId = msg[4]; // qiniuyun key值
          console.log('上传模特'+this.selectClothId);
          this.handleUpload2();
        }
        else if(msg[3] === 'border'){
          if(this.selectClothFromLocal === false){
            this.selectClothId = '';
          }
        }
        this.selectClothFromLocal = true;
      }
    },
    getType:function(name){
      var list = this.tabList;
      for(var i=0;i<list.length;i++){
        if(name == list[i].name)
          return i;
      }
      return -1;
    },

    // 子组件里的upload
    getModel:function (modelUrl){
      this.selectClothId = modelUrl;
    },

    handleChange: function (file,fileList){
      if(fileList.length>1){
        fileList.splice(0,1);
      }
      console.log(fileList[0]);
      if(!this.beforeUpload(file.raw))
        return ;

      var This = this;
      //this.imageUrl = URL.createObjectURL(file.raw);
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e){
        // this.result // 这个就是base64编码了
        This.imageUrl = this.result;
        console.log("看看base64");
        console.log(typeof (This.imageUrl));
        console.log(This.imageUrl);
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
      var newName = "aicolor_" + timestamp + name;
      console.log("newName",newName);
      return newName;
    },

    handleSuccess(res,file) {
      console.log("success:",res,file)
      this.imageUrl =this.$store.state.domain  + res.key;
      this.imageKey = res.key;
      //2. 将信息传提给后端
      this.submit();
    },
    handleError(res){
      console.log("Error:",res );
    },

    // 由于执行顺序的问题，调用子组件中handleUploadModel方法，其success钩子会在原本这个函数结束后才触发，所以拆成两块来写
    handleUpload1: function (){
      if(this.selectClothFromLocal === true){
        console.log(this.$refs.aicolorImageShow.length);
        for(var i = 0; i<this.tabList.length; i++){
          if(this.tabList[i].name === this.activeName){
            this.$refs.aicolorImageShow[i].handleUploadModel();
            break;
          }
        }
      }
      else{
        this.handleUpload2();
      }
    },
    handleUpload2: function(){
      // 为了测试
      //this.imageUrl = 'http://resource.voguexplorer.com/fashion/aicolor/landscape/c37369a3bd1f0f4096fb1a71327f909.jpg';
      //this.imageKey = 'fashion/aicolor/landscape/c37369a3bd1f0f4096fb1a71327f909.jpg';
      console.log('检查模特和颜色')
      console.log(this.selectClothId);
      console.log(this.imageUrl);
      //
      var cloth = this.selectClothId;

      var color = this.imageUrl;

      if(cloth === null || cloth ===''){
        this.$message.error("请选择你想要的服装！");
        return;
      }
      if(color === null || color === ''){
        this.$message.error("请上传颜色抽取图像！");
        return;
      }
      //1. 将图片上传到七牛云
      if(this.imageKey==null){
        this.$refs.upload.submit();
      }
      else
        this.submit();
    },

    submit: function (){

      console.log(this.selectClothId);
      //上传两张图片并返回结果，此处传给后端接口，用的是key值，后端会自动补全url
      var sketch = this.selectClothId.slice(33);
      var color= this.imageKey;
      let _this=this;

      // 此处传的是完整的url给aicolorresult子组件
      _this.resultSketch = _this.selectClothId;
      _this.resultColor = _this.imageUrl
      _this.aicolorResult = null

      this.resultLoading = true;
      this.dialogVisible = true;

      for(var i=0; i<this.tabList.length; i++){
        if(this.tabList[i].name === this.activeName){
          _this.bodyType = i;
          break;
        }
      }
      console.log('模型着色类型'+_this.bodyType);
      var val = {
        personImage: sketch,
        landscapeImage: color,
        bodySection: _this.bodyType,
        type: 0,
      }
      console.log(val);
      AIColor(val).then(res=>{
        console.log('AI着色成功!');
        console.log(res.data);
        _this.aicolorResult = res.data.data.targetUrl
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
      var res =await this.$refs.aicolorResult.collect()
      console.log("design AIColor",res)
      return res
    },

    //上传后端待处理

    //按钮行为

    sure() {
      this.hasSubmit = false;
    },

    //更多风景图
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

}
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
