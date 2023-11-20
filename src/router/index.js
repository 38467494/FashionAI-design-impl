import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/index";

import home from '../components/home'
import recommendation from '../components/recommendation.vue'
import collaborate from '../components/Collaborate.vue'
import virtualTryon from '../components/VirtualTryon.vue'
import design from '../components/design.vue';
import designRender from '../components/design/designRender.vue';
import designRecommend from '../components/design/designRecommend.vue';
import aboutUs from '../components/aboutus.vue';
import login from '../components/login.vue';

import process from '../components/collaborate/process.vue';
import collaborateMain from '../components/collaborate/main.vue'
import fabricDemo from "../components/collaborate/fabricDemo";

import fabricDemoDouble from "../components/collaborate/fabricDemo-double";

import match from '../components/design/match.vue'

import personalInfo from "../components/personalInfo";

import admin from "../components/admin"
import adminLogin from "../components/admin/login";
import recManager from "../components/admin/recommendation"
import materialManager from "../components/admin/recommendation/material/materialManager"
import materialEdit from "../components/admin/recommendation/material/materialEdit"
import materialTable from "../components/admin/recommendation/material/materialTable"
import materialDeletedItems from "../components/admin/recommendation/material/materialDeletedItems"
import materialResult from "../components/admin/recommendation/material/materialResult"

import brandManager from "../components/admin/recommendation/brand/brandManager"
import brandEdit from "../components/admin/recommendation/brand/brandEdit"
import brandTable from "../components/admin/recommendation/brand/brandTable"
import brandDeletedItems from "../components/admin/recommendation/brand/brandDeletedItems"

import categoryManager from "../components/admin/recommendation/category/categoryManager"
import categoryEdit from "../components/admin/recommendation/category/categoryEdit"
import categoryTable from "../components/admin/recommendation/category/categoryTable"
import categoryDeletedItems from "../components/admin/recommendation/category/categoryDeletedItems"

import suitManager from "../components/admin/recommendation/suit/suitManager"
import suitTable from "../components/admin/recommendation/suit/suitTable"
import suitEdit from "../components/admin/recommendation/suit/suitEdit"

import materialList from "../components/recommendation/materialList"
import categoryList from "../components/recommendation/categoryList"
import recMaterialList from "../components/recommendation/recMaterialList"
import recMenu from "../components/recommendation/recMenu"
import share from "../components/share";
import innerPage from "../components/personal/innerPage";
import testCover from "../components/testCover";
import stylist from "../components/stylist";
import singleLogin from '../components/singleLogin.vue'
import designInspire from "../components/design/designInspire.vue";
import designAIColor from "../components/design/designAIColor.vue";
import designTest from "../components/design/designTest.vue";

// 创意社区模块相关
import community from "../components/community";
import communityItemDetail from "../components/community/communityItemDetail";
import communityLogin from "../components/communityLogin";
import communityItemEdit from "../components/community/communityItemEdit";
import communityRegister from "../components/communityRegister";
import communityProposalDetail from "../components/community/communityProposalDetail";
import communityPersonal from "../components/community/communityPersonal";
import communityPersonalCollect from "../components/community/communityPersonalCollect";
import communityPersonalProduct from "../components/community/communityPersonalProduct";
import communityPersonalDesign from "../components/community/communityPersonalDesign";

Vue.use(Router)

const routes = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home',
      name: 'root',
    },
    {
      name: 'home',
      path: '/home',
      component: home
    },
    {
      name: 'community',
      path: '/community',
      component: community,
    },
    {
      name: 'communityItemDetail',
      path: '/communityItemDetail',
      component: communityItemDetail,
    },
    {
      name: 'communityItemEdit',
      path: '/communityItemEdit',
      component: communityItemEdit,
      meta:{
        communityAdminAuth: true,
      }
    },
    {
      name: 'communityProposalDetail',
      path: '/communityProposalDetail',
      component: communityProposalDetail,
    },
    {
      path: '/aboutus',
      name: 'aboutus',
      component: aboutUs
    },
    {
      path: '/communitylogin',
      name: 'communityLogin',
      component: communityLogin,
    },
    {
      path: '/communityregister',
      name: 'communityRegister',
      component: communityRegister,
    },
    {
      name: 'communityPersonal',
      path: '/communityPersonal',
      component: communityPersonal,
      meta:{
        communityAuth: true,
      },
      children: [
        {
          name: 'communityPersonalCollect',
          path: 'communityPersonalCollect',
          component: communityPersonalCollect,
        },
        {
          name: 'communityPersonalProduct',
          path: 'communityPersonalProduct',
          component: communityPersonalProduct,
        },
        {
          name: 'communityPersonalDesign',
          path: 'communityPersonalDesign',
          component: communityPersonalDesign,
        },
      ]
    }
  ]
})

routes.beforeEach((to, from, next) => {
  // /**管理员端登录 */
  // if ((to.meta.requireAdminAuth) && (store.state.adminPhone == null)) {
  //   next({
  //     name: 'adminLogin',
  //     query: {
  //       redirect: to.fullPath,
  //     }
  //   })
  // }
  // console.log("before", from);
  // if ((to.meta.requireAuth) && (store.state.phone == null)) {
  //   console.log("before Each login", to.fullPath)
  //   next({
  //     path: '/login',
  //     query: {
  //       redirect: to.fullPath
  //     }
  //   })
  // } else if (to.meta.nextPage != null) {
  //   next({
  //     name: to.meta.nextPage
  //   })
  // } else if (to.meta.isChild != null) {
  //   var list = to.meta.isChild;
  //   for (var i = 0; i < list.length; i++) {
  //     if (from.name == list[i]) {
  //       next();
  //       return;
  //     }
  //   }
  //   next({
  //     name: list[0]
  //   })
  // } else {
  //   next();
  // }

  // 设置社区相关的路由登陆限制
  if ((to.meta.communityAdminAuth) && (parseInt(store.state.roleType) !== 0)){
    next({
      path: '/communityLogin',
      query: {
        redirect: to.fullPath
      }
    })
  }
  else if((to.meta.communityAuth) && store.state.accessToken === null){
    next({
      path: '/communityLogin',
      query: {
        redirect: to.fullPath
      }
    })
  }
  else {
    next()
  }

});

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}


export default routes;
