<template>
  <div id="toolbar" class="col">
    <div class="flex flex-col gap-y-3">
      <!-- header -->
      <div class="flex items-baseline justify-start border-b pb-3">
        <div class="flex-none font-bold text-lg text-left">服装纹样设计</div>
        <div class="grow"></div>
        <div class="flex-none basis-2/12">
          <AtsButton
            v-on:click="canvasToImg"
            type="primary"
            expand
            >预览</AtsButton
          >
        </div>
      </div>
      <!-- <el-col style="text-align: left"> -->
      <!--                <el-button v-on:click="save" type="primary">保存</el-button>-->
      <!-- <el-button v-on:click="post" type="primary">发布</el-button> -->
      <!-- </el-col> -->

      <!-- button-bar -->
      <div class="">
        <div class="rounded shadow-lg shadow-slate-100 border flex p-1">
        <template v-for="(item, index) in toolBarIcon">
          <!-- 使用v-for来渲染toolbar
                    显示icon或者divider -->

          <div
            class="col"
            :key="index"
            v-if="item.name != 'divider'"
          >
            <AtsButton
              @click="callFunction(item.function)"
              style="border: 0px transparent;"
              class="p-1 "
            >
                <!-- <img :src="item.bicon" class="icon" /> -->
                <i class="text-xl" :class="item.bicon"></i>
                <p class="text">
                  {{ item.name }}
                </p>
            </AtsButton>
        </div>
          <div v-else>
            <el-divider direction="vertical" class="ver-divider"></el-divider>
          </div>
        </template>
        </div>
      </div>

      <el-col :span="1"></el-col>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import AtsButton from "../common/AtsButton.vue";

export default {
  name: "toolbar",
  components: { AtsButton },
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  data: function() {
    return {
      toolBarIcon: [
        // {
        //     icon: '/static/pic/redo.png',
        //     name: 'redo',
        //     function: "redo"
        // },
        // {
        //     icon: '/static/pic/undo.png',
        //     name: 'undo',
        //     function: "undo"
        // },
        // {
        //     name: 'divider'
        // },
        // {
        //   name: 'divider'
        // },
        {
          icon: "/static/pic/bring_to_front.png",
          bicon: 'bi bi-front',
          name: "上移一层",
          function: "bringForward"
        },
        {
          icon: "/static/pic/send_to_back.png",
          bicon: 'bi bi-back',
          name: "下移一层",
          function: "sendBackward"
        },
        {
          name: "divider"
        },
        {
          icon: "/static/pic/group.png",
          bicon: 'bi bi-intersect',
          name: "组合",
          function: "group"
        },
        {
          icon: "/static/pic/UNGROUP.png",
          bicon: 'bi bi-exclude',
          name: "取消组合",
          function: "ungroup"
        },
        {
          name: "divider"
        },
        {
          icon: "/static/pic/remove.png",
          bicon: 'bi bi-trash',
          name: "删除",
          function: "remove"
        },
        {
          icon: "/static/pic/clear.png",
          bicon: 'bi bi-x-lg',
          name: "清屏",
          function: "clear"
        },
        {
          icon: "",
          bicon: 'bi bi-stars',
          name: "AI渲染",
          function: "airender"
        }
      ]
    };
  },
  methods: {
    callFunction: function(method) {
      this[method]();
    },
    redo: function() {
      console.log("redo");
    },
    undo: function() {
      console.log("undo");
    },
    bringForward: function() {
      var canvas = this.canvas;
      var obj = canvas.getActiveObject();
      // console.log("sendBackward");
      canvas.bringForward(obj);
    },
    sendBackward: function() {
      var canvas = this.canvas;
      var obj = canvas.getActiveObject();
      // console.log("sendBackward");
      canvas.sendBackwards(obj);
    },
    group: function() {
      var canvas = this.canvas;
      if (!canvas.getActiveObject()) {
        return;
      }
      if (canvas.getActiveObject().type !== "activeSelection") {
        return;
      }
      canvas.getActiveObject().toGroup();
      canvas.requestRenderAll();
    },
    ungroup: function() {
      var canvas = this.canvas;
      if (!canvas.getActiveObject()) {
        return;
      }
      if (canvas.getActiveObject().type !== "group") {
        return;
      }
      canvas.getActiveObject().toActiveSelection();
      canvas.requestRenderAll();
    },
    remove: function() {
      var canvas = this.canvas;
      if (!canvas.getActiveObject()) {
        return;
      }
      canvas.remove(canvas.getActiveObject());
    },
    clear: function() {
      this.canvas.clear();
    },

    // todo: 获取画框内的图像作为初始图像，弹出弹窗，支持框选，选择颜色、纹理、形状的取样图，可控制渲染程度
    airender: function(){
      this.$emit("renderCloth");
    },

    canvasToImg: function() {
      this.$emit("previewCloth");
    },
    save: function() {
      var canvas = this.canvas;
      var svg = JSON.stringify(canvas.toJSON());
      console.log(svg);
      var pre = this.preview_canvas;
      pre.loadFromJSON(svg);
    },
    post: function() {}
  }
};
</script>
<style scoped>
.icon {
  width: 30px;
  height: 30px;
  margin: 2px 5px;
}
.text {
  margin: 0px;
  font-size: 5px;
}
.ver-divider {
  height: 90%;
}
.col {
  text-align: center;
}
/*.toolbar-button{*/
/*  border: 0px transparent;*/
/*  width: 100%;*/
/*  padding: 5px;*/
/*  margin: 2px;*/
/*}*/
</style>
