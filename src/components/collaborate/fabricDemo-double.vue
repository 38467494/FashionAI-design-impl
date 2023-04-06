<template>
  <div style="min-width: 1200px">
    <section class="flex row-bg" justify="space-between">
      <!-- 左侧边栏 -->
      <section class="basis-1/4">
        <nav-menu v-bind:canvas="canvas"></nav-menu>
      </section>

      <!-- 主页面 -->
      <section class="grow p-5 flex flex-col gap-y-3">
        <!-- 对canvas上元素操作的工具栏 -->
        <section>
          <toolbar
            v-bind:canvas="canvas"
            @previewCloth="previewCloth"
            @renderCloth="renderCloth"
          ></toolbar>
        </section>
        <section>
          <el-tabs tab-position="left" @tab-click="selectTab">
            <el-tab-pane label="正面">
              <div class="canvas-container">
                <div class="palette border-2 rounded-md">
                  <canvas id="main-front" width="450" height="600"></canvas>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="反面">
              <div class="palette border-2 rounded-md">
                <canvas id="main-back" width="450" height="600"></canvas>
              </div>
            </el-tab-pane>
          </el-tabs>
        </section>
      </section>

      <!-- 右侧边栏（评论区） -->
      <!-- <div class="basis-1/4">
              <right-menu v-bind:pid="pid"></right-menu>
            </div> -->

      <!--对激活元素的调整-->
    </section>

    <el-dialog
      title="预览"
      :visible.sync="previewVisible"
      customClass="dialog-custom"
      width="1000px"
      @opened="handleOpen"
    >
      <!-- <el-row type="flex" style="padding: 0 20px;min-width: 1000px"> -->
      <div class="flex divide-x px-6">
        <div class="basis-1/3 px-4 flex flex-col gap-y-3">
          <div class="text-black font-bold text-lg text-left">请选择想要的T恤颜色</div>
          <el-select
            v-model="clothType"
            placeholder="请选择服装类型"
            @change="changeClothType"
          >
            <el-option
              v-for="(item, index) in clothTypes"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
          <el-scrollbar
            style="height: 400px; text-align: center"
            wrap-style="overflow-x:hidden;"
          >
            <template v-for="item in clothImg">
              <div class="clothdiv" @click="selectCloth(item)" :ref="item">
                <el-image
                  :src="getSrc(item + '-front.png')"
                  :v-if="getSrc(item + '-front.png')"
                  :key="item"
                  style="width: 100%"
                ></el-image>
              </div>
            </template>
          </el-scrollbar>
        </div>

        <div class="basis-2/3 px-4">
          <el-tooltip content="拖动图样" placement="top">
            <div class="mb-2 text-black font-bold text-lg">调整图样在衣服上的位置</div>
          </el-tooltip>

          <el-dropdown @command="changeLocation">
            <span class="mb-2 el-dropdown-link">
              预设图样位置
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>

            <el-dropdown-menu slot="dropdown">
              <template v-for="(item, index) in locationList">
                <el-dropdown-item :key="index" :command="item">
                  {{ item.label }}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>

          <div class="flex">
            <div class="basis-1/2">
              <el-tag class="mt-2 mb-1">正面</el-tag>
              <div class="preview border-2 rounded m-2" v-loading="loading">
                <canvas id="preview-front" width="300" height="342"></canvas>
              </div>
            </div>

            <div class="basis-1/2">
              <el-tag class="mt-2 mb-1">背面</el-tag>
              <div class="preview border-2 rounded m-2" v-loading="loading">
                <canvas id="preview-back" width="300" height="342"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <AtsButton type="pink" plain @click="previewVisible = false"> 取消</AtsButton>
        <AtsButton type="primary" @click="release">保存</AtsButton>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="renderVisible"
      v-loading="renderLoading"
      customClass="dialog-custom"
      width="1400px"
      @opened="handleRender"
    >
      <template #title>
        <div class="text-left font-bold text-2xl px-5 py-2">AI渲染界面</div>
      </template>
      <div class="flex divide-x px-6">
        <section class="basis-1/2 flex flex-col justify-start mr-4 ">
          <section class="basis-1/2">
            <div class="sm-caption" style="text-align: left">原图像</div>
            <el-image
              :src="imgToRender"
              v-if="imgToRender"
            >
            </el-image>
          </section>
          <section class="basis-1/2">
            <div class="sm-caption" style="text-align: left">渲染结果</div>
            <el-image
              :src="imgRendered"
              v-if="imgRendered"
              :loading="resultLoading"
            >
            </el-image>
          </section>
        </section>
        <section class="basis-1/2 flex flex-col justify-start mr-4 items-stretch">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="颜色" name="1" style="margin: 10px">
