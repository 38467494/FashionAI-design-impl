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
                v-if="inspireReady"
                @selectCloth="selectCloth(arguments)">
              </image-show>
            </el-tab-pane>
          </template>
        </el-tabs>

      </section>

      <section class="basis-3/12 p-4 flex flex-col items-stretch" >
        <div>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="颜色" name="1">
              <div class="flex-column">
                <div class="flex">
                  <section class="basis-1/3" style="margin: 10px">
                    <el-upload
                      class="avatar-uploaderInspire w-full h-auto"
                      ref="upload1"
                      action="http://upload-z2.qiniup.com"
                      accept="image"
                      :show-file-list="false"
                      :data="uploadData[0]"
                      :auto-upload = "false"
                      :multiple="true"
                      :on-change = "handleChangeColor"
                      :on-success="handleSuccessColor"
                      :before-upload="beforeUploadColor"
                      :on-Error="handleError"
                      :file-list="fileList[0]"
                    >
                      <el-image v-if="imageUrlColor" :src="imageUrlColor" class="avatarInspire" fit="contain">
                      </el-image>
                      <div v-else
                           class="uploaderInspire-tips mx-auto flex flex-col items-center justify-center text-center"
                      >
                        <i class="uploaderInspire-tips-txt bi bi-plus-circle "></i>
                        <p class="uploaderInspire-tips-txt">上传图片</p>
                      </div>
                    </el-upload>
                  </section>
                  <section class="basis-2/3" style="margin: 10px">
                    <div style="text-align: left">渲染程度</div>
                    <el-slider v-model="sliderValueColor" :format-tooltip="formatTooltip"></el-slider>
                  </section>
                </div>
                <div style="text-align: left; padding-left: 50px">素材库</div>
                <div class="basis-1/2">
                  <el-carousel :autoplay="false" type="card" height="100px" @change="((prev,next) => selectMaterialColor(prev, next))">
                    <el-carousel-item v-for="item in materialList" :key="item">
                      <el-image :src="item" class="avatarInspire" fit="contain" @click="selectMaterialColor1(item)"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="纹理" name="2">
              <div class="flex-column">
                <div class="flex">
                  <section class="basis-1/3" style="margin: 10px">
                    <el-upload
                      class="avatar-uploaderInspire w-full h-auto"
                      ref="upload2"
                      action="http://upload-z2.qiniup.com"
                      accept="image"
                      :show-file-list="false"
                      :data="uploadData[1]"
                      :auto-upload = "false"
                      :multiple="true"
                      :on-change = "handleChangeTexture"
                      :on-success="handleSuccessTexture"
                      :before-upload="beforeUploadTexture"
                      :on-Error="handleError"
                      :file-list="fileList[1]"
                    >
                      <el-image v-if="imageUrlTexture" :src="imageUrlTexture" class="avatarInspire" fit="contain">
                      </el-image>
                      <div v-else
                           class="uploaderInspire-tips mx-auto flex flex-col items-center justify-center text-center"
                      >
                        <i class="uploaderInspire-tips-txt bi bi-plus-circle "></i>
                        <p class="uploaderInspire-tips-txt">上传图片</p>
                      </div>
                    </el-upload>
                  </section>
                  <section class="basis-2/3" style="margin: 10px">
                    <div style="text-align: left">渲染程度</div>
                    <el-slider v-model="sliderValueTexture" :format-tooltip="formatTooltip"></el-slider>
                  </section>
                </div>
                <div style="text-align: left; padding-left: 50px">素材库</div>
                <div class="basis-1/2">
                  <el-carousel :autoplay="false" type="card" height="100px" @change="((prev,next) => selectMaterialTexture(prev, next))">
                    <el-carousel-item v-for="item in materialList" :key="item">
                      <el-image :src="item" class="avatarInspire" fit="contain" @click="selectMaterialTexture1(item)"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="形状" name="3">
              <div class="flex-column">
                <div class="flex">
                  <section class="basis-1/3" style="margin: 10px">
                    <el-upload
                      class="avatar-uploaderInspire w-full h-auto"
                      ref="upload3"
                      action="http://upload-z2.qiniup.com"
                      accept="image"
                      :show-file-list="false"
                      :data="uploadData[2]"
                      :auto-upload = "false"
                      :multiple="true"
                      :on-change = "handleChangeShape"
                      :on-success="handleSuccessShape"
                      :before-upload="beforeUploadShape"
                      :on-Error="handleError"
                      :file-list="fileList[2]"
                    >
                      <el-image v-if="imageUrlShape" :src="imageUrlShape" class="avatarInspire" fit="contain">
                      </el-image>
                      <div v-else
                           class="uploaderInspire-tips mx-auto flex flex-col items-center justify-center text-center"
                      >
                        <i class="uploaderInspire-tips-txt bi bi-plus-circle "></i>
                        <p class="uploaderInspire-tips-txt">上传图片</p>
                      </div>
                    </el-upload>
                  </section>
                  <section class="basis-2/3" style="margin: 10px">
                    <div style="text-align: left">渲染程度</div>
                    <el-slider v-model="sliderValueShape" :format-tooltip="formatTooltip"></el-slider>
                  </section>
                </div>
                <div style="text-align: left; padding-left: 50px">素材库</div>
                <div class="basis-1/2">
                  <el-carousel :autoplay="false" type="card" height="100px" @change="((prev,next) => selectMaterialShape(prev, next))">
                    <el-carousel-item v-for="item in shapeList" :key="item">
                      <el-image :src="item" class="avatarInspire" fit="contain" @click="selectMaterialShape1(item)"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div>
          <AtsButton expand type="primary" @click="handleUpload">提交</AtsButton>
        </div>
      </section>
    </div>

    <div>
      <my-collect-dialog title="灵感迁移结果" :visible.sync ="dialogVisible" :collect-info="collect" >
        <inspire-result
          v-bind:sketch="resultSketch"
          v-bind:color="resultColor"
          v-bind:texture="resultTexture"
          v-bind:shape="resultShape"
          v-bind:sliderValueColor="sliderValueColor"
          v-bind:sliderValueTexture="sliderValueTexture"
          v-bind:sliderValueShape="sliderValueShape"
          v-bind:result="inspireResult"
          loading="resultLoading"
          v-bind:uploadToken="uploadData[0].token"
          v-bind:dialogVisible="dialogVisible"
          ref="inspireResult">
        </inspire-result>
      </my-collect-dialog>
      <!--      <el-dialog title="渲染生成结果" :visible.sync="dialogVisible" width="70%" style="min-width: 840px">-->
      <!--        <inspire-result v-bind:sketch="resultSketch" v-bind:color="resultColor" v-bind:result="inspireResult"-->
      <!--        v-loading="resultLoading"  v-bind:uploadToken="uploadData.token"></inspire-result>-->
      <!--      </el-dialog>-->
    </div>
  </div>
