<template>
  <div class="flex flex-col gap-y-1">
    <div class="flex items-center gap-x-4 edit-row">
      <span class="flex-none edit-text min-w-max font-bold">字体</span>
      <el-select
        class="grow"
        v-model="fontFamily"
        placeholder="请选择字体"
        @change="changeFontFamily"
      >
        <el-option
          v-for="(item, index) in fontFamilyArr"
          :key="index"
          :label="getFontName(item)"
          :value="item.en"
        ></el-option>
      </el-select>
    </div>

    <div class="flex items-center gap-x-4 edit-row">
      <span class="flex-none edit-text min-w-max font-bold">字号</span>
      <el-select
        class="grow"
        v-model="fontSize"
        placeholder="请选择字号"
        @change="changeFontSize"
      >
        <el-option
          v-for="(item, index) in fontSizeArr"
          :key="index"
          :label="item.label"
          :value="item.val"
        ></el-option>
      </el-select>
    </div>

    <div class="flex items-center gap-x-4 edit-row">
      <span class="flex-none edit-text min-w-max font-bold">颜色</span>
      <my-color-picker
        class="grow"
        @change="changeColor"
        v-bind:color="color"
      ></my-color-picker>
      <!--          <el-color-picker v-model="color" @change="changeColor"></el-color-picker>-->
    </div>

    <div class="flex items-center gap-x-2 edit-row">
      <div class="edit-text min-w-max font-bold">对齐方式</div>
        <template v-for="(item, index) in alignIcon">
          <div class="basis-1/4">
            <AtsButton  @click="changeAlign(item.val)">
              <i :class="item.bicon" ></i>
            </AtsButton>
          </div>
        </template>
    </div>
  </div>
</template>

<script>
import myColorPicker from "./myColorPicker";
import AtsButton from "../../common/AtsButton.vue";
export default {
  name: "editFont",
  components: { myColorPicker, AtsButton },
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  data: function() {
    return {
      fontFamilyArr: [
        {
          ch: "黑体",
          en: "SimHei"
        },
        {
          ch: "宋体",
          en: "SimSun"
        },
        {
          ch: "新宋体",
          en: "NSimSun"
        },
        {
          ch: "仿宋",
          en: "FangSong"
        },
        {
          ch: "楷体",
          en: "KaiTi"
        },
        {
          ch: "微软雅黑体",
          en: "Microsoft YaHei"
        },
        {
          en: "PmingLiu"
        },
        {
          en: "Impact"
        },
        {
          en: "Georgia"
        },
        {
          en: "Tahoma"
        },
        {
          en: "Arial"
        },
        {
          en: "Book Antiqua"
        },
        {
          en: "Century Gothic"
        }
      ],
      fontFamily: null,
      //字号对照表
      fontSizeArr: [
        {
          label: "初号",
          val: "56"
        },
        {
          label: "小初",
          val: "48"
        },
        {
          label: "一号",
          val: "34"
        },
        {
          label: "小一",
          val: "32"
        },
        {
          label: "二号",
          val: "29"
        },
        {
          label: "小二",
          val: "24"
        },
        {
          label: "三号",
          val: "21"
        },
        {
          label: "小三",
          val: "20"
        },
        {
          label: "四号",
          val: "18"
        },
        {
          label: "小四",
          val: "16"
        },
        {
          label: "五号",
          val: "14"
        },
        {
          label: "小五",
          val: "12"
        },
        {
          label: "六号",
          val: "10"
        },
        {
          label: "小六",
          val: "8"
        },
        {
          label: "七号",
          val: "7"
        },
        {
          label: "八号",
          val: "6"
        }
      ],
      fontSize: "小三",

      color: null,

      alignIcon: [
        {
          icon: "zuoduiqi",
          val: "left",
          bicon: "bi bi-text-left"
        },
        {
          icon: "juzhongduiqi",
          val: "center",
          bicon: "bi bi-text-center"
        },
        {
          icon: "youduiqi",
          val: "right",
          bicon: "bi bi-text-right"
        },
        {
          icon: "zuoyouduiqi",
          val: "justify",
          bicon: "bi bi-justify"
        }
      ]
    };
  },
  mounted() {
    this.update();
    // console.log("navText mounted")
  },
  methods: {
    //更新参数值
    update: function() {
      // console.log("text update");
      var canvas = this.canvas;
      if (!canvas.getActiveObject()) {
        return;
      }
      var obj = canvas.getActiveObject();
      this.fontFamily = obj.fontFamily;
      this.fontSize = this.getFontSize(obj.fontSize);
      this.color = obj.fill;
    },
    changeFontFamily: function(val) {
      var canvas = this.canvas;
      if (!canvas.getActiveObject()) {
        return;
      }
      var obj = canvas.getActiveObject();
      if (obj.type != "textbox") return;
      // console.log('textbox');
      obj.set({
        fontFamily: val
      });
      canvas.requestRenderAll();
    },
    getFontName: function(item) {
      if (item.ch != null) return item.ch;
      else return item.en;
    },
    changeFontSize: function(val) {
      var canvas = this.canvas;
      if (!canvas.getActiveObject()) {
        return;
      }
      var obj = canvas.getActiveObject();
      if (obj.type != "textbox") return;
      // console.log('textbox');
      obj.set({
        fontSize: val
      });
      canvas.requestRenderAll();
    },
    getFontSize: function(val) {
      for (var i = 0; i < this.fontSizeArr.length; i++) {
        var item = this.fontSizeArr[i];
        if (item.val == val) return item.label;
      }
    },

    changeColor: function(val) {
      var obj = this.canvas.getActiveObject();
      obj.set({
        fill: val
      });
      this.canvas.requestRenderAll();
    },
    getIconClass: function(val) {
      return "icon iconfont el-icon-my-" + val;
    },
    changeAlign: function(val) {
      var obj = this.canvas.getActiveObject();
      obj.set({
        textAlign: val
      });
      this.canvas.requestRenderAll();
    }
  }
};
</script>

<style>
.icon-button {
  padding: 0px;
  margin: auto;
}
</style>
