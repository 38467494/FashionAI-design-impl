<template>
  <div id="app">
    <GradientBackground/>
    <AtsNavMenu/>
<!--    <el-header style="height: 60px; z-index: 10">-->
<!--      <admin-tab-->
<!--        v-if="$route.meta.isAdmin == true"-->
<!--        style="width: 100%"-->
<!--        class="admin-tab"-->
<!--      ></admin-tab>-->
<!--      <tab v-else class="tab"></tab>-->
<!--    </el-header>-->
    <el-main :class="needWhiteBg ? 'bg-white' : ''">
<!--      <div style="height: 60px;"></div>-->
      <router-view style="width: 100%;">
      </router-view>
<!--      <chat-robot style="z-index: 9999999"></chat-robot>-->
    </el-main>

    <el-footer>
      <my-footer v-if="$route.meta.isAdmin == null"></my-footer>
    </el-footer>
  </div>
</template>

<script>
import tab from "../src/components/tab";
import adminTab from "../src/components/admin/adminTab.vue";
import myFooter from "./components/footer.vue";
import AtsNavMenu from "./components/common/AtsNavMenu";
import GradientBackground from "./components/common/GradientBackground.vue";
// import chatRobot from "./components/chatRobot";


// 注意，在这里加上页面，才能用彩色背景渲染到
const routeNamesWhichNeedsWhiteBackground = [
  'home',
  'aboutus',
  'login',
  'adminLogin',
  'collaborate-process',
  'singleLogin',
  'community',
  'communityItemDetail',
  'communityLogin',
  'communityItemEdit',
  'communityRegister',
  'communityProposalDetail',
];

export default {
  name: "App",
  components: {
    AtsNavMenu,
    tab,
    adminTab,
    myFooter,
    GradientBackground,
    // chatRobot,
  },
  mounted() {
    this.needWhiteBg = !(routeNamesWhichNeedsWhiteBackground.includes(this.$route.name));
  },
  watch: {
    '$route.name': function(newName, oldName) {
      this.needWhiteBg = !(routeNamesWhichNeedsWhiteBackground.includes(newName));
    }
  },
  data() {
    return {
      needWhiteBg: false,
    }
  },
};
</script>


<style>
/* bugfix: 解决ElementUI的loading组件不居中的问题 */
.el-loading-spinner {
  display: flex;
  justify-content: center;
}
</style>



<style scoped>

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 1200px;
  /*margin-top: 60px;*/
}
.tab {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
  padding: 0px;
  min-width: 1200px;
}
.el-main {
  padding: 0px;
  min-height: 80vh;
  border: 0px;
  overflow: hidden;
  /*min-width: 1200px;*/
}

.el-header{
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
  padding:0px;
  min-width: 1200px;
}
.el-footer{
  padding: 0px;
}
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
