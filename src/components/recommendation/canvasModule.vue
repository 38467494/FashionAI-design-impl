<template>
  <!-- 画布模块 -->
  <div class="flex flex-col">
    <!-- 对画布元素操作的工具栏 -->
    <div class="text-left font-bold text-2xl border-b pb-2">搭配推荐</div>
    <div class="canvas-tool-bar my-2" >
      <div class="flex">
        <rec-canvas-tool-bar
          :canvas="canvas"
          :canvasHistory="canvasHistory"
          :mods="mods"
          @changeMods="changeMods"
          ref="recCanvasToolBar"
        ></rec-canvas-tool-bar>
      </div>
      <suit-save-dialog
        :canvas="canvas"
        :status="dialogStatus"
        ref="suitSaveDialog"
      ></suit-save-dialog>
      <rec-suit-draft
        @loadFromDraft="loadFromDraft"
        ref="recSuitDraft"
      ></rec-suit-draft>
    </div>
    <div  id="canvas-container">
      <canvas id="canvas" height="480"></canvas>
    </div>
    <div class="my-2 flex justify-end">
      <AtsButton type="silent" @click="drawerPop">导入草稿</AtsButton>
      <AtsButton type="primary" plain @click="draftDialogFormPop"
        >保存草稿</AtsButton
      >
      <AtsButton type="primary" @click="submitDialogFormPop"
        >收藏作品</AtsButton
      >
    </div>
  </div>
</template>
<script>
import { fabric } from "fabric";
import SuitSaveDialog from "./suitSaveDialog.vue";
import RecCanvasToolBar from "./recCanvasToolBar.vue";
import recSuitDraft from "./recSuitDraft.vue";
import AtsButton from "../common/AtsButton.vue";

