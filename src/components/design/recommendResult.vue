<template>
  <div class="flex flex-col divide-y px-6">
    <div class="flex divide-x">
      <div class="basis-1/4 pr-4 pb-6">
        <div class="sm-caption mb-4">服装样式</div>
        <div class="result-image-div">
          <el-image
            class="round-img"
            :src="clothImage" v-if="clothImage"
            fit="contain">
          </el-image>
        </div>

      </div>
      <div class="basis-3/4 pl-4 pb-6">
        <div class="sm-caption mb-4">掩码图片</div>
        <el-row type="flex">
          <template v-for="(item,index) in maskList">
            <el-col :key="index" :span="8" style="padding: 5px;">
              <div class="result-image-div">
                <el-image class="round-img" :src="item"  fit="contain" style="width: 100%">
                  <div slot="error" class="image-slot h-full" >
                    <span >未提供</span>
                  </div>
                </el-image>
              </div>

            </el-col>
          </template>
        </el-row>

      </div>

    </div>

    <div class="py-6">
      <div class="sm-caption mb-4">推荐生成结果</div>
      <div>
        <template v-for="(item,index) in resultList">
          <el-col :key="index" :span="7" style="padding: 5px;">
            <el-image class="round-img mr-4"
                      :src="resultList[index]"
                      v-if="resultList[index]"
                      fit="contain"></el-image>
          </el-col>

        </template>

      </div>
    </div>

<!--    评价-->
<!--    <el-row type="flex">-->
<!--      <div class="block">-->
<!--        <el-rate-->
<!--          v-model="rateValue"-->
<!--          :colors="colors">-->
<!--        </el-rate>-->
<!--      </div>-->
<!--    </el-row>-->
<!--    <el-row style="margin: 10px">-->
<!--      <el-button type="primary" round @click="sure">确定</el-button>-->
<!--    </el-row>-->



  </div>
</template>

<script>
export default {
  name: "recommendResult",
  props:{
    clothImage:{
      type: String,
      default: null,
    },
    maskList:{
      type:Array,
      default: null,
    },
    resultList:{
      type:Array,
      default:null,
    }
  },
  mounted: function () {


  },
  data: function () {
    return {
      // clothImage: null,
      // maskList: null,
      // resultList: null,
      fit: 'contain',

      //评价
      rateValue: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    }
  },
  methods: {
    sure: function (){
      var rate = this.rateValue;
      //提交评价
    }
  }
}
</script>

<style scoped>
.result-image-div{
  width:100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;

}
.el-divider--vertical{
  height: 100%;
}
.sm-caption {
  font-weight: bold;
  font-size: 1rem;
  text-align: left;
  color: #000;
}
.round-img {
  border-radius: 0.5rem; /* 8px */
  border-width: 2px;
}
</style>
