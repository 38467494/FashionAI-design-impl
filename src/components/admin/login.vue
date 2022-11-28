<template>

  <div style="min-height: 100vh" class="flex flex-col justify-center items-center">

    <GradientBackground/>

    <FrostedGlassContentCard
      class="mx-auto px-8 py-12 my-12"
      style="width: 80%;"
    >
      <AtsLogo class="my-1"/>

      <SimpleInfoCard round-radius="xl" style="min-width: 460px;max-width: 40%; max-height: 60%" class="mx-auto my-12 px-1 py-8">


        <div class="login-container mx-auto pos-rltv">
          <el-form ref="form" :model="form" label-width="80px" class="login-form mx-auto">
            <h2 class="font-semibold text-xl login-title mb-6">登录</h2>
            <el-form-item label="手机号">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-row type="flex" justify="end">
              <el-col :span="12">
                <el-form-item>
                  <AtsButton class="my-1" type="primary" @click="onSubmit">登录</AtsButton>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <p class="mt-6 text-slate-400 text-base font-light">测试管理员账号：18218746467，密码：12345678</p>
        </div>
      </SimpleInfoCard>
    </FrostedGlassContentCard>
  </div>
</template>

<script>
import {getUserInfo, login} from "../../api/login.js";
import {getAdminInfo} from "../../api/adminAPI.js";
import {showLoading, hideLoading} from "./loading.js";
import GradientBackground from "../common/GradientBackground";
import FrostedGlassContentCard from "../common/FrostedGlassContentCard";
import SimpleInfoCard from "../common/SimpleInfoCard";
import AtsLogo from "../common/AtsLogo";
import AtsButton from "../common/AtsButton";

export default {
  name: "adminLogin",
  components: {AtsButton, AtsLogo, SimpleInfoCard, FrostedGlassContentCard, GradientBackground},
  data() {
    return {
      form: {
        username: "18218746467",
        password: "12345678",
      },
    };
  },
  methods: {
    async onSubmit() {
      console.log("onsubmit", this.form);
      let data = {
        expiresIn: 10000000,
        password: this.form.password,
        phone: this.form.username,
      };
      let _this = this;
      try {
        showLoading(".login-container");
        await login(data)
          .then((res) => {
            if (res.data.httpCode != 200) throw res;
            this.$store.state.accessToken = res.data.data.accessToken;
            this.$store.state.roleType = res.data.data.roleType;
            // this.$router.push("/");
            console.log(this.$store.state.accessToken);
          })
          .catch((err) => {
            _this.$message.error(err.data.msg);
            _this.form.password = "";
            return Promise.reject("adminLogin failed： " + err.data.msg);
          });
        await getUserInfo(this.$store.state.accessToken)
          .then((res) => {
            console.log(res.data.data);
            let phone = res.data.data.phone;
            let userName = res.data.data.userName;
            // 获得用户信息后，验证是否为管理员
            getAdminInfo({params: {phone: phone}}).then((res) => {
              let data = res.data.data;
              if (data.isAdmin) {
                this.$store.commit("changeAdminLogin", {
                  adminPhone: phone,
                  adminUserName: userName,
                });
                var redirect = this.$route.query.redirect;
                if (redirect == null) redirect = "/admin";
                this.$router.push(redirect);
              } else {
                this.$message({
                  showClose: true,
                  message: "非管理员用户！",
                  type: "error",
                });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
      hideLoading();
      // console.log(this.$store.state.phone)
      // console.log(this.$store.state.userName)
    },
  },
};
</script>

<style acoped>
.login-form {
  width: 350px;
  /*margin: 16px auto;*/
  background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
  padding: 0;
  border-radius: 20px; /* 圆角 */
}
</style> -->
