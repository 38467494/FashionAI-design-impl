<template>
      <el-menu :default-active="navselected"
               mode = "horizontal"
               router
              follow-router
      text-color="#969292"
      active-text-color="#409EFF"
      >
            <el-menu-item  index="/" style="width: 30%;border-bottom: 2px gray" >
              <el-row type="flex" style="height: 100%;">
                <el-col :span="8">
                  <el-image src="/static/logo/logo-1.png" style="height: 90%;"></el-image>
                </el-col>
                <el-col>
                  <p class="head">谙图生</p>
                </el-col>
              </el-row>




            </el-menu-item>

              <template v-for="(item,index) in tabArray">

                  <el-menu-item v-bind:index = "item.path" :key="index" v-if="item.path.indexOf('/')!=-1">
                    <span>{{item.name}}</span>
                  </el-menu-item>
                  <el-submenu v-else :key="index" index="0">
                    <template slot="title">{{item.name}}</template>
                    <template v-for="(subitem,subindex) in item.path">
                      <el-menu-item :index="subitem.path" :key="subindex">
                        {{subitem.name}}
                      </el-menu-item>
                    </template>
                  </el-submenu>
              </template>

              <div style="width: 10%"></div>


                <el-menu-item index="/login" class="login" v-if="$store.state.phone == null" style="float: right;margin: 0 40px 0 0;">登录</el-menu-item>

        <el-menu-item @click="logout" v-if="$store.state.phone != null" style="float: right;margin: 0 40px 0 0;">登出</el-menu-item>
                <el-menu-item index="/personalInfo" v-if="$store.state.phone != null" style="float: right;">个人信息</el-menu-item>




<!--        style="width: 40%; border-bottom: 2px gray"-->



<!--          <el-menu-item style="width: 10%; border-bottom: 2px gray" >-->

<!--          </el-menu-item>-->




<!--          若vuex中phone为null，那么说明用户尚未登录-->
      </el-menu>



</template>

<script>
import {doLogout} from "../api/login";

export default {
name: "Tab",
  data:function (){
    return{
      home:'/',
      navselected: '/',
      tabArray:[
        {
          path: '/share',
          name: '分享区'
        },

        {
            path: '/collaborate',
            name: '协同设计',

        },
        {
            path: '/virtual-tryon',
            name: '虚拟换装',

        },
        {
          path:'/recommendation',
          name: '搭配推荐',

        },
        {
            path: [
                {
                    path: '/design/match',
                    name: '设计生成'
                },
                {
                    path: '/stylist',
                    name: 'AI造型工具'
                }
            ],
            name: '工具集'
        },
        {
            path: '/aboutus',
            name: '关于我们'
        }
      ]

    }
  },
  mounted:function(){
      var newVal = this.$route.path
      var index = newVal.indexOf('/',1);
      if(index == -1)
          this.navselected = newVal;
      else
        this.navselected=newVal.slice(0,index);
      console.log("default-active",this.navselected);
  },
  // computed: {
  //   navselected: function (){
  //     console.log(this.$route.path)
  //     return this.$route.path;
  //   }
  // },
  methods: {
      //登出部分
      logout: function (){
        //jump to the main page
        this.navselected = "/";
        doLogout(this.$store.state.accessToken).then(res => {
          if(this.$route.path != '/')
            this.$router.replace({name: 'home'});
          this.navselected = '/';
          console.log(this.navselected)
        }).catch(err => {
          console.log(err);
        })
        this.$store.state.accessToken = null
        this.$store.commit("changeLogin",{
          phone: null,
          userName: null
        })
        .catch((err) => {
          console.log(err);
        });
      this.$store.state.accessToken = null;
      this.$store.commit("changeLogin", {
        phone: null,
        userName: null,
      });
    },
    select: function (index, indexPath) {
      console.log("select", index, indexPath, this.navselected);
    },
  },

}
</script>

<style>
    .login >>> .el-menu-item {
        float: right;
      display: inline-block
    }
    /*.el-menu-item{*/
    /*  font-size: 17px;*/
    /*}*/
    /*.el-submenu__title{*/
    /*  font-size: 17px;*/
    /*}*/
     .head{
        font: 30px bold;
        color: black;
        margin: 0px;
        padding: 10px;
        float: left;
    }
</style>
