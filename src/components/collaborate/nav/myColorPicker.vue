<template>
  <div>
    <!-- <colorPicker class="myColorPicker" v-model="myColor" v-on:change="handleChangeColor"/> -->
    <el-color-picker class="myColorPicker" v-model="myColor" v-on:change="handleChangeColor"/>
  </div>
</template>

<script>
export default {
  name: "myColorPicker",
  props: {
    color:{
      type:String,
      default: '#409EFF'
    }
  },
  data:function (){
    return{
      myColor:'#409EFF'
    }
  },
  watch: {
    color:function (){
      this.myColor = this.color;
    }
  },
  methods:{
    handleChangeColor:function (val){
      console.log("change color",val);
      this.$emit("change",val)
    }
  }
}
</script>

<style scoped>
@import "../../../assets/css/collaborate/colorPicker.css";
</style>
