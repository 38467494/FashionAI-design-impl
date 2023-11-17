<template>
  <div>
    <GradientBackground/>
    <div class="login-container p-10 flex items-center justify-center">

      <FrostedGlassContentCard class="p-12" style="height: 72vh; width: 70vw">
        <SimpleInfoCard round-radius="xl" style="min-width: 550px;max-width: 40%; max-height: 65%" class="mx-auto my-12 px-1 py-8">
          <div class="login-container mx-auto pos-rltv">
            <el-form ref="form" :model="form" label-width="80px" class="login-form mx-auto">
              <h2 class="font-semibold text-xl login-title mb-6" style="margin-left:10%">谙图生创意社区-登录</h2>
              <br/>
              <el-form-item label="手机号" style="font-weight:bold;">
                <el-input v-model="form.loginName"></el-input>
              </el-form-item>
              <el-form-item label="密码" style="font-weight:bold;">
                <el-input v-model="form.password" show-password></el-input>
              </el-form-item>
              <el-row type="flex" justify="end">
                <el-col :span="3">
                  <el-button  style="border: solid red;height: 35px;width: 90px;" @click="toRegister">
                    <div style="color:#FF006B ;">注册</div>
                  </el-button>
                </el-col>
                <el-col :span="15">
                  <el-form-item>
                    <AtsButton class="my-1" type="primary" style="height: 35px;width: 90px;" @click="onSubmit">登录</AtsButton>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
<!--            <p class="mt-6 text-slate-400 text-base font-light">测试管理员账号：18218746467，密码：12345678</p>-->
          </div>
        </SimpleInfoCard>
      </FrostedGlassContentCard>

    </div>
  </div>
</template>

<script>
import { communityLogin } from "../api/login";
import md5 from "js-md5";
import GradientBackground from "./common/GradientBackground";
import FrostedGlassContentCard from "./common/FrostedGlassContentCard";
import AtsButton from "./common/AtsButton";
import SimpleInfoCard from "./common/SimpleInfoCard";


export default {
  name: "communityLogin.vue",
  components: {AtsButton, FrostedGlassContentCard, GradientBackground, SimpleInfoCard},
  data() {
    return {
      form: {
        loginName: "",
        password: ""
      },
      historyIdx: 2,
      token: '',
      roleType: '',
      userId: -1,
      nickname: ''
    };
  },
  mounted() {
    // localStorage.clear()
    // console.log(history)
    this.historyIdx = history.length
  },
  methods:{
    async onSubmit(){
      let data = {
        loginName: this.form.loginName,
        password: md5(this.form.password)
      }
      let _this = this
      try{
        await communityLogin(data).then(res=>{
          console.log('login success')
          console.log(res.data.data)
          if(res.data.data){
            _this.token = res.data.data.token
            _this.roleType = res.data.data.authority
            _this.userId = res.data.data.userId
            _this.nickname = res.data.data.nickname
            _this.setUserMsg()
          }
          else{
            _this.$message.error("用户名或密码错误，请重新登录！")
          }
        }).catch(err => {
          _this.$message.error("用户名或密码错误，请重新登录！")
          return Promise.reject("login failed： "+err.data.msg)
        })
      }catch (err){
        console.log(err)
      }
    },
    async setUserMsg(){
      this.$message("登录成功，2s后跳转回原先网页")
      // localStorage.setItem('isLogin', this.isLogin)
      // 必须使用以下回调函数，setItem需要刷新页面才能渲染
      this.$store.commit("changeCommunityLogin", {
        loginName: this.form.loginName,
        nickname: this.nickname,
        userId: this.userId,
        roleType: this.roleType,
      })
      await setTimeout(this.routerGoBack, 2000)
    },
    routerGoBack() {
      // location.href = "https://www.baidu.com"
      history.go(history.length - this.historyIdx -1) //返回原先网页
    },
    toRegister: function (){
      this.$router.push("/communityRegister")
    }
  },
}
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 10px auto; /* 上下间距160px，左右自动居中*/
  background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
  padding: 30px;
  border-radius: 20px; /* 圆角 */
}
</style>
