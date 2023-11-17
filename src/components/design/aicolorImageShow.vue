<template>
  <div class="min-h-screen relative my-2">
    <!--      <el-scrollbar :style="height" wrap-style="overflow-x:hidden;">-->
    <template v-for="(item,index) in pageItem">
      <el-row type="flex" :key="index">
        <template v-for="(subitem,subindex) in item">
          <el-col :span="width" :key="subindex">
            <div class="show-card" style="padding: 10px;" @click="select($event,subitem,index*4+subindex)" :class="getClass(index*4+subindex)">
              <el-image :src="subitem" v-if="subitem!==''" fit="fill"></el-image>
              <el-upload
                v-else
                class="avatar-uploader w-full h-auto"
                ref="uploadsub"
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
                <el-image v-if="modelUrl" :src="modelUrl" class="avatar items-start" fit="contain">
                </el-image>
                <div v-else
                     class="uploader-tips mx-auto flex flex-col items-center justify-center text-center"
                >
                  <i class="uploader-tips-txt bi bi-plus-circle "></i>
                  <p class="uploader-tips-txt">上传本地模特图像</p>
                </div>

              </el-upload>
            </div>

          </el-col>
        </template>
      </el-row>
    </template>
    <!--      </el-scrollbar>-->

    <!-- 分页组件使用position:absolute相对于父组件进行绝对定位，使用transform保证位置居中 -->
    <el-pagination
      layout="prev, pager, next"
      :total="total" :page-size = "pageSize" @current-change="changePage" v-if="total>0">
    </el-pagination>
    <p style="color: #8c939d" v-else>暂无数据</p>
  </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import {showError} from "./alert";
