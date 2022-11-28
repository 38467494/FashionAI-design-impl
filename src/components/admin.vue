<template>
<!-- ADMIN端，没有footer -->
  <el-container style="height: 100%; position: fixed">
    <el-aside width="220px">
      <el-menu
        default-active="1"
        class="admin-menu-vertical"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fffef9"
        active-text-color="#90d7ec"
      >
        <el-submenu index="1">
          <template slot="title" class="sub-menu-title"
            ><i class="el-icon-location"></i
            ><span slot="title">推荐模块</span></template
          >
          <el-menu-item index="1-1">素材管理</el-menu-item>
          <el-menu-item index="1-2">品牌管理</el-menu-item>
          <el-menu-item index="1-3">种类管理</el-menu-item>
          <el-menu-item index="1-4">作品管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main class="admin-main">
      <el-row class="admin-breadcrumb" type="flex" align="start">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="(item, index) in matchedList"
            :key="index"
            :to="{ name: item.name }"
            >{{ item.meta.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-row>
      <el-card class="box-card admin-list-card">
        <router-view></router-view>
      </el-card>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "admin",
  watch: {
    // 监听route
    $route(route) {
      // 如果跳转到重定向页，则不更新面包屑
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb(); //更新面包屑
    },
  },
  data: function () {
    return {
      selectedMenu: 0,
      matchedList: [],
    };
  },
  methods: {
    // 更新面包屑
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      );
      console.log("matched: ", this.$route.matched);
      this.matchedList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
      console.log("matchedList: ", this.matchedList);
    },
    // 导航栏选择
    handleSelect: function (index, path) {
      console.log("selected index", index);
      console.log("selected path", path);
      console.log("selected menu", this.selectedMenu);
      if (index == this.selectedMenu) return;
      this.selectedMenu = index;
      if (path[0] == 1) {
        // 用name得到对应url
        // this.$router.push({name: 'recManager'}).catch(err=>err);
        if (index == "1-1")
          this.$router.push({ name: "materialTable" }).catch((err) => err);
        else if (index == "1-2")
          this.$router.push({ name: "brandManager" }).catch((err) => err);
        else if (index == "1-3")
          this.$router.push({ name: "categoryManager" }).catch((err) => err);
        else if (index == "1-4")
          this.$router.push({ name: "suitManager" }).catch((err) => err);
      }
    },
  },
  mounted: function () {
    console.log(this.$router.options.routes);
    // this.$router.push({name:'admin'}).catch(err=>err);
  },
  created: function () {
    this.getBreadcrumb();
  },
};
</script>
<style>
.admin-menu-vertical {
  height: 100%;
  /* height: 91vh; */
  overflow-y: auto;
}
.admin-breadcrumb {
  margin-top: -5px;
  padding-bottom: 5px;
}
.admin-main {
  background-color: #fafafa;
}
/* 列表页 */
.admin-list-card {
  height: 80vh;
}
.admin-table-expand label {
  color: #99a9bf;
}
.admin-item-img {
  width: 40px;
  height: 40px;
}
.admin-item-img-large {
  width: 140px;
}
/* 编辑页 */
.admin-edit-img {
  width: 100%;
}
.admin-edit-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.admin-edit-uploader .el-upload:hover {
  border-color: #409eff;
}
.admin-result-img-container {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.admin-edit-img-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
  display: block;
}
</style>
