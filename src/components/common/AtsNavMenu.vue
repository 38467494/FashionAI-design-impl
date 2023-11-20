<template>
  <nav class="px-6 flex items-stretch ats-nav transparent-bg"
  >
    <div class="py-4 px-2">
      <AtsLogo />
    </div>

    <ul class="mx-4 flex-grow flex justify-start items-stretch">
      <router-link
        tag="li"
        v-for="item in menus"
        class="mx-6 flex items-center relative ats-nav-item"
        :to="item.route"
      >
        <a class="py-4 text-lg block font-light ats-nav-item-text">
          {{ item.text }}
          <i v-if="!!item.submenu" class="bi bi-chevron-down"></i>
        </a>

        <!-- 一级子菜单列表 -->
        <ul
          v-if="!!item.submenu"
          class="dropdown rounded-lg border shadow-xl p-1 m-0 overflow-hidden"
        >
          <router-link
            tag="li"
            v-for="submenu in item.submenu"
            :to="submenu.route"
            class="px-3 py-2 m-0 rounded-lg"
          >
            <a class="py-1 text-base">
              {{ submenu.text }}
            </a>
          </router-link>
        </ul>
      </router-link>
    </ul>

    <div class="flex items-center grow-0">
      <div style="margin-right: 30px">
        <ats-button :round="true" type="pink" size="small" @click="gotoAIGC">
          <i class="bi bi-arrow-bar-up" style="font-size: 15px">我要投稿</i>
        </ats-button>
      </div>
      <template v-if="$store.state.loginName == null">
        <ats-button type="primary" style="width: 90px" @click="toLogin">
          登录
        </ats-button>
      </template>
      <template v-else>
        <div class="ats-nav-item h-full flex items-center">
          <a class="text-lg font-light flex items-center">
            <span class="m-2">{{ $store.state.nickname }}</span>
          </a>
          <el-avatar :src="avatarPlaceholder" :size="30" />
          <!-- 用户子菜单列表 -->
          <ul
            class="dropdown rounded-lg border shadow-xl p-1 m-0 overflow-hidden"
            style="transform: translateX(0%)"
          >
            <router-link
              tag="li"
              to="/communityPersonal"
              class="px-3 py-2 m-0 rounded-lg"
            >
              <a class="py-1 text-base">
                <i class="bi bi-person mr-2"></i>
                个人空间
              </a>
            </router-link>
            <li
              class="px-3 py-2 m-0 rounded-lg"
              @click="logout"
              style="cursor: pointer"
            >
              <a class="py-1 text-base">
                <i class="bi bi-box-arrow-right mr-2"></i>
                退出登录
              </a>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </nav>
</template>

