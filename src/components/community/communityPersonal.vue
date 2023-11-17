<template>
  <div class="flex" style="height: 100%;">
    <section class="flex-none border-r p-0" style="min-height: 300px">
      <template v-for="(item, index) in sidenavs">
        <div
          class="ats-sidenav"
          :class="selectedMenuIdx === item.idx ? 'active' : ''"
          @click="handleSelect(item)"
        >
          <div class="flex is-justify-end">
            <i class="bi mr-2 text-xl" :class="'bi-' + item.icon"></i>
            <span class="text-lg">{{ item.text }}</span>
          </div>
        </div>
      </template>
    </section>

    <section class="grow">
      <!-- 这里使用嵌套路由进行页面的跳转 -->
      <router-view></router-view>
    </section>
    <!--    <j-hover-btn bgColor = 'pink'-->
    <!--                 width = '80'-->
    <!--                 text = ''-->
    <!--                 :btn-style = "btnStyle"-->
    <!--                 @hoverBtnClick = "hoverBtnClick()">-->
    <!--    </j-hover-btn>-->
  </div>
</template>

<script>

import communityPersonalCollect from "./communityPersonalCollect";
import communityPersonalProduct from "./communityPersonalProduct";
import communityPersonalDesign from "./communityPersonalDesign";

export default {
  name: "communityPersonal",
  data() {
    return {
      isCollapse: false,
      selectedMenuIdx: 0,
      sidenavs: {
        collect: {
          idx: 0,
          name: "communityPersonalCollect",
          text: "我的收藏",
          icon: "star",
          path: "/communityPersonal/communityPersonalCollect"
        },
        product: {
          idx: 1,
          name: "communityPersonalProduct",
          text: "我的投稿",
          icon: "arrow-bar-up",
          path: "/communityPersonal/communityPersonalProduct"
        },
        design: {
          idx: 2,
          name: "communityPersonalDesign",
          text: "我的设计",
          icon: "stars",
          path: "/communityPersonal/communityPersonalDesign"
        },
        exit:{
          idx: 3,
          name: "home",
          text: "返回首页",
          icon: "arrow-left",
          path: "/home",
        },
      },
      btnStyle:{
        "fontSize":'small',
        "top":'60vh',
        "left":'90vw',
        "backgroundImage":'url(http://resource.voguexplorer.com/fashion/robot/robot.png)',
      }
    };
  },
  mounted: function() {
    this.$router.push({ name: "communityPersonalCollect" }).catch(err => err);
  },
  methods:{
    handleSelect: function(item) {
      if (item.idx !== this.selectedMenuIdx){
        this.selectedMenuIdx = item.idx
        this.$router.push({ path: item.path })
      }
    },
  }
}
</script>

<style scoped>
@import "../../assets/css/ats-sidenav.css";
</style>
