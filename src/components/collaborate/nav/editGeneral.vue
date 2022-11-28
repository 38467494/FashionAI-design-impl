<template>
  <div class="flex flex-col gap-y-1 my-1">
    <div class="flex items-center gap-x-4 edit-row" type="flex">
      <span class="flex-none edit-text font-bold min-w-max">宽度</span>
      <el-input-number
        v-model="width"
        :min="0"
        :max="300"
        size="mini"
        class="grow input-number"
        @change="changeWidth"
      ></el-input-number>
    </div>

    <div class="flex items-center gap-x-4 edit-row" type="flex">
      <span class="flex-none edit-text font-bold min-w-max">高度</span>
      <el-input-number
        v-model="height"
        :min="0"
        :max="500"
        size="mini"
        class="grow input-number"
        @change="changeHeight"
      ></el-input-number>
    </div>

    <div class="flex items-center gap-x-4 edit-row" type="flex">
      <span class="flex-none edit-text font-bold min-w-max">旋转</span>
      <el-input-number
        v-model="angle"
        :min="0"
        :max="360"
        size="mini"
        class="grow input-number"
        @change="changeAngle"
      ></el-input-number>
    </div>
  </div>
</template>

<script>
export default {
  name: "editGeneral",
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  data: function() {
    return {
      width: 0,
      height: 0,
      angle: 0
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
      this.width = obj.width * obj.scaleX;
      this.height = obj.height * obj.scaleY;
      this.angle = obj.angle;

      this.width = this.width.toFixed(1);
      this.height = this.height.toFixed(1);
    },
    //shape一些参数修改后所调用的函数
    changeWidth: function(val) {
      var obj = this.canvas.getActiveObject();
      console.log(obj);
      obj.set({
        scaleX: val / obj.width
      });
      this.canvas.requestRenderAll();
    },
    changeHeight: function(val) {
      var obj = this.canvas.getActiveObject();
      obj.set({
        scaleY: val / obj.height
      });
      this.canvas.requestRenderAll();
    },
    changeAngle: function(val) {
      var obj = this.canvas.getActiveObject();
      obj.set({
        angle: val
      });
      this.canvas.requestRenderAll();
    }
  }
};
</script>
