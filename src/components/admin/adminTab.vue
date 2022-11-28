<template>
  <div>
    <el-menu
      :default-active="navselected"
      mode="horizontal"
      router
      text-color="#545c64"
      active-text-color="#409EFF"
      class="admin-tab-menu"
    >
      <el-menu-item style="width: 40%; border-bottom: 2px gray" index="/admin">
        <p class="head">谙图生·ADMIN</p>
      </el-menu-item>
      <div style="width: 50%"></div>
      <el-submenu
        index="2"
        v-if="$store.state.adminPhone != null"
        style="float: right; margin: 0 40px 0 0"
      >
        <template slot="title">用户设置</template>
        <el-menu-item index="/personalInfo" class="personalInfo"
          >个人信息</el-menu-item
        >
        <el-menu-item @click="logout">登出</el-menu-item>
      </el-submenu>
      <el-menu-item
        v-else
        index="/admin/login"
        class="login"
        style="float: right; margin: 0 40px 0 0"
        >登录</el-menu-item
      >
    </el-menu>
  </div>
</template>

<script>
import { doLogout } from "../../api/login";

export default {
  name: "adminTab",
  data: function () {
    return {
      home: "/",
      navselected: "/",
    };
  },
  methods: {
    //登出部分
    logout: function () {
      //jump to the main page
      doLogout(this.$store.state.accessToken)
        .then((res) => {
          this.$router.replace("/");
        })
        .catch((err) => {
          console.log(err);
        });
      this.$store.state.accessToken = null;
      this.$store.commit("changeAdminLogin", {
        adminPhone: null,
        adminUserName: null,
      });
    },
  },
};
</script>

<style>
.head {
  font: 30px bold;
  color: black;
  margin: 0px;
  padding: 10px;
  float: left;
}
</style>
