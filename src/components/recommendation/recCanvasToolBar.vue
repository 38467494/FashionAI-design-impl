<template>
  <!-- 推荐模块画布工具栏，撤销、反撤销、层级改变、删除 -->
  <div class="border shadow rounded p-1">
    <AtsButton
      v-for="(item, index) in toolBarItems"
      :key="index"
      :id="item.id"
      :title="item.title"
      @click="handleTools(item.function)"
      style="border: none"
    >
    <img class="btn-inner-icon" :src="item.img" alt="">
    <p class="py-1" style="color:#3551F7;">{{item.title}}</p>
  </AtsButton>
  </div>
</template>
<script>
import AtsButton from "../common/AtsButton.vue";
export default {
  name: "RecCanvasToolBar",
  components: {
    AtsButton
  },
  props: {
    mods: {
      type: Number,
      default: -1
    },
    canvasHistory: {
      type: Array,
      default: []
    },
    canvas: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },
  data: function() {
    return {
      toolBarItems: [
        {
          id: "undo",
          icon: "el-icon-refresh-left",
          title: "返回一步",
          function: "undo",
          img:"../../../static/img/canvansBar/1.jpg"
        },
        {
          id: "redo",
          icon: "el-icon-refresh-right",
          title: "前进一步",
          function: "redo",
          img:"../../../static/img/canvansBar/2.jpg"
        },
        {
          id: "forwards",
          icon: "el-icon-arrow-up",
          title: "上移一层",
          function: "bringForward",
          img:"../../../static/img/canvansBar/3.jpg"
        },
        {
          id: "backwards",
          icon: "el-icon-arrow-down",
          title: "下移一层",
          function: "sendBackwards",
          img:"../../../static/img/canvansBar/4.jpg"
        },
        {
          id: "front",
          icon: "el-icon-top",
          title: "置顶",
          function: "bringToFront",
          img:"../../../static/img/canvansBar/5.jpg"
        },
        {
          id: "back",
          icon: "el-icon-bottom",
          title: "置底",
          function: "sendToBack",
          img:"../../../static/img/canvansBar/6.jpg"
        },
        {
          id: "remove",
          icon: "el-icon-remove-outline",
          title: "删除",
          function: "remove",
          img:"../../../static/img/canvansBar/7.jpg"
        },
        {
          id: "clear",
          icon: "el-icon-delete-solid",
          title: "清空",
          function: "clear",
          img:"../../../static/img/canvansBar/8.jpg"
        }
      ]
    };
  },
  methods: {
    // 根据方法名调用对应工具栏方法
    handleTools(functionName) {
      const methodList = this.$options.methods;
      methodList[functionName](this); // 方法需要传入this！
    },
    // 撤销操作
    undo(_this) {
      if (_this.mods >= 0) {
        let state = _this.canvasHistory;
        let updatedMods = _this.mods - 1;
        _this.$emit("changeMods", updatedMods);
        _this.canvas.clear(); // 先清空
        _this.canvas.loadFromJSON(state[updatedMods], function() {
          console.log(state[updatedMods]);
          console.log(_this.canvas.getObjects());
          // 如果直接用mods，来不及渲染
          _this.canvas.renderAll(); // 再渲染
          _this.$store.commit("changeRecInput", _this.canvas.getObjects()); // 更新推荐输入
        }); // 加载前一个状态
      } else {
        console.log("no previous step. cannot undo.");
      }
    },
    // 取消撤销操作
    redo(_this) {
      if (_this.mods < _this.canvasHistory.length - 1) {
        let state = _this.canvasHistory;
        let updatedMods = _this.mods + 1;
        _this.$emit("changeMods", updatedMods);
        _this.canvas.clear();
        _this.canvas.loadFromJSON(state[updatedMods], function() {
          _this.canvas.renderAll();
          _this.$store.commit("changeRecInput", _this.canvas.getObjects()); // 更新推荐输入
        });
      } else {
        console.log("no next step. cannot redo.");
      }
    },
    // 将选中元素上移一层
    bringForward(_this) {
      var activeObject = _this.canvas.getActiveObject();
      if (!activeObject) return;
      let objects = _this.canvas.getObjects();
      if (activeObject === objects[objects.length - 1])
        // 已经在最顶层了
        return;
      _this.canvas.bringForward(activeObject);
      _this.canvas.discardActiveObject(); // 取消选中，使得层级变化直接可见，体验更好
      _this.$parent.$parent.updateModifications(); // 因为多套了一层UI，需要两个parent；下文同理
    },
    // 将选中元素下移一层
    sendBackwards(_this) {
      var activeObject = _this.canvas.getActiveObject();
      if (!activeObject) return;
      let objects = _this.canvas.getObjects();
      if (activeObject === objects[0])
        // 已经在最底层了
        return;
      _this.canvas.sendBackwards(activeObject);
      _this.canvas.discardActiveObject(); // 取消选中，使得层级变化直接可见，体验更好
      _this.$parent.$parent.updateModifications();
    },
    // 将选中元素置顶
    bringToFront(_this) {
      var activeObject = _this.canvas.getActiveObject();
      if (!activeObject) return;
      let objects = _this.canvas.getObjects();
      if (activeObject === objects[objects.length - 1])
        // 已经在最顶层了
        return;
      _this.canvas.bringToFront(activeObject); // 取消选中，使得层级变化直接可见，体验更好
      _this.canvas.discardActiveObject();
      _this.$parent.$parent.updateModifications();
    },
    // 将选中元素置底
    sendToBack(_this) {
      var activeObject = _this.canvas.getActiveObject();
      if (!activeObject) return;
      let objects = _this.canvas.getObjects();
      if (activeObject === objects[0])
        // 已经在最底层了
        return;
      _this.canvas.sendToBack(activeObject);
      _this.canvas.discardActiveObject(); // 取消选中，使得层级变化直接可见，体验更好
      _this.$parent.$parent.updateModifications();
    },
    // 删除选中元素
    remove(_this) {
      var activeObject = _this.canvas.getActiveObject();
      if (!activeObject) return;
      console.log("activeObject: ", activeObject);
      console.log("delPrice", activeObject.price);
      _this.canvas.remove(activeObject);
      _this.$parent.$parent.updateModifications();
    },
    // 清空套装
    clear(_this) {
      // TOFIX
      _this.canvas.clear();
      _this.canvas.renderAll();
      _this.$parent.$parent.updateModifications();
    }
  }
};
</script>
<style scoped>
img.btn-inner-icon {
    vertical-align: middle;
    display: inline;
}
</style>
