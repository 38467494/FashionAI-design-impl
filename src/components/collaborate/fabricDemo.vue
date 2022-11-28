<template>
    <div style="min-width: 1200px">

        <el-row type="flex" class="row-bg" justify="space-between">
            <!-- 左侧边栏 -->
            <el-col :span="6" >
                <nav-menu v-bind:canvas="canvas"></nav-menu>

            </el-col>

            <!-- 主页面 -->
            <el-col :span="12">
                <!-- 对canvas上元素操作的工具栏 -->
                <div>
                    <toolbar v-bind:canvas="canvas" @previewCloth="previewCloth"></toolbar>
                </div>
                <div style="height: 10px">

                </div>

                <div class="canvas-container">
                    <div class="palette">
                        <canvas id='main' width="450" height="600"></canvas>
                    </div>
                </div>
            </el-col>

            <!-- 右侧边栏（评论区） -->
            <el-col :span="6">
              <right-menu v-bind:pid="pid"></right-menu>
            </el-col>

            <!--对激活元素的调整-->
        </el-row>

        <el-dialog title="预览" :visible.sync="previewVisible" width="70%" height="300px"
        @opened="handleOpen" style="min-width: 840px">
          <el-row type="flex" style="padding: 0 20px;">
            <el-col :span="6" >
              <h4 >请选择想要的T恤颜色</h4>
              <el-select v-model="clothType" placeholder="请选择服装类型" @change="changeClothType">
                <el-option
                  v-for="(item,index) in clothTypes"
                  :key="index"
                  :label="item"
                  :value="index">
                </el-option>
              </el-select>
              <el-scrollbar style="height: 400px; text-align: center" wrap-style="overflow-x:hidden;">
                <template v-for="item in clothImg" >
                  <div class="clothdiv" @click="selectCloth(item)" :ref="item">
                    <el-image :src="getSrc(item)" :key="item" style="width: 100%"></el-image>
                  </div>

                </template>

              </el-scrollbar>

            </el-col>

            <el-col :span="2">
              <el-divider direction="vertical"></el-divider>
            </el-col>

            <el-col :span="16">
              <h4 >调整图样在衣服上的位置：</h4>
              <div class="preview" v-loading="loading">
                <canvas id='preview' width="300" height="300"></canvas>
              </div>

            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
                <el-button @click="previewVisible = false"> 取消</el-button>
                <el-button type="primary" @click="release">发布</el-button>
            </span>

        </el-dialog>




    </div>
</template>

<script>
import {fabric} from 'fabric';
import Toolbar from './toolbar.vue';
import NavMenu from './navMenu.vue';
import RightMenu from './rightSider/RightMenu.vue';
import {insertVersion} from "../../api/collaborateAPI";
import {addEvent, addObj} from "./nav/objFunction";

