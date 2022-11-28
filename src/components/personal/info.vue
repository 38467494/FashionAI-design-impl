<template>
  <div class="flex my-6">
    <div class="flex-none mr-8">
      <el-avatar :src="avatar" :size="100"/>
    </div>
    <div class="grow">
      <el-descriptions class=" margin-top max-w-3xl" title="" :column="2"  border >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{userName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{phone}}
        </el-descriptions-item>
      </el-descriptions>
    </div>

  </div>

</template>

<script>
export default {
  name: "info",
  data: function (){
    return {
      userName: null,
      phone: null,
      avatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png'
    }
  },
  mounted() {
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
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
