<template>
  <!-- 包含填充颜色、边框颜色和边框粗细 -->
  <div>
    <div class="flex edit-row">
      <p class="min-w-max flex-none  font-bold edit-text">填充颜色</p>
      <my-color-picker
        class="grow"
        @change="changeFillColor"
        v-bind:color="fillColor"
      ></my-color-picker>
      <!--                <div or-picker v-model="fillColor" @change="changeFillColor"></el-color-picker>-->
    </div>

    <div class="flex edit-row">
        <p class="min-w-max flex-none  font-bold edit-text">边框颜色</p>
      <div class="grow">
        <my-color-picker
          @change="changeBorderColor"
          v-bind:color="borderColor"
        ></my-color-picker>
        <!--                <div or-picker v-model="borderColor" @change="changeBorderColor"></el-color-picker>-->
      </div>
    </div>

    <div class="flex edit-row">
        <p class="min-w-max flex-none  font-bold edit-text">边框粗细</p>
      <div class="grow">
        <el-input-number
          v-model="borderWidth"
          :min="0"
          :max="20"
          size="mini"
          class="input-number"
          @change="changeBorderWidth"
        ></el-input-number>
      </div>
    </div>
  </div>
</template>

<script>
import MyColorPicker from "./myColorPicker";
export default {
  name: "editDraw",
  components: { MyColorPicker },
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  data: function() {
    return {
      fillColor: null,
      borderColor: null,
      borderWidth: null,
      color: "#ff0000"
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    //更新参数值
    update: function() {
      var canvas = this.canvas;
      if (!canvas.getActiveObject()) {
        return;
      }
      var obj = canvas.getActiveObject();
      this.borderColor = obj.stroke;
      this.borderWidth = obj.strokeWidth;
      this.fillColor = obj.fill;
    },
    //shape一些参数修改后所调用的函数
    changeFillColor: function(val) {
      this.fillColor = val;
      var obj = this.canvas.getActiveObject();
      obj.set({
        fill: val
      });
      this.canvas.requestRenderAll();
    },
    changeBorderColor: function(val) {
      this.borderColor = val;
      var obj = this.canvas.getActiveObject();
      obj.set({
        stroke: val
      });
      this.canvas.requestRenderAll();
    },
    changeBorderWidth: function(val) {
      var obj = this.canvas.getActiveObject();
      obj.set({
        strokeWidth: val
      });
      this.canvas.requestRenderAll();
    }
  }
};
</script>