export default {
    name: "fabricDemo",
    components: {
        Toolbar,
        NavMenu,
        RightMenu,

    },
    data: function() {
        return {
            canvas: null,
            preview_canvas: null,
            previewVisible: false,
            loading: true,
            uid: 1,
            pid:-1,
          parent_version:-1,  //上一个版本的id
          canvasHeight: 480,
          canvasWidth: 360,

          clothType:0,
          clothTypes:['t恤','POLO衫','卫衣'],

          clothImg:['white.jpg','black.jpg','yellow.jpg','gray.jpg','blue.jpg','green.jpg','purple.jpg','orange.jpg'],
          clothes:[
            ['white.jpg','black.jpg','yellow.jpg','gray.jpg','blue.jpg','green.jpg','purple.jpg','orange.jpg'],
            ['polo-white-front.png'],
            ['Sweatshirts-white-front.png'],
          ],
          selectClothDom: null,


        }
    },
  mounted: function(){
      // var h = document.documentElement.clientWidth;
      // this.canvasHeight = h*0.8;
      // this.canvasWidth = this.canvasHeight /4 * 3;
        this.canvas = new fabric.Canvas('main')
        var _this=this;
        this.canvas.on('selection:cleared',function(){
            _this.$store.commit('changeType',{
                type: null
            });
        })

        var version = this.$store.state.collaborateInfo.version;
        this.pid = this.$store.state.collaborateInfo.pid;
        if(version == null)
          this.parent_version = -1;
        else
          this.parent_version = version.id;
        console.log("fabric pid",this.pid);
        console.log("fabric",version);

        var canvas = version.canvas;
        // console.log(canvas.getObjects());
        if(canvas != null)
          this.canvas.loadFromJSON(canvas,this.canvas.renderAll.bind(this.canvas),function (o,object){
            console.log("load",o,object)
            // if(o.type == "image")
            //   _this.addImgPre(o);
            addEvent(object)
          });

        //更换画布背景
        // this.setCanvasBackground();

    },
    methods:{
      setCanvasBackground(){
        var fabricCanvas = this.canvas;
        var background = fabric.Image.fromURL("/static/gray-white.jpeg",function(oImg){
          //最好canvas的长宽比与img的图片相同
          oImg.scaleToWidth(360)
          oImg.scaleToHeight(480)
          oImg.hasStateChanged = false;
          oImg.lockMovementX = true;
          oImg.lockMovementY =true;
          fabricCanvas.setBackgroundImage(oImg,fabricCanvas.renderAll.bind(fabricCanvas))
        })
        fabricCanvas.renderAll()
      },
      getSrc:function (name){
        return '/static/cloth/'+name;
      },
        //发布作品
        release: function(){
            console.log("release");
            this.previewVisible = false;
            var canvas=JSON.stringify(this.canvas);
            var image = this.preview_canvas.toDataURL('png');


          var version={
            pid: this.pid,
            canvas: canvas,
            image: image,
            parent: this.parent_version
          }

            // console.log("fabric version",version);
          let _this=this;
            insertVersion(version).then(res => {
              console.log('insertVersion',res);
              _this.$message({
                message: '新版本发布成功',
                type: 'success'
              });

              _this.$store.commit("changeCollaborateInfo",{
                version: version,
                vid: version.id
              })

              _this.$router.push({
                name: "collaborate-process",

              })
            })

        },
        previewCloth: function(){
            this.previewVisible = true;

        },

      //打开dialog函数的回调，此时会加载设计图样到衣服上
        handleOpen:function(){
            // this.canvas.setBackgroundImage(null);
            this.dataURL = this.canvas.toDataURL();
            // this.setCanvasBackground();

            if( this.preview_canvas == null)
                this.preview_canvas = new fabric.Canvas('preview')
            //因为在mounted的时候，这个dialog可能还没有被加载出来，这个时候new canvas不会生效，只有当第一次调用dialog时，创建，之后才能持续使用

            var preview_canvas = this.preview_canvas
            preview_canvas.clear()
            // console.log(preview_canvas)

            // var background = fabric.Image.fromURL('/static/pic/t-shirt.jpg',function(oImg){
            //     //最好canvas的长宽比与img的图片相同
            //     oImg.scaleToWidth(300)
            //     oImg.scaleToHeight(300)
            //     oImg.hasStateChanged = false;
            //     oImg.lockMovementX = true;
            //     oImg.lockMovementY =true;
            //     preview_canvas.setBackgroundImage(oImg,preview_canvas.renderAll.bind(preview_canvas))
            // })

            this.selectCloth('white.jpg');
            var img = fabric.Image.fromURL(this.dataURL,function(oImg){
                oImg.scale(0.3);
                oImg.set({
                    left: preview_canvas.width/2,
                    top: preview_canvas.height/2+10,
                    originX: 'center',
                    originY: 'center'
                })
                preview_canvas.add(oImg);
            })

            preview_canvas.renderAll();

            this.loading = false

        },

        processPre: function (){
          var canvas = this.canvas;
          var objs = canvas.getObjects();
          console.log("processPre",objs);
          for(var obj of objs){
            addEvent(obj);
            console.log(obj.type);
          }
        },
        //如果上一版本中存在image类型的obj，需要进行特殊处理
        addImgPre:function (obj){
          var url=obj.src;
          var _canvas=this.canvas;
          fabric.Image.fromURL(url,function(oImg){
            console.log(oImg.width,oImg.height);
            var s = 200 / (oImg.width > oImg.height ? oImg.width : oImg.height) ;
            oImg.scale(s);
            // _canvas.add(oImg);
            addObj(oImg,_canvas)
          })
        },

      selectCloth: function (item){
        var cloth = this.getSrc(item);
        console.log(cloth);
        if(this.selectClothDom !=null)
          this.selectClothDom.className="clothdiv";
        var obj = this.$refs[`${item}`][0];
        obj.className = 'clothdiv-select';
        this.selectClothDom = obj;
        var preview_canvas = this.preview_canvas
        var background = fabric.Image.fromURL(cloth,function(oImg){
          //最好canvas的长宽比与img的图片相同
          oImg.scaleToWidth(300)
          oImg.scaleToHeight(300)
          oImg.hasStateChanged = false;
          oImg.lockMovementX = true;
          oImg.lockMovementY =true;
          preview_canvas.setBackgroundImage(oImg,preview_canvas.renderAll.bind(preview_canvas))
        })
        preview_canvas.renderAll();
      },

      changeClothType: function (){
        var index = this.clothType;
        this.clothImg = this.clothes[index];
        this.selectCloth(this.clothes[index][0]);
      }



    }
}
</script>

<style scoped>
@import "../../assets/css/collaborate/fabricDemo.css";


</style>
