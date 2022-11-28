<template>
  <div class="flex flex-col gap-y-3">
    <div class="font-bold text-lg">画笔模式</div>
    <AtsButton type="pink" expand @click="changeMode" v-if="pencilMode"
      >退出画笔模式</AtsButton
    >
    <AtsButton type="primary" expand @click="changeMode" v-if="!pencilMode"
      >进入画笔模式</AtsButton
    >
    <div v-if="pencilMode">
      <section class="flex items-center gap-x-4">
        <p class="text-left font-light">画笔粗细</p>
        <section class="grow">
          <el-slider
            v-model="lineWidth"
            :max="widthMax"
            :min="1"
            @change="widthChange"
          ></el-slider>
        </section>
      </section>

      <el-divider></el-divider>

      <el-row type="flex">
        <el-col :span="12">
          <p>画笔颜色</p>
        </el-col>
        <el-col :span="12" style="text-align: center;">
          <el-color-picker
            v-model="lineColor"
            @change="colorChange"
          ></el-color-picker>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import AtsButton from "../../common/AtsButton.vue";
export default {
  name: "navPencil",
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  mounted: function() {
    var canvas = this.canvas;
    console.log(canvas);
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = this.lineColor;
    canvas.freeDrawingBrush.width = this.lineWidth;
  },
  data: function() {
    return {
      lineWidth: 6,
      lineColor: "#000000",
      widthMax: 30,
      pencilMode: true
    };
  },
  methods: {
    colorChange: function(val) {
      console.log("colorChange:", val);
      this.canvas.freeDrawingBrush.color = val;
    },
    widthChange: function(val) {
      this.canvas.freeDrawingBrush.width = val;
    },
    changeMode: function() {
      this.pencilMode = !this.pencilMode;
      this.canvas.isDrawingMode = this.pencilMode;
    }
  },
  components: { AtsButton }
};
</script>
