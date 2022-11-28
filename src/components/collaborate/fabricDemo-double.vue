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
  </div>
</template>

<script>
import { fabric } from "fabric";
import Toolbar from "./toolbar.vue";
import NavMenu from "./navMenu.vue";
import RightMenu from "./rightSider/RightMenu.vue";
import { insertVersion, insertVersionDouble } from "../../api/collaborateAPI";
import { addEvent, addObj } from "./nav/objFunction";
import { uploadImg } from "./uploadImg";
import AtsButton from "../common/AtsButton.vue";

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
      ]
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
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/collaborate/fabricDemo.css";
.el-dialog {
  min-width: 1000px;
}
</style>
