<template>
  <div>
    <GradientBackground/>
    <div class="login-container p-10 flex items-center justify-center">

      <FrostedGlassContentCard class="p-12" style="height: 72vh; width: 70vw">
        <AtsButton type="primary" size="medium" plain @click="gotoSso">跳转到单点登录</AtsButton>
      </FrostedGlassContentCard>

    </div>
  </div>

</template>

<script>
import {getUserInfo, login} from "../api/login.js";
import {SSO_URL} from "../../const";
import GradientBackground from "./common/GradientBackground";
import FrostedGlassContentCard from "./common/FrostedGlassContentCard";
import AtsButton from "./common/AtsButton";

window.addEventListener("message", e => {
  try {
    let data = JSON.parse(e.data)
    console.log(data)
    localStorage.setItem("token", data.token)
    localStorage.setItem("roleType", data.roleType)
    localStorage.setItem("phone", data.phone)
    localStorage.setItem("userName", data.userName)
    //
    // var queryRedirectPath = "/"
    // if (router.currentRoute.value.query.redirect) {
    //   queryRedirectPath = router.currentRoute.value.query.redirect
    // }
    // router.push({path: queryRedirectPath})
  } catch (e) {
    // console.log('error');
  }
})

export default {
  name: "login",
  components: {AtsButton, FrostedGlassContentCard, GradientBackground},
  data() {
    return {
      // form: {
      //   username: "18218746467",
      //   password: "12345678"
      // },
      iframe: '',
    };
  },
  methods: {
    async gotoSso() {
      // var url =document.URL
      
      this.$router.replace("/")
      await this.iframe.contentWindow.postMessage(JSON.stringify({url: document.URL}), SSO_URL)
      window.location.href = SSO_URL
      
      //测试使用
      //this.$router.push("/singleLogin");
    },
    createIframe() {
      this.iframe = document.createElement("iframe");
      this.iframe.src = SSO_URL;
      this.iframe.width = 0
      this.iframe.height = 0
      this.iframe.id = "iframe"
      document.body.append(this.iframe);
    }
  },
  async mounted() {
    if (localStorage.getItem("phone") != null) {
      var redirect = this.$route.query.redirect;
      console.log("redirect", redirect)
      if (redirect == null)
        redirect = '/';
      this.$router.push(redirect);
    }

    await this.createIframe()
    // setInterval(e =>{
    //   let curIframe = document.getElementById("iframe")
    //   if (curIframe != null) {
    //     this.gotoSso()
    //   }
    // }, 1000)

    // this.$message("即将跳转到登录页面")

  }
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
</style> -->
