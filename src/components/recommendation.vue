<template>
  <el-container class="p-2 recommendation-container" style="z-index: 0">
    <!-- <el-aside width="15%"> </el-aside> -->
    <el-main width="70%">
      <canvas-module></canvas-module>
    </el-main>
    <el-aside width="30%">
      <side-menu style="margin-top: 10px; width: 100%"></side-menu>
    </el-aside>
  </el-container>
</template>
<script>
import CanvasModule from "./recommendation/canvasModule.vue";
import sideMenu from "./recommendation/sideMenu.vue";
export default {
  name: "recommendation",
  components: {
    sideMenu,
    CanvasModule,
  },
};
</script>
<style>
.el-radio-button__inner {
  border: none;
}
.pagination {
  margin-top: 10px;
}
</style>