</template>

<script>
import ImageShow from "./ImageShow";
import InspireResult from "./inspireResult";
import {Inspire} from "../../api/design";
import * as qiniu from "qiniu-js";
import {getUploadToken} from "../../api/design";
import {initInspire} from "../../api/design";
import {showError} from "./alert";
import MyCollectDialog from "../my-collect-dialog";
import {getCoverImg, getImg} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";
export default {
  name: "designInspire",
  components: {MyCollectDialog, InspireResult, ImageShow, AtsButton},
  data() {
    return {
      moduleType:"inspire",
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
      inspireReady:false,  //记录图片是否加载完成

      fileList:[[],[],[]],
      fileListColor:[],
      fileListTexture:[],
      fileListShape:[],
      imageUrl :null, //图片在七牛云上的url，通过这个url可以直接访问到图片
      imageKey:null,  //图片上传到七牛云上，返回的key
      uploadData: [
        {
          token:"",
          key:""
        },
        {
          token:"",
          key:""
        },
        {
          token:"",
          key:""
        }
      ],
      // 这三个imageUrl如果写成list形式，在前端显示会有一个卡顿，因此分开写
      imageUrlColor: null,
      imageUrlTexture: null,
      imageUrlShape: null,
      imageKeyList:[null, null, null],
      activeNames:['1'],
      sliderValueColor: 50,
      sliderValueTexture: 50,
      sliderValueShape: 50,
      materialList:[
        'http://resource.voguexplorer.com/fashion/inspire/material/ILSVRC2012_test_00000004.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/ILSVRC2012_test_00005306.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/ILSVRC2012_test_00000181.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/ILSVRC2012_test_00000415.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/ILSVRC2012_test_00005040.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/image_00183.jpg',
      ],
      shapeList:[
        'http://resource.voguexplorer.com/fashion/inspire/material/0000.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0001.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0002.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0003.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0004.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0005.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0006.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0007.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0008.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0009.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0010.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0011.jpg',
        'http://resource.voguexplorer.com/fashion/inspire/material/0012.jpg',
      ],
      selectedMaterialColor: '',
      selectedMaterialTexture: '',
      selectedMaterialShape: '',
      //图像相关
      dialogVisible: false,
      resultLoading: false,
      resultSketch: null,
      resultColor: null,
      resultTexture: null,
      resultShape: null,
      inspireResult: null,

    };
  },
  mounted:function() {
    //生成七牛云上传凭证
    let _this=this;
    getUploadToken({
      forever: false
    }).then(res=>{
      console.log("getUploadToken:",res.data);
      _this.uploadData[0].token = res.data;
      _this.uploadData[1].token = res.data;
      _this.uploadData[2].token = res.data;
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
      initInspire().then(res => {
        console.log("init inspire",res.data);
        var files = res.data.data;
        for(var i=0;i<nameList.length;i++){
          var list = files[nameList[i]];
          var arr = [];
          for(var j=0;j<list.length;j++){
            var name = this.$store.state.domain  + list[j];
            arr.push(name);
          }
          _this.urls.push(arr);
          _this.fileNames.push(list);
        }
        console.log(_this.urls,_this.fileNames);
        _this.inspireReady = true;
      })
    },
    //某个tab中某张图片被选中，出发该函数，需要修改元素的className和保存id
    selectCloth: function(msg){
      var dom = msg[0];
      var index = msg[1];
      var type = msg[2];
      console.log("select inspire",msg);


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

    // 因为有三个上传框，所以设置三套钩子函数，调用原来对应的钩子函数
    handleChangeColor: function (file, fileList){
      console.log('handleChangeColor');
      if(!this.beforeUploadColor(file.raw))
        return ;
      // 判断status非常重要，因为on-change会在文件上传成功后再触发一次，导致keylist变为null，而上传前的status是ready，上传后是success
      console.log(file.status);
      if(file.status === 'ready'){
        this.handleChange(file, fileList ,0);
      }
    },
    handleChangeTexture: function (file, fileList){
      console.log('handleChangeTexture');
      if(!this.beforeUploadTexture(file.raw))
        return ;
      console.log(file.status);
      if(file.status === 'ready'){
        this.handleChange(file, fileList ,1);
      };
    },
    handleChangeShape: function (file, fileList){
      console.log('handleChangeShape');
      if(!this.beforeUploadShape(file.raw))
        return ;
      console.log(file.status);
      if(file.status === 'ready'){
        this.handleChange(file, fileList ,2);
      }
    },
    handleChange: function (file, fileList, index){
      if(fileList.length>1){
        fileList.splice(0,1);
      }
      console.log(fileList[0]);
      var This = this;
      //this.imageUrl = URL.createObjectURL(file.raw);
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e){
        // this.result // 这个就是base64编码了
        if(index === 0){
          This.imageUrlColor = this.result;
          console.log('handlechange:'+ This.imageUrlColor);
        }else if(index === 1){
          This.imageUrlTexture = this.result;
          console.log('handlechange:'+ This.imageUrlTexture);
        }else{
          This.imageUrlShape = this.result;
          console.log('handlechange:'+ This.imageUrlShape);
        }
        // 因为允许用户自己选择素材库，所以如果在上传之前，用户先选了素材库（会导致imageKeyList对应项有值），那么必须赋予null值
        This.imageKeyList[index] = null;
        console.log('handlechange:'+ This.imageKeyList[index]);
      }
    },
    beforeUploadColor: function(file){
      console.log('beforeUploadColor');
      return this.beforeUpload(file, 0);
    },
    beforeUploadTexture: function(file){
      console.log('beforeUploadTexture');
      return this.beforeUpload(file, 1);
    },
    beforeUploadShape: function(file){
      console.log('beforeUploadShape');
      return this.beforeUpload(file, 2);
    },
    beforeUpload: function (file, index){
      const isJPG = (file.type === "image/jpeg") || (file.type === "image/png");
      console.log("beforeUpload",isJPG)
      if(!isJPG){
        this.$message.error('上传图片只能为JPG或PNG格式');
        this.fileList[index] = [];
        return false;
      }
      console.log(index);
      console.log(this.uploadData[index]);
      this.uploadData[index].key=this.getName(file.name);
      return true;
    },
    //设置上传文件的文件名
    getName: function (name){
      var timestamp = Date.parse(new Date());
      var newName = "inspire_" + timestamp + name;
      console.log("newName",newName);
      return newName;
    },

    handleSuccessColor: function (res, file){
      this.handleSuccess(res, file, 0)
    },
    handleSuccessTexture: function (res, file){
      this.handleSuccess(res, file, 1)
    },
    handleSuccessShape: function (res, file){
      this.handleSuccess(res, file, 2)
    },
    handleSuccess(res, file, index) {
      // console.log("success:",res,file)
      if(index === 0){
        this.imageUrlColor = this.$store.state.domain  + res.key;
      }else if(index === 1){
        this.imageUrlTexture = this.$store.state.domain  + res.key;
      }else{
        this.imageUrlShape = this.$store.state.domain  + res.key;
      }
      this.imageKeyList[index] = res.key;
      console.log('success'+index+this.imageKeyList[index])
      if(index === 0){
        if(this.imageKeyList[1] == null){
          this.$refs.upload2.submit();
        }else if(this.imageKeyList[2] == null){
          this.$refs.upload3.submit();
        }else{
          this.submit();
        }
      }else if(index === 1){
        if(this.imageKeyList[2] == null){
          this.$refs.upload3.submit();
        }else{
          this.submit();
        }
      }else{
        this.submit();
      }
      //2. 将信息传提给后端
    },
    handleError(res){
      console.log("Error:",res);
    },
    handleUpload:function (){
      var cloth = this.selectClothId;
      var color = this.imageUrlColor;
      var texture = this.imageUrlTexture;
      var shape = this.imageUrlShape;
      if(cloth == null){
        this.$message.error("请选择你想要的服装！");
        return;
      }
      if(color === '' || color == null){
        this.$message.error("请上传或选择颜色抽取图像！");
        return;
      }
      if(texture === '' || texture == null){
        this.$message.error("请上传或选择纹理抽取图像！");
        return;
      }
      if(shape === '' || shape == null){
        this.$message.error("请上传或选择形状抽取图像！");
        return;
      }
      console.log('check url and key');
      console.log(this.imageKeyList);
      console.log(this.imageUrlColor);
      console.log(this.imageUrlTexture);
      console.log(this.imageUrlShape);
      //1. 将图片上传到七牛云
      if(this.imageKeyList[0] == null){
        this.$refs.upload1.submit();
      }else if(this.imageKeyList[1] == null){
        this.$refs.upload2.submit();
      }else if(this.imageKeyList[2] == null){
        this.$refs.upload3.submit();
      }else{
        this.submit();
      }
    },

    submit: function (){
      //上传两张图片并返回结果

      // console.log('check url and key 2');
      // console.log(this.imageKeyList);
      // console.log(this.imageUrlColor);
      // console.log(this.imageUrlTexture);
      // console.log(this.imageUrlShape);

      // 测试
      // this.imageUrlColor = 'http://resource.voguexplorer.com/fashion/inspire/cloth/color.jpg';
      // this.imageUrlTexture = 'http://resource.voguexplorer.com/fashion/inspire/cloth/texure.jpg';
      // this.imageUrlShape = 'http://resource.voguexplorer.com/fashion/inspire/cloth/shape.jpg';
      // this.imageKeyList[0] = this.imageUrlColor.slice(33);
      // this.imageKeyList[1] = this.imageUrlTexture.slice(33);
      // this.imageKeyList[2] = this.imageUrlShape.slice(33);

      // 交给后端处理的都是截断后的url
      var sketch = this.selectClothId.slice(33);
      var color= this.imageKeyList[0];
      var texture = this.imageKeyList[1];
      var shape = this.imageKeyList[2];

      let _this=this;
      // 这部分用于结果展示，都是完整的url
      _this.resultSketch = _this.selectClothId;
      _this.resultColor = _this.imageUrlColor;
      _this.resultTexture = _this.imageUrlTexture;
      _this.resultShape = _this.imageUrlShape;
      _this.inspireResult = null

      this.resultLoading = true;
      this.dialogVisible = true;
      var val = {
        sourceImage: sketch,
        colorImage: color,
        colorDgree: _this.sliderValueColor / 100,
        texureImage: texture,
        texureDgree: _this.sliderValueTexture  / 100,
        shapeImage: shape,
        shapeDgree: _this.sliderValueShape / 100,
      }
      console.log(val);
      Inspire(val).then(res=>{
        console.log(res.data);
        _this.inspireResult = res.data.data.result
        _this.resultLoading = false;

      }).catch(res=>{
        console.log("error",res);
        _this.dialogVisible=false;
        showError(_this,res);
      })

      // 测试result面板
      _this.resultLoading = false;


    },

    collect:async function (){
      var res =await this.$refs.inspireResult.collect()
      console.log("design Inspire",res)
      return res
    },

    sure() {
      this.hasSubmit = false;
    },

    selectMaterialColor: function(prev, next){
      this.selectedMaterialColor = this.materialList[prev]
    },
    selectMaterialColor1: function(img){
      this.imageUrlColor = img;
      this.imageKeyList[0] = img.slice(33);
    },
    selectMaterialTexture: function(prev, next){
      this.selectedMaterialTexture = this.materialList[prev]
    },
    selectMaterialTexture1: function(img){
      this.imageUrlTexture = img;
      this.imageKeyList[1] = img.slice(33);
    },
    selectMaterialShape: function(prev, next){
      this.selectedMaterialShape = this.materialList[prev]
    },
    selectMaterialShape1: function(img){
      this.imageUrlShape = img;
      this.imageKeyList[2] = img.slice(33);
    },
    formatTooltip(val) {
      return val / 100;
    }
  },
};
</script>

<style>
@import "../../assets/css/design/inspire.css";
/deep/ .el-collapse-item__header{
  font-size: 15px;
  font-weight: bold;
}
</style>