import AtsButton from "../common/AtsButton";
import {getUploadToken} from "../../api/design";
export default {
  name:"aicolorImageShow",
  components: {AtsButton},
  props:{
    name:{
      type: String,
      default: null
    },
    module:{
      type: String,
      default: null,
    },
    urls:{
      type: Array,
      default:[]
    },
    index:{
      type:Number,
      default:-1,
    },
    height:{
      type:String,
      default:"height: 500px;"
    },
    isDescriptionVisible: {
      type: Boolean,
      default: false,
    },
    isPriceVisible: {
      type: Boolean,
      default: false,
    },
    // description:{
    //   type: Array,
    //   default:[]
    // },
    // price:{
    //   type: Array,
    //   default:[]
    // },

  },
  mounted: function(){
    // this.getFiles();
    //接收从前端传递来的name（衣服种类）,module:调用的模块（对应与哪个模型）
    console.log(this.name);
    console.log(this.module);

    console.log(this.urls)
    //这里需要添加一个接口，向后端请求对应衣服种类的图片
    //获取后可以使用divide函数将数组划分并显示

    console.log(this.height);

    this.width = 24 / this.cols

    this.total = this.urls.length
    this.pageSize = this.rows * this.cols


    this.divide(this.urls,this.rows,this.cols);

    this.changePage(1)

    let _this=this;
    getUploadToken({
      forever: false
    }).then(res=>{
      console.log("getUploadToken:",res.data);
      _this.uploadData.token = res.data;
    })
    console.log('看看token1',this.uploadData.token);

  },
  data: function(){
    return {
      // urls: [],
      divided_URLs:[],

      width: 6,
      selected: null,  //存放被选中的dom元素，用于样式的修改
      fileNames: [],
      rows:3,
      cols:4,
      pageItem:[],
      total:0,
      pageSize:0,
      page: 1,
      isActive:"img-div-selected",

      fileList:[],
      modelUrl :null, //模特图片在七牛云上的url，通过这个url可以直接访问到图片
      modelKey:null,  //模特图片上传到七牛云上，返回的key
      uploadData: {
        token:"",
        key:""
      },

    }
  },
  // watch:{
  //   urls:{
  //     handler(newValue,oldValue){
  //
  //       this.load();
  //     },
  //     deep:true,
  //     immediate:false,
  //   }
  // },
  methods:{

    load: function (){
      // this.getFiles();
      //接收从前端传递来的name（衣服种类）,module:调用的模块（对应与哪个模型）
      console.log(this.name);
      console.log(this.module);

      console.log(this.urls)
      //这里需要添加一个接口，向后端请求对应衣服种类的图片
      //获取后可以使用divide函数将数组划分并显示

      console.log(this.height);

      this.width = 24 / this.cols

      this.total = this.urls.length
      this.pageSize = this.rows * this.cols


      this.divide(this.urls,this.rows,this.cols);

      this.changePage(1)
    },

    select:function (e,url,index){
      if(url == '/static/transparent.png')
        return;

      index = (this.page -1 )*this.pageSize + index
      this.selected = index;
      console.log('select触发')
      // 如果index=0，那么不在这里回调，而是在upload触发success后
      if(index > 0) {
        // console.log("select",index)
        //match
        // 清空upload框
        this.fileList = [];
        this.modelUrl = '';
        if(this.module == "match")
          this.$emit('selectCloth',e.currentTarget,this.index,index,this.name);
        else if(this.module == "recommendation"){
          console.log("recommendation",this.name)
          this.$emit('selectCloth',e.currentTarget,index,this.name,);
        }
        else if(this.module == "render"){
          this.$emit("selectCloth",e.currentTarget,index,this.name);
        }
        else if(this.module == "vton"){
          this.$emit("selectCloth",e.currentTarget,index,this.name);
        }
        else if(this.module == "aicolor"){
          this.$emit("selectCloth",e.currentTarget,index,this.name);
        }
      }
      else{
        this.$emit("selectCloth",e.currentTarget,0,this.name,'border');
      }
    },

    //根据给定的列数col将数组进行划分，用于显示
    // divide:function(arr,row,col){
    //   var divideArr = [];
    //   for(var i=0;i<arr.length;i+=row*col){
    //     //分页
    //     var page=[]
    //     for(var j=0;j<row*col && i+j<arr.length;j+=col){
    //       var rowArr=[]
    //       for(var k=0; k <col && i+j+ k< arr.length;k++){
    //         rowArr.push(arr[i+j+k]);
    //       }
    //       page.push(rowArr)
    //     }
    //     divideArr.push(page)
    //   }
    //   //多页时，保证显示部分高度相同
    //   if(divideArr.length > 1){
    //     var last = divideArr.length-1;
    //     var page = divideArr[last];
    //     var img = '/static/transparent.png';
    //     //将上一行补齐
    //     if(page[page.length-1].length < col){
    //       for(var i=page[page.length-1].length;i<col;i++){
    //         page[page.length-1].push(img);
    //       }
    //     }
    //     var rowArr=[]
    //     for(var i=0;i<col;i++)
    //       rowArr.push(img);
    //     for(var i=page.length;i<row;i++){
    //       page.push(rowArr)
    //     }
    //     divideArr[last]=page;
    //   }
    //
    //   this.divided_URLs = divideArr;
    //
    //   console.log("divideurl",this.divided_URLs)
    // },

    // 改写divide，在urls前面加一个空白，那个位置使用upload组件支持用户上传
    divide:function(arr,row,col){
      var arr_beta = [];
      arr_beta.push('');// 哨兵空串
      for(var i=0;i<arr.length;i++){
        arr_beta.push(arr[i]);
      }

      var divideArr = [];
      for(var i=0;i<arr_beta.length;i+=row*col){
        //分页
        var page=[]
        for(var j=0;j<row*col && i+j<arr_beta.length;j+=col){
          var rowArr=[]
          for(var k=0; k <col && i+j+ k< arr_beta.length;k++){
            rowArr.push(arr_beta[i+j+k]);
          }
          page.push(rowArr)
        }
        divideArr.push(page)
      }
      //多页时，保证显示部分高度相同
      if(divideArr.length > 1){
        var last = divideArr.length-1;
        var page = divideArr[last];
        var img = '/static/transparent.png';
        //将上一行补齐
        if(page[page.length-1].length < col){
          for(var i=page[page.length-1].length;i<col;i++){
            page[page.length-1].push(img);
          }
        }
        var rowArr=[]
        for(var i=0;i<col;i++)
          rowArr.push(img);
        for(var i=page.length;i<row;i++){
          page.push(rowArr)
        }
        divideArr[last]=page;
      }

      this.divided_URLs = divideArr;

      console.log("divideurl",this.divided_URLs)
    },

    changePage:function (page){
      // console.log("change page",page,this.page)
      this.page = page
      this.pageItem = this.divided_URLs[page-1];
      // console.log("change page",page,this.page)
    },
    getClass: function (index){
      console.log("getClass",index, this.selected)
      index = (this.page -1 )*this.pageSize + index
      if(index == this.selected)
        return "img-div-selected";
      else
        return "img-div";
    },

    // upload相关钩子
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
        This.modelUrl = this.result;
        This.$emit("selectCloth",'',0,This.name, 'change',This.modelUrl);
      }
    },

    handleRemove:function (file){
      console.log('remove',file);
      this.modelUrl = '';
      this.modelKey = null;
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
      // console.log("newName",newName);
      return newName;
    },

    handleSuccess(res,file) {
      console.log("success:",res,file)
      this.modelUrl =this.$store.state.domain  + res.key;
      this.modelKey = res.key;
      this.$emit("selectCloth",'',0,this.name,'success',this.modelUrl);
    },

    handleUploadModel:function (){
      // 子组件中的upload组件（孙子组件）也在循环体里面，所以要加index，而v-else的情况才出现upload组件，因此index始终为0
      console.log('看看token2', this.uploadData.token);
      this.$refs.uploadsub[0].submit();
    },

    handleError(res){
      console.log("Error:",res );
    },

    testFunction: function (){
      console.log('子组件函数test');
    }

  }
}
</script>

<style scoped>
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
.el-upload-aicolor{
  height: 100%;
  width: 100%;
}
</style>