<!--              <template slot="title" style="font-size: 100px">-->
<!--                颜色-->
<!--              </template>-->
              <div class="flex">
                <div class="basis-2/3">
                  <div style="text-align: left; padding-left: 50px">素材库</div>
                  <el-carousel :autoplay="false" type="card" height="100px" @change="((prev,next) => selectMaterialColor(prev, next))">
                    <el-carousel-item v-for="item in materialList" :key="item">
                      <el-image :src="item" class="avatarCollaborate" fit="contain" @click="selectMaterialColor1(item)"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="basis-1/3 flex-col">
                  <el-upload
                    class="avatar-uploaderCollaborate w-full h-auto"
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
                    <el-image v-if="imageUrlColor" :src="imageUrlColor" class="avatarCollaborate" fit="contain">
                    </el-image>
                    <div v-else
                         class="uploaderCollaborate-tips mx-auto flex flex-col items-center justify-center text-center"
                    >
                      <i class="uploaderCollaborate-tips-txt bi bi-plus-circle "></i>
                      <p class="uploaderCollaborate-tips-txt">上传图片</p>
                    </div>
                  </el-upload>
                  <div style="text-align: left">渲染程度</div>
                  <el-slider v-model="sliderValueColor" :format-tooltip="formatTooltip"></el-slider>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="纹理" name="2" style="margin: 10px">
              <div class="flex">
                <div class="basis-2/3">
                  <div style="text-align: left; padding-left: 50px">素材库</div>
                  <el-carousel :autoplay="false" type="card" height="100px" @change="((prev,next) => selectMaterialTexture(prev, next))">
                    <el-carousel-item v-for="item in materialList" :key="item">
                      <el-image :src="item" class="avatarCollaborate" fit="contain" @click="selectMaterialTexture1(item)"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="basis-1/3 flex-col">
                  <el-upload
                    class="avatar-uploaderCollaborate w-full h-auto"
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
                    <el-image v-if="imageUrlTexture" :src="imageUrlTexture" class="avatarCollaborate" fit="contain">
                    </el-image>
                    <div v-else
                         class="uploaderCollaborate-tips mx-auto flex flex-col items-center justify-center text-center"
                    >
                      <i class="uploaderCollaborate-tips-txt bi bi-plus-circle "></i>
                      <p class="uploaderCollaborate-tips-txt">上传图片</p>
                    </div>
                  </el-upload>
                  <div style="text-align: left">渲染程度</div>
                  <el-slider v-model="sliderValueTexture" :format-tooltip="formatTooltip"></el-slider>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="形状" name="3" style="margin: 10px">
              <div class="flex">
                <div class="basis-2/3">
                  <div style="text-align: left; padding-left: 50px">素材库</div>
                  <el-carousel :autoplay="false" type="card" height="100px" @change="((prev,next) => selectMaterialShape(prev, next))">
                    <el-carousel-item v-for="item in shapeList" :key="item">
                      <el-image :src="item" class="avatarCollaborate" fit="contain" @click="selectMaterialShape1(item)"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="basis-1/3 flex-col">
                  <el-upload
                    class="avatar-uploaderCollaborate w-full h-auto"
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
                    <el-image v-if="imageUrlShape" :src="imageUrlShape" class="avatarCollaborate" fit="contain">
                    </el-image>
                    <div v-else
                         class="uploaderCollaborate-tips mx-auto flex flex-col items-center justify-center text-center"
                    >
                      <i class="uploaderCollaborate-tips-txt bi bi-plus-circle "></i>
                      <p class="uploaderCollaborate-tips-txt">上传图片</p>
                    </div>
                  </el-upload>
                  <div style="text-align: left">渲染程度</div>
                  <el-slider v-model="sliderValueShape" :format-tooltip="formatTooltip"></el-slider>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </section>
      </div>
      <div slot="footer" class="dialog-footer flex justify-end">
        <AtsButton type="pink" plain @click="renderVisible = false"> 取消</AtsButton>
        <AtsButton type="primary" @click="finishAIRender">确定</AtsButton>
        <AtsButton style="background-color: green; color: white" @click="handleUpload">开始渲染</AtsButton>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { fabric } from "fabric";