<script>
import AtsButton from "./AtsButton";
import AtsLogo from "./AtsLogo";
import GradientBackground from "./GradientBackground";
import { communityLogout } from "../../api/login";
export default {
  name: "AtsNavMenu",
  components: { GradientBackground, AtsLogo, AtsButton },
  watch: {
    '$route.name': function(newRouteName, oldRouteName) {
      this.isHome = (newRouteName === "home");
      console.log(`new ${newRouteName}, old ${oldRouteName}`)
      // if (oldRouteName === 'communityLogin' && newRouteName !== 'communityRegister'){
      //   location.reload()
      // }
    },
  },
  methods: {
    toLogin() {
      this.$router.push("/communitylogin");
    },
    async logout() {
      //jump to the main page
      this.navselected = "/"
      this.$store.state.accessToken = null
      this.$store.state.roleType = null
      let _this = this
      await communityLogout(5)
        .then(res => {
          _this.$store.state.accessToken = null
          _this.$store.state.roleType = null
          _this.$store.commit("changeCommunityLogin", {
            loginName: null,
            nickname: null,
            userId: null,
          })
          if(_this.$route.path !== "/") _this.$router.replace({ name: "home" });
          _this.navselected = "/";
          console.log(_this.navselected);
        })
        .catch(err => {
          console.log(err);
        });

    },
    async gotoAIGC(){
      let _this = this
      if(this.$store.state.roleType!==null && parseInt(this.$store.state.roleType) === 0){
        this.$router.push({
          name:'communityItemEdit',
          path: '/communityItemEdit',
          query:{
            mode: 'add',
            itemId: '',
          }
        }).catch(err=>err)
      }else{
        this.$message("请先登录管理员账号，才能进行内容编辑！")
        await setTimeout(function (){
          _this.$router.push("/communitylogin")
        }, 2000)
      }
    },
    // logout: function() {
    //   //jump to the main page
    //   this.navselected = "/";
    //   doLogout(this.$store.state.accessToken)
    //     .then(res => {
    //       if (this.$route.path != "/") this.$router.replace({ name: "home" });
    //       this.navselected = "/";
    //       console.log(this.navselected);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    //   this.$store.state.accessToken = null;
    //   this.$store
    //     .commit("changeLogin", {
    //       phone: null,
    //       userName: null
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    //   this.$store.state.accessToken = null;
    //   this.$store.commit("changeLogin", {
    //     phone: null,
    //     userName: null
    //   });
    // }
  },
  data() {
    return {
      avatarPlaceholder:
        "https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png",
      home: "/",
      navselected: "/",
      isHome: false,
      menus: [
        {
          text: "首页",
          route: "/home"
        },
        {
          text: "社区动态",
          route: "/community"
        },
        // 隐去菜单为原谙图生平台的功能
        // {
        //   text: "搭配推荐",
        //   route: "/recommendation"
        // },
        // {
        //   text: "协同设计",
        //   route: "/collaborate"
        // },
        // {
        //   text: "虚拟换装",
        //   route: "/virtual-tryon"
        // },
        // {
        //   text: "工具集",
        //   route: "/design/match",
        //   submenu: [
        //     {
        //       text: "设计生成",
        //       route: "/design/match"
        //     },
        //     {
        //       text: "AI造型工具",
        //       route: "/stylist"
        //     }
        //   ]
        // },
        // {
        //   text: "分享区",
        //   route: "/share"
        // },
        {
          text: "关于我们",
          route: "/aboutus"
        }
      ]
      // usermenus: [
      //   {
      //     text: '个人空间',
      //     route: '/personalInfo',
      //     icon: 'person'
      //   },
      //   {
      //     text: '我的设计',
      //     route: '/stylist',
      //     icon: 'brush'
      //   },
      //   {
      //     text: '我的收藏',
      //     route: '/stylist',
      //     icon: 'star'
      //   },
      //   {
      //     text: '退出登陆',
      //     route: null,
      //     icon: 'box-arrow-right'
      //   }
      // ]
    };
  }
};
</script>

<style scoped>
/* 1级下拉菜单属性 */
ul.dropdown {
  position: absolute;
  z-index: 10;
  background-color: #fff;
  top: 60px;
  right: 30px;
  transform: translateX(-25%);
  width: max-content;
  /*opacity: 0;*/
  visibility: hidden;
  transition: opacity 0.2s;
}
ul.dropdown > li:hover,
ul.dropdown > li:hover a {
  background-color: var(--base-primary);
  color: #fff;
}

/* 导航栏透明背景+底边框 */
.transparent-bg {
  background: rgba(255, 255, 255, 0.6);
}
.gradient-bg {
  background: linear-gradient(180deg, #1E3FFF 0%, #2E99F7 45%, #19C2F6 100%);
}
/* .gradient-circle1 {
  width: 10vh;
  height: 10vh;
  background: linear-gradient(180deg, #1e3fff 0%, #2e99f7 45%, #19c2f6 100%);
  border-radius: 50%;
  filter: blur(40px);
} */
.ats-nav {

  border-bottom: 1px solid rgba(203, 203, 203, 1);
}
.ats-nav-item {
  max-width: max-content;
}

/* 非活跃导航文字样式 */
.ats-nav-item > a {
  color: var(--inactive-text);
}

/* 导航文字下方渐变条 */
.ats-nav-item > a:after {
  display: block;
  content: "";
  opacity: 0;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(119deg, #3550f6 0%, #23b8f6 100%);
  width: 0;
  transition: opacity 0.2s, width 0.2s, color 0.2s;
  position: absolute;
  bottom: -1px;
}

/* 导航栏hover项的文字变蓝 */
.ats-nav-item > a:hover {
  color: var(--base-primary-lightup);
  /* font-weight: bold; */
  text-shadow: 0 0 1px var(--base-primary-lightup);
  cursor: pointer;
}

/* 控制一级菜单显示 */
.ats-nav-item:hover > ul {
  visibility: visible;
}

/* 当前路由匹配项的下划线点亮 */
.ats-nav-item.router-link-active > a:after {
  opacity: 1;
  width: 100%;
}

/* 当前路由匹配项的字体颜色和增粗 */
.ats-nav-item.router-link-active > a {
  color: var(--base-primary);
  font-weight: bolder;
}
</style>
