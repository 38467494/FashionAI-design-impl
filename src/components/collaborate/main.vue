<template>
  <div class="flex divide-x h-full">
    <div class="basis-3/4 px-6 py-2">
      <el-tabs
        v-model="activeTabName"
        style="width: 100%"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="新建项目" name="NewProject">
          <new-project />
        </el-tab-pane>
        <el-tab-pane label="项目管理" name="ProjectManage">
          <collaborate-project v-if="uid != -1" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="basis-1/4 py-4 px-2">
      <RecommendWorks />
    </div>
  </div>
</template>

<script>
import collaborateProject from "./main/project.vue";
import NewProject from "./main/newProject";
import { ColLogin } from "../../api/collaborateAPI";
import RecommendWorks from "../common/RecommendWorks";

export default {
  name: "collaborate-main",
  components: {
    NewProject,
    collaborateProject,
    RecommendWorks
  },
  data: function() {
    return {
      uid: -1,
      mainSrc: "/static/pic/all.jpg",
      activeTabName: "NewProject",
      navItems: [
        {
          index: "0",
          title: "新建项目",
          name: "NewProject",
          svg: "xinjian"
        },
        {
          index: "1",
          class: "navSVG",
          title: "项目管理",
          name: "ProjectManage",
          svg: "xiangmu1"
        }
        // {
        //     index:"2",
        //     class: "navSVG",
        //     title: "message",
        //     svg: '<svg t="1641366845494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3920" width="200" height="200"><path d="M512 212l48.8 12c101.6 24.8 176 117.6 176 220.8v254.4l18.4 18.4 24.8 25.6h-536l24.8-25.6 18.4-18.4V444.8c0-103.2 73.6-196.8 176-220.8l48.8-12M512 64c-36.8 0-64 30.4-64 68v30.4C320.8 192 223.2 307.2 223.2 444.8v228.8L136 763.2v44.8h752v-44.8l-87.2-89.6V444.8c0-137.6-97.6-252.8-224.8-283.2v-28.8c0-32-17.6-60.8-48-67.2-5.6-1.6-11.2-1.6-16-1.6z m88 808H424c0 49.6 38.4 88 88 88s88-38.4 88-88z" p-id="3921"></path></svg>'
        // },
      ],
      selected: 1
    };
  },
  mounted() {
    var phone = this.$store.state.phone;
    var userName = this.$store.state.userName;
    console.log("collogin before", phone, userName);
    let _this = this;
    // this.$store.commit("changeCollaborateInfo",{
    //   uid: _this.$store.state.phone,
    //   pid: -1,
    //   vid: -1,
    // })
    ColLogin({
      phone: phone,
      userName: userName
    }).then(res => {
      console.log("col login", res.data);
      _this.uid = res.data;
      this.$store.commit("changeCollaborateInfo", {
        uid: _this.uid,
        pid: -1,
        vid: -1
      });
      // console.log("main mounted")
    });
  },
  methods: {
    handleTabClick: function(tab, event) {
      // var selected = this.selected;
      // if (selected != -1)
      //   this.$set(this.navItems[selected], 'class', 'navSVG');
      // this.selected = key;
      // console.log(this.selected);
      // this.$set(this.navItems[key], 'class', 'navSVG-active');
      // nothing to handle
    },
    name: function(name, index) {
      return name + index;
    },
    getIconClass: function(val) {
      return "icon iconfont el-icon-my-" + val;
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/collaborate/main.css";
</style>
