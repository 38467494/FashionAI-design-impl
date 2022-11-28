<template>
  <div class="p-0 m-0 flex">

    <!-- left sidebar -->
    <div class="flex-none border-r p-0">
      <div
        class="ats-sidenav"
        v-for="item in sidenavs"
        :class="activeMenu == item.name ? 'active' : ''"
        @click="selectMenu(item.name)"
      >
        <i class="bi mr-2 text-xl" :class="'bi-' + item.icon"></i>
        <span class="text-lg">{{ item.text }}</span>
      </div>
    </div>

    <!-- right panel -->
    <div class="grow py-6 px-10">

      <div class="text-left text-2xl font-bold border-b pb-3 mb-4 ">
        <h1>{{ sidenavs[activeMenu].text }}</h1>
      </div>

      <info v-if="activeMenu == 'info'" :key="fresh"></info>
      <design v-if='activeMenu == "design"' :key="fresh"></design>
      <collect v-if="activeMenu == 'collect'" :key="fresh"></collect>
    </div>

<!--        <h2 v-if="isOutSide">-->
<!--          {{userName}} 的 个人空间-->
<!--        </h2>-->
<!--        <h2 v-else>个人空间</h2>-->




  </div>
</template>

<script>
import Design from "./personal/design";
import Collect from "./personal/collect";
import Info from "./personal/info"
export default {
  name: "personalInfo",
  components: {Collect, Design,Info},
  data: function (){
    return {
      sidenavs: {
        info: {
          name: "info",
          text: "个人信息",
          icon: "person",
        },
        design: {
          name: "design",
          text: "我的设计",
          icon: "palette",
        },
        collect: {
          name: "collect",
          text: "我的收藏",
          icon: "bookmark-star",
        }
      },
      activeMenu: "design",
      uid: -1,
      userName: null,
      phone: null,
      isOutSide: false, //判断是否为他人访问个人空间
      fresh: 0,
      isCollapse: true
    }
  },
  mounted:function (){
    var path = this.$route.path;
    console.log("personalInfo",path)
    var uid;
    if(path != "/share-space") {
      this.$store.commit("changePersonalSpace", {
        phone: this.$store.state.phone,
        userName: this.$store.state.userName
      })
    }

    this.userName = this.$store.state.spaceName;
    this.phone = this.$store.state.spaceUid

    if(this.phone == this.$store.state.phone){
      this.isOutSide = false;
    }
    else{
      this.isOutSide = true;

    }

    this.phone = this.phone.substr(0,3) + "****"+this.phone.substr(7,4)



    //重新刷新design模块，用更新的user和phone
    this.fresh=this.fresh+1

    console.log(this.activeMenu)
  },
  methods: {
    selectMenu: function (index){
      this.activeMenu = index
    }
  }
}
</script>

<style scoped>


/* 侧边导航栏按钮样式 */
@import "../assets/css/ats-sidenav.css";


.el-menu-item.is-active{
  color: white;
  background: #409EFF;
}


</style>