export default {
  name: "CanvasModule",
  components: {
    SuitSaveDialog,
    RecCanvasToolBar,
    recSuitDraft,
    AtsButton
  },
  data: function() {
    return {
      //// 草稿抽屉
      drawer: false,
      //// 画布
      canvas: null, // 画布
      // 工具栏
      canvasHistory: [], // 画布历史状态列表
      mods: -1, // 画布当前状态index
      //// 预览弹框
      dialogStatus: 0, // 草稿或发布
      dialogFormVisible: false, // 控制弹框显示
      suitForm: {
        name: "",
        description: ""
      }
    };
  },
  methods: {
    /* 初始化canvas */
    initCanvas() {
      // canvas宽高自适应，宽度和容器相近，宽高比5:3
      let canvasContainer = document.getElementById("canvas-container");
      console.log("canvasContainer: ", canvasContainer);
      console.log("canvasContainerWidth: ", canvasContainer.offsetWidth);
      console.log("canvasContainerHeight: ", canvasContainer.offsetHeight);
      this.canvas = new fabric.Canvas("canvas", {
        selectable: true,
        height: ((canvasContainer.offsetWidth - 5) / 5) * 3,
        width: canvasContainer.offsetWidth - 3
        // selection: true, // TOFIX: 有啥用？
      });
      // 添加canvas的HTML原生拖放事件（dragstart、dragend已经绑定在图片上）
      canvasContainer.addEventListener("dragenter", this.handleDragEnter);
      canvasContainer.addEventListener("dragover", this.handleDragOver);
      canvasContainer.addEventListener("drop", this.handleDrop);
      this.canvas.on({
        "object:modified": () => {
          // 画布状态记录：对象变化（移动、旋转、缩放）时触发
          // 不能在object:removed上加：在undo清空canvas时removed也会被触发
          // 不能在object:added上加
          console.log("object:modified");
          this.updateModifications();
        }
      });
      ///// 非常坑：用原生的toJSON方法，手动添加的属性无法被导出，导致画布历史记录中并未包含这些信息，进而从历史记录中读出来的画布对象没法被推荐模块识别
      ///// 因此重写canvas的toJSON方法，把这些属性再次手动添加到导出的JSON对象中
      this.canvas.toJSON = (function(toJSON) {
        return function() {
          console.log("toJSON this", toJSON.call(this));
          let that = toJSON.call(this); //无法直接修改toJSON.call(this)
          for (var i = 0; i < this._objects.length; i++) {
            let obj = this._objects[i];
            console.log("obj", obj);
            that.objects[i].id = obj.id;
            that.objects[i].categoryId = obj.categoryId;
            that.objects[i].price = obj.price;
            that.objects[i].recCategory = obj.recCategory;
            that.objects[i].imgUrl = obj.imgUrl;
          }
          return that;
        };
      })(this.canvas.toJSON);
    },
    /** 保存canvas历史记录 */
    updateModifications() {
      this.mods += 1;
      if (this.mods <= this.canvasHistory.length - 1) {
        // 加入新的元素后，把后面的内容都清除
        this.canvasHistory.splice(this.mods, this.canvasHistory.length);
      }
      console.log("canvas: ", this.canvas);
      // 注意之前初始化canvas时重写了toJSON
      this.canvasHistory.push(JSON.stringify(this.canvas));
      console.log("canvasHistory: ", this.canvasHistory);
      // 更新推荐输入
      this.$store.commit("changeRecInput", this.canvas.getObjects());
    },
    /** HTML拖动事件 */
    // 针对拖放过程中鼠标经过元素；dragover：拖到何处
    handleDragOver(e) {
      if (e.preventDefault) {
        // 默认元素无法被放置到其他元素中，故阻止该默认行为
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = "copy"; // 拖放操作类型，决定鼠标形状
      return false;
    },
    // 针对拖放过程中鼠标经过元素；dragenter：元素进入范围
    handleDragEnter(e) {
      e.preventDefault();
    },
    // 针对画布；drop：进行放置
    handleDrop(e) {
      e = e || window.event;
      if (e.preventDefault) {
        e.preventDefault(); // drop的默认事件是打开链接，阻止
      }
      if (e.stopPropagation) {
        e.stopPropagation(); // 防止事件（e.g.点击）传播
      }
      var img = document.querySelector(
        ".material-list div.ul div.item-img img.dragging-img"
      ); // 选中的图片
      console.log("dragging-img: ", img);
      if (img == null || typeof img == undefined) return false;
      // // 加入素材
      // this.addMaterialIds(img.id);
      // // 更新套装总价
      // this.addPrice(img.getAttribute("price")); // 用img.price取不到
      // 鼠标所在位置
      var offsetY = e.offsetY;
      var offsetX = e.offsetX;
      console.log("offsetX: ", offsetX, " offsetY: ", offsetY);
      fabric.Image.fromURL(
        img.src,
        newImg => {
          // 要用=>而非function，否则会获取不到canvas
          let proportion = 0.3; // 为原图片大小的0.3
          newImg
            .set({
              left: offsetX,
              top: offsetY,
              originX: "center",
              originY: "center"
            })
            .scale(proportion);
          this.canvas.add(newImg);
          this.canvas.renderAll();
          this.updateModifications(); // 画布状态记录：加入新对象；要放在回调函数里！
        },
        {
          price: img.getAttribute("price"),
          id: img.id,
          categoryId: img.getAttribute("categoryId"),
          recCategory: img.getAttribute("recCategory"),
          imgUrl: img.src,
          crossOrigin: "anonymous" // 允许跨域，否则会报tainted canvases错误
        }
      );
    },
    /** 作品预览dialog */
    draftDialogFormPop() {
      // 草稿
      this.dialogStatus = 1;
      this.$refs.suitSaveDialog.dialogFormPop();
    },
    submitDialogFormPop() {
      // 发布到个人空间
      this.dialogStatus = 2;
      this.$refs.suitSaveDialog.dialogFormPop();
    },
    /**草稿抽屉 */
    drawerPop() {
      this.$refs.recSuitDraft.drawerPop();
    },
    /**加载草稿 */
    loadFromDraft(data) {
      this.canvas.clear();
      let that = this;
      this.canvas.loadFromJSON(data, function() {
        // 把草稿加载到画布上
        console.log(data);
        console.log(that.canvas.getObjects());
        that.canvas.renderAll();
        // 记录状态
        that.updateModifications();
      });
    },
    // 更新mod
    changeMods(data) {
      this.mods = data;
      console.log("mods: ", this.mods);
    }
  },
  mounted: function() {
    this.initCanvas();
  }
};
</script>
<style>
#canvas {
  border: solid 1px rgba(0, 0, 0, 0.1);
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
}
</style>