import Toolbar from "./toolbar.vue";
import NavMenu from "./navMenu.vue";
import RightMenu from "./rightSider/RightMenu.vue";
import { insertVersion, insertVersionDouble } from "../../api/collaborateAPI";
import { addEvent, addObj } from "./nav/objFunction";
import { uploadImg, uploadSourceImage} from "./uploadImg";
import AtsButton from "../common/AtsButton.vue";
import {getUploadToken, Inspire} from "../../api/design";
import {showError} from "../design/alert";

export default {
  name: "fabricDemoDouble",
  components: {
    Toolbar,
    NavMenu,
    RightMenu,
    AtsButton
  },
  data: function() {
    return {
      canvas: null,
      frontCanvas: null,
      backCanvas: null,
      frontPreviewCanvas: null,
      backPreviewCanvas: null,
      preview_canvas: null,
      previewVisible: false,
      loading: true,
      uid: 1,
      pid: -1,
      parent_version: -1, //上一个版本的id
      canvasHeight: 480,
      canvasWidth: 360,

      clothType: 0,
      clothTypes: ["t恤", "POLO衫", "卫衣"],

      clothImg: ["white", "black"],
      clothes: [
        [
          this.$store.state.domain + "/fashion/collaborate/cloth/white",
          this.$store.state.domain + "/fashion/collaborate/cloth/black"
        ],
        [
          this.$store.state.domain + "/fashion/collaborate/cloth/polo-white",
          this.$store.state.domain + "/fashion/collaborate/cloth/polo-black"
        ],
        [
          this.$store.state.domain +
            "/fashion/collaborate/cloth/Sweatshirts-white",
          this.$store.state.domain +
            "/fashion/collaborate/cloth/Sweatshirts-black"
        ]
      ],
      selectClothDom: null,

      locationList: [
        {
          isFront: true,
          loc: 1, //1:居中，2：左上角
          label: "衣服正面-图样居中"
        },
        {
          isFront: true,
          loc: 2, //1:居中，2：左上角
          label: "衣服正面-图样左上角"
        },
        {
          isFront: false,
          loc: 1, //1:居中，2：左上角
          label: "衣服背面-图样居中"
        },
        {
          isFront: false,
          loc: 2, //1:居中，2：左上角
          label: "衣服背面-图样左上角"
        }
      ],

      // AI渲染相关，和灵感迁移差不多
      renderVisible: false,
      renderLoading: false,
      imgToRender: null,
      imgRendered: null,
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
      imageUrlColor: null,
      imageUrlTexture: null,
      imageUrlShape: null,
      imageKeyList:[null, null, null],
      fileList:[[],[],[]],
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
    };
  },
  mounted: function() {
    // var h = document.documentElement.clientWidth;
    // this.canvasHeight = h*0.8;
    // this.canvasWidth = this.canvasHeight /4 * 3;
    this.frontCanvas = new fabric.Canvas("main-front");
    this.backCanvas = new fabric.Canvas("main-back");
    var _this = this;
    this.frontCanvas.on("selection:cleared", function() {
      _this.$store.commit("changeType", {
        type: null
      });
    });

    var version = this.$store.state.collaborateInfo.version;
    this.pid = this.$store.state.collaborateInfo.pid;
    if (version == null) this.parent_version = -1;
    else this.parent_version = version.id;
    console.log("fabric pid", this.pid);
    console.log("fabric", version);

    var canvas = version.canvas;
    // console.log(canvas.getObjects());
    if (canvas != null)
      this.frontCanvas.loadFromJSON(
        canvas,
        this.frontCanvas.renderAll.bind(this.frontCanvas),
        function(o, object) {
          console.log("load", o, object);
          // if(o.type == "image")
          //   _this.addImgPre(o);
          addEvent(object);
        }
      );

    var canvas = version.backCanvas;
    // console.log(canvas.getObjects());
    if (canvas != null)
      this.backCanvas.loadFromJSON(
        canvas,
        this.backCanvas.renderAll.bind(this.backCanvas),
        function(o, object) {
          console.log("load", o, object);
          // if(o.type == "image")
          //   _this.addImgPre(o);
          addEvent(object);
        }
      );

    //更换画布背景
    // this.setCanvasBackground();

    this.canvas = this.frontCanvas;

    this.clothImg = this.clothes[0];

    // AI渲染，下载需要
    getUploadToken({
      forever: false
    }).then(res=>{
      console.log("getUploadToken:",res.data);
      _this.uploadData[0].token = res.data;
      _this.uploadData[1].token = res.data;
      _this.uploadData[2].token = res.data;

    })
  },
  methods: {
    selectTab: function(tab) {
      var index = tab.index;
      if (index == "0") this.canvas = this.frontCanvas;
      else this.canvas = this.backCanvas;
      console.log(index, this.canvas);
    },
    setCanvasBackground() {
      var fabricCanvas = this.canvas;
      var background = fabric.Image.fromURL(
        "/static/gray-white.jpeg",
        function(oImg) {
          //最好canvas的长宽比与img的图片相同
          oImg.scaleToWidth(360);
          oImg.scaleToHeight(480);
          oImg.hasStateChanged = false;
          oImg.lockMovementX = true;
          oImg.lockMovementY = true;
          fabricCanvas.setBackgroundImage(
            oImg,
            fabricCanvas.renderAll.bind(fabricCanvas)
          );
        },
        { crossOrigin: "anonymous" }
      );
      fabricCanvas.renderAll();
    },
    getSrc: function(name) {
      return name;
    },
    //发布作品
    release: async function() {
      console.log("release");
      this.previewVisible = false;
      var frontCanvas = JSON.stringify(this.frontCanvas);
      var backCanvas = JSON.stringify(this.backCanvas);
      var front = this.frontPreviewCanvas.toDataURL("png");
      var back = this.backPreviewCanvas.toDataURL("png");
      var frontURL = await uploadImg(this.pid, "front", front);
      var backURL = await uploadImg(this.pid, "back", back);
      console.log("fabric URL", frontURL, backURL);

      var version = {
        pid: this.pid,
        canvas: frontCanvas,
        backCanvas: backCanvas,
        frontImage: frontURL,
        backImage: backURL,
        parent: this.parent_version
      };

      // console.log("fabric version",version);
      let _this = this;
      insertVersionDouble(version).then(res => {
        console.log("insertVersion", res);
        _this.$message({
          message: "新版本发布成功",
          type: "success"
        });

        _this.$store.commit("changeCollaborateInfo", {
          version: version,
          vid: version.id
        });

        _this.$router.push({
          name: "collaborate-process"
        });
      });
    },
    previewCloth: function() {
      this.previewVisible = true;
    },
    renderCloth: function (){
      console.log("renderCloth");
      this.imgRendered = null;
      this.renderVisible = true;
    },

    loadPreview: function(canvas, preview, dir) {
      var dataURL = canvas.toDataURL();
      // this.setCanvasBackground();

      var previewId = "preview-" + dir;

      if (preview == null) preview = new fabric.Canvas(previewId);
      //因为在mounted的时候，这个dialog可能还没有被加载出来，这个时候new canvas不会生效，只有当第一次调用dialog时，创建，之后才能持续使用

      preview.clear();
      console.log("load Preview", preview);

      // var background = fabric.Image.fromURL('/static/pic/t-shirt.jpg',function(oImg){
      //     //最好canvas的长宽比与img的图片相同
      //     oImg.scaleToWidth(300)
      //     oImg.scaleToHeight(300)
      //     oImg.hasStateChanged = false;
      //     oImg.lockMovementX = true;
      //     oImg.lockMovementY =true;
      //     preview_canvas.setBackgroundImage(oImg,preview_canvas.renderAll.bind(preview_canvas))
      // })

      var img = "white-" + dir + ".png";

      // 居中
      var img = fabric.Image.fromURL(
        dataURL,
        function(oImg) {
          oImg.scale(0.3);
          oImg.set({
            left: preview.width / 2,
            top: preview.height / 2 + 10,
            originX: "center",
            originY: "center"
          });
          preview.add(oImg);
        },
        { crossOrigin: "anonymous" }
      );

      //左上角
      // var img = fabric.Image.fromURL(dataURL,function(oImg){
      //   oImg.scale(0.1);
      //   oImg.set({
      //     left: preview.width/5 * 3 -5,
      //     top: preview.height/4,
      //     // originX: 'center',
      //     // originY: 'center'
      //   })
      //   preview.add(oImg);
      // })

      preview.renderAll();

      return preview;
    },

    //打开dialog函数的回调，此时会加载设计图样到衣服上
    handleOpen: function() {
      this.frontPreviewCanvas = this.loadPreview(
        this.frontCanvas,
        this.frontPreviewCanvas,
        "front"
      );
      this.backPreviewCanvas = this.loadPreview(
        this.backCanvas,
        this.backPreviewCanvas,
        "back"
      );

      this.selectCloth(
        this.$store.state.domain + "/fashion/collaborate/cloth/white"
      );

      this.loading = false;
    },

    // AI渲染打开dialog，将画布加载为一张图片
    handleRender: function (){
      this.imgToRender = this.canvas.toDataURL();
    },

    processPre: function() {
      var canvas = this.canvas;
      var objs = canvas.getObjects();
      console.log("processPre", objs);
      for (var obj of objs) {
        addEvent(obj);
        console.log(obj.type);
      }
    },
    //如果上一版本中存在image类型的obj，需要进行特殊处理
    addImgPre: function(obj) {
      var url = obj.src;
      var _canvas = this.canvas;
      fabric.Image.fromURL(
        url,
        function(oImg) {
          console.log(oImg.width, oImg.height);
          var s = 200 / (oImg.width > oImg.height ? oImg.width : oImg.height);
          oImg.scale(s);
          // _canvas.add(oImg);
          addObj(oImg, _canvas);
        },
        { crossOrigin: "anonymous" }
      );
    },

    //选择不同的服装（更换preview的background）
    selectCloth: function(item) {
      console.log("selectCloth", item);
      var frontImg = this.getSrc(item + "-front.png");
      var backImg = this.getSrc(item + "-back.png");
      // var cloth = this.getSrc(item);
      // console.log(cloth);
      if (this.selectClothDom != null)
        this.selectClothDom.className = "clothdiv";
      var obj = this.$refs[`${item}`][0];
      obj.className = "clothdiv-select";
      this.selectClothDom = obj;
      var preview_canvas = this.frontPreviewCanvas;
      var front = fabric.Image.fromURL(
        frontImg,
        function(oImg) {
          //最好canvas的长宽比与img的图片相同
          oImg.scaleToWidth(300);
          oImg.scaleToHeight(342);
          oImg.hasStateChanged = false;
          oImg.lockMovementX = true;
          oImg.lockMovementY = true;
          preview_canvas.setBackgroundImage(
            oImg,
            preview_canvas.renderAll.bind(preview_canvas)
          );
        },
        { crossOrigin: "anonymous" }
      );
      preview_canvas.renderAll();

      var back_preview_canvas = this.backPreviewCanvas;
      var back = fabric.Image.fromURL(
        backImg,
        function(oImg) {
          //最好canvas的长宽比与img的图片相同
          oImg.scaleToWidth(300);
          oImg.scaleToHeight(342);
          oImg.hasStateChanged = false;
          oImg.lockMovementX = true;
          oImg.lockMovementY = true;
          back_preview_canvas.setBackgroundImage(
            oImg,
            back_preview_canvas.renderAll.bind(back_preview_canvas)
          );
        },
        { crossOrigin: "anonymous" }
      );
      back_preview_canvas.renderAll();
    },

    changeClothType: function() {
      var index = this.clothType;
      this.clothImg = this.clothes[index];
      this.selectCloth(this.clothes[index][0]);
    },

    //更换预设服装位置：判断画布以及位置信息
    changeLocation: function(item) {
      console.log("changeLocation", item);
      var canvas = null;
      if (item.isFront) canvas = this.frontPreviewCanvas;
      else canvas = this.backPreviewCanvas;

      var obj = canvas.getObjects()[0];
      if (item.loc == 1) {
        this.assignCenter(canvas, obj);
        this.$message({
          message: "图样已居中",
          type: "success"
        });
      } else if (item.loc == 2) {
        this.assignLeftTop(canvas, obj);
        this.$message({
          message: "图样已挪至左上角",
          type: "success"
        });
      }
    },
    assignLeftTop: function(canvas, obj) {
      obj.scale(0.1);
      obj.set({
        left: (canvas.width / 5) * 3 + 15,
        top: canvas.height / 3
      });
      canvas.renderAll();
    },
    assignCenter: function(canvas, obj) {
      obj.scale(0.3);
      obj.set({
        left: canvas.width / 2,
        top: canvas.height / 2 + 10,
        originX: "center",
        originY: "center"
      });
      canvas.renderAll();
    },

    // AI渲染相关
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
    },
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
      var cloth = this.imgToRender;
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
    submit: async function (){
      // 交给后端处理的都是截断后的url
      var imgToRenderUrl = await uploadSourceImage(this.imgToRender);
      console.log(imgToRenderUrl);
      var sketch = imgToRenderUrl.slice(33);
      var color= this.imageKeyList[0];
      var texture = this.imageKeyList[1];
      var shape = this.imageKeyList[2];

      let _this=this;
      // 这部分用于结果展示，都是完整的url
      _this.resultSketch = _this.imgToRender;
      _this.resultColor = _this.imageUrlColor;
      _this.resultTexture = _this.imageUrlTexture;
      _this.resultShape = _this.imageUrlShape;
      _this.inspireResult = null

      this.renderLoading = true;

      var val = {
        sourceImage: sketch,
        colorImage: color,
        colorDgree: _this.sliderValueColor / 100,
        texureImage: texture,
        texureDgree: _this.sliderValueTexture  / 100,
        shapeImage: shape,
        shapeDgree: _this.sliderValueShape / 100,
      }
      Inspire(val).then(res=>{
        console.log(res.data);
        // _this.inspireResult = res.data.data.result
        _this.renderLoading = false;
        _this.imgRendered = res.data.data.result;
      }).catch(res=>{
        console.log("error",res);
        showError(_this,res);
      })
      // 测试result面板
      _this.resultLoading = false;
    },
    finishAIRender: function (){
      var _canvas = this.canvas;
      if(this.imgRendered){
        _canvas.clear();
        fabric.Image.fromURL(
          this.imgRendered,
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
        this.imgRendered = null;
      }
      this.renderVisible = false;
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/collaborate/fabricDemo.css";
.el-dialog {
  min-width: 1000px;
}
/deep/ .el-collapse-item__header{
  font-size: 15px;
  font-weight: bold;
}
</style>
