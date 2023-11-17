<template>
  <div>
    <GradientBackground/>
    <div class="login-container p-10 flex items-center justify-center">

      <FrostedGlassContentCard class="p-12" style="height: 82vh; width: 70vw">
        <SimpleInfoCard round-radius="xl" style="min-width: 550px;max-width: 40%; max-height: 65%" class="mx-auto my-12 px-1 py-8">
          <div class="login-container mx-auto pos-rltv">
            <el-form ref="form" :model="form" label-width="100px" class="login-form mx-auto">
              <h2 class="font-semibold text-xl login-title mb-6" style="margin-left:10%">谙图生创意社区-注册</h2>
              <br/>
              <el-form-item label="手机号" style="font-weight:bold;">
                <el-input v-model="form.loginName"></el-input>
              </el-form-item>
              <el-form-item label="密码(8~16位)" style="font-weight:bold;">
                <el-input v-model="form.password" show-password></el-input>
              </el-form-item>
              <el-form-item label="昵称" style="font-weight:bold;">
                <el-input v-model="form.nickname"></el-input>
              </el-form-item>
              <el-form-item>
                <AtsButton class="my-1" type="primary" style="height: 35px;width: 120px; text-align: center" @click="onSubmit">注册</AtsButton>
              </el-form-item>
            </el-form>
            <!--            <p class="mt-6 text-slate-400 text-base font-light">测试管理员账号：18218746467，密码：12345678</p>-->
          </div>
        </SimpleInfoCard>
      </FrostedGlassContentCard>

    </div>
  </div>
</template>

<script>
import {communityLogin, communityRegister} from "../api/login.js";

import GradientBackground from "./common/GradientBackground";
import FrostedGlassContentCard from "./common/FrostedGlassContentCard";
import AtsButton from "./common/AtsButton";
import SimpleInfoCard from "./common/SimpleInfoCard";
export default {
  name: "communityRegister",
  components: {AtsButton, FrostedGlassContentCard, GradientBackground, SimpleInfoCard},
  data() {
    return {
      form: {
        loginName: "",
        password: "",
        nickname: "",
      },
      iframe: '',
    };
  },
  mounted() {
    // localStorage.clear()
    // console.log(history)
    this.historyIdx = history.length
    this.iframe = document.createElement("iframe");
    this.iframe.src = localStorage.getItem("url");
    this.iframe.width = 0
    this.iframe.height = 0
    document.body.append(this.iframe);
  },
  methods:{
    async onSubmit(){
      if(!this.isPhoneNumber(this.form.loginName)){
        this.$message.warning("请输入正确的手机号码！")
        return
      }
      if(!this.isPasswordValid(this.form.password)){
        this.$message.warning("请输入正确的密码！")
        return
      }
      if(!this.isNicknameValid(this.form.nickname)){
        this.$message.warning("请输入正确的昵称！")
        return
      }
      let data = {
        loginName: this.form.loginName,
        password: this.form.password,
        nickname: this.form.nickname,
      }
      let _this = this
      try{
        await communityRegister(data).then(res=>{
          console.log(res)
          _this.toLogin()
        }).catch(err => {
          _this.$message.error(err.data.msg)
          _this.form.password = ""
          return Promise.reject("register failed： "+err.data.msg)
        })
      }catch (err){
        console.log("register failed"+err)
      }
    },
    async toLogin() {
      this.$message("注册成功，2s后跳转回登录网页")
      await setTimeout(this.routerGoBack, 2000)
    },
    routerGoBack() {
      history.go(history.length - this.historyIdx -1) //返回原先网页
    },
    isPhoneNumber: function (str){
      if(str.length !== 11) return false
      return parseInt(str).toString().length === 11
    },
    isPasswordValid: function (str){
      return !(str.length < 8 || str.length > 16)
    },
    isNicknameValid: function (str){
      return !(str.length < 1 || str.length > 20);
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
