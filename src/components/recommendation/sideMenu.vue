<template>
  <!-- 侧边栏 -->
  <div class="material-library" id="material-library">
    <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
      <el-tab-pane class="rec-tab-pane" label="素材库" name="library">
        <el-scrollbar style="width: 100%">
          <router-view></router-view>
        </el-scrollbar>
        <!-- 搜索得到的素材列表 -->
      </el-tab-pane>
      <el-tab-pane class="rec-tab-pane" label="智能推荐" name="recommend">
        <el-scrollbar style="width: 100%">
          <!-- 缓存recMenu，以保持recForm选中情况和推荐结果。但recForm会随机清空选中……TOFIX -->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import recMenu from "./recMenu.vue";

export default {
  name: "sideMenu",
  components: {
    recMenu,
  },
  data: function () {
    return {
      categories: [],
      // 标签栏
      tabActiveName:
        this.$route.name == "categoryList" ? "library" : "recommend",
    };
  },
  methods: {
    /** 标签栏 */
    handleTabClick(tab, event) {
      console.log(tab, event);
      if (tab.name == "library") {
        this.$router.push({ name: "categoryList" }).catch((err) => err);
      } else if (tab.name == "recommend") {
        this.$router.push({ name: "recMenu" }).catch((err) => err);
      }
    },
  },
};
</script>
<style>
/* 注意类名命名：.tab-pane会被myDesign影响 */
.rec-tab-pane {
  display: flex;
  height: 680px;
}
/* 填了这一项tab-pane上的步骤条会显示不出来 */
/* .rec-tab-pane .is-horizontal {
  display: none;
} */
.rec-tab-pane .el-scrollbar__wrap {
  overflow: scroll;
  overflow-x: hidden;
  width: 105%;
  height: 100%;
}
.el-select-dropdown__wrap {
  height: 120px;
  padding-bottom: 15px;
}
</style>