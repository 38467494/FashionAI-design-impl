<template>
    <div style="min-height: 100vh" class="flex flex-col justify-center items-center">
        <GradientBackground/>

            <SimpleInfoCard round-radius="xl" style="min-width: 550px;max-width: 40%; max-height: 65%" class="mx-auto my-12 px-1 py-8">
              <div class="login-container mx-auto pos-rltv">
                <el-form ref="form" :model="form" label-width="80px" class="login-form mx-auto">
                    <h2 class="font-semibold text-xl login-title mb-6" style="margin-left:10%">登录</h2>
                    <br/>
                    <el-form-item label="手机号" style="font-weight:bold;">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" style="font-weight:bold;">
                        <el-input v-model="form.password" show-password></el-input>
                    </el-form-item>
                    <el-row type="flex" justify="end">
                        <el-col :span="3">
                            <el-button  style="border: solid red;height: 35px;width: 90px;">
                                <el-link href="https://cosinehub.cn/personalRegister" target="_blank" style="color:#FF006B ;">注册</el-link>
                            </el-button>
                        </el-col>
                        <el-col :span="15">
                            <el-form-item>
                            <AtsButton class="my-1" type="primary" style="height: 35px;width: 90px;" @click="onSubmit">登录</AtsButton>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <p class="mt-6 text-slate-400 text-base font-light">测试管理员账号：18218746467，密码：12345678</p>
            </div>
            </SimpleInfoCard>


    </div>
</template>

<script>
import {getUserInfo, login} from "../api/login.js";

import GradientBackground from "./common/GradientBackground";
import FrostedGlassContentCard from "./common/FrostedGlassContentCard";
import SimpleInfoCard from "./common/SimpleInfoCard";
import AtsLogo from "./common/AtsLogo";
import AtsButton from "./common/AtsButton";

window.addEventListener("message", e => {
  try {
    let data = JSON.parse(e.data)
    console.log(data.url);
    localStorage.setItem("url", data.url)
  } catch (e) {
    // console.log('error');
  }
})

export default {
  name: "login",
  components: {AtsButton, AtsLogo, SimpleInfoCard, FrostedGlassContentCard, GradientBackground},
  data() {
    return {
      form: {
        username: "18218746467",
        password: "12345678"
      },
      historyIdx: 2,
      iframe: '',
      token: '',
      roleType: '',
    };
  },
  methods: {
    async onSubmit() {
      console.log("onsubmit",this.form)
      let data = {
        "expiresIn": 10000000,
        "password": this.form.password,
        "phone": this.form.username
      }
      let _this = this;
      try{
        await login(data).then(res => {
          if(res.data.httpCode != 200)
            throw res;
          this.token = res.data.data.accessToken
          this.roleType = res.data.data.roleType
        }).catch(err => {
          _this.$message.error(err.data.msg);
          _this.form.password = ""
          return Promise.reject("login failed： "+err.data.msg)
        })
        await getUserInfo(this.token).then(res => {
          console.log(res.data.data)
          let phone = res.data.data.phone
          let userName = res.data.data.userName
          this.setUserMsg(phone, userName)
        }).catch(err => {
          console.log(err);
        })
      }catch (err){
        console.log(err);
      }
    },
    async setUserMsg(phone, userName) {
      this.$message("登录成功，2s后跳转回原先网页")
      let req = {
        token: this.token,
        roleType: this.roleType,
        phone: phone,
        userName: userName,
      }
      await this.iframe.contentWindow.postMessage(JSON.stringify(req), '*')
      await setTimeout(this.routerGoBack, 2000)
    },
    routerGoBack() {
      // location.href = "https://www.baidu.com"
      history.go(history.length - this.historyIdx -1) //返回原先网页
    }
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
  }
}

</script>

<style acoped>
.login-form {
  width: 350px;
  /*margin: 16px auto;*/
  background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
  padding: 0;
  border-radius: 20px; /* 圆角 */
}
</style>
