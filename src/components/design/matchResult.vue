<template>
  <div class="px-6">
    <div class="flex gap-x-6">
      <div class="basis-1/3 flex flex-col gap-y-4">
        <div class="sm-caption">已选单品</div>
        <div style="width: 100%;height: 100%">
          <el-image
            class="round-img"
            style="width: 100%;"
            :src="url"
            v-if="url"
            fit="contain">
          </el-image>
        </div>
      </div>

      <div class="basis-2/3 flex flex-col gap-y-4">
        <div class="flex divide-x">
          <div class="basis-2/5 flex flex-col items-start">
            <div class="sm-caption mb-4">生成单品类别</div>
            <el-radio v-model="name" :label="name">{{ label }}</el-radio>
          </div>
          <div class="basis-3/5 pl-6">
            <div class="sm-caption mb-4">生成单品属性</div>
            <div>
              <div style="word-break: break-word;text-align: left">
                <template v-for="(tag,index) in tagList">
                  <el-tag class="m-1" hit :key="index">{{ tag }}</el-tag>
                </template>
              </div>
              <p v-if="tagList.length == 0">未选择标签</p>
            </div>
          </div>
        </div>


        <div class="round-img overflow-hidden my-2">
          <div style="width:100%">
            <el-image
              style="width: 100%"
              :src="result"
              v-if="result"
              fit="fill">
            </el-image>
          </div>
        </div>
        <!--                        <el-row>-->
        <!--                            <div class="block">-->
        <!--                                <el-rate-->
        <!--                                    v-model="rateValue"-->
        <!--                                    :colors="colors">-->
        <!--                                </el-rate>-->
        <!--                            </div>-->
        <!--                        </el-row>-->

        <!--                        <el-row style="text-align: center; margin:20px 0px;">-->
        <!--                            <el-button type="primary" round @click="sure">确定</el-button>-->
        <!--                        </el-row>-->

      </div>
    </div>


  </div>
</template>

<style scoped>
.sm-caption {
  font-weight: bold;
  color: #000;
  text-align: left;
  font-size: 1rem;
}

.round-img {
  border-radius: 0.5rem; /* 8px */
  border-width: 2px;
}
</style>

<script>
export default {
  name: "matchResult",
  props: {
    tagList: {
      type: Array,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    result: {
      type: String,
      default: null,
    }
  },
  mounted: function () {
    // this.tagList = this.$route.params.labels;
    // this.name = this.$route.params.matchType.name;
    // this.label = this.$route.params.matchType.label;
    // this.url = this.$route.params.image;
    // this.result = this.$route.params.result;
    // this.tagList = this.tresult.labels;
    // this.name = this.tresult.matchType.name;
    // this.label = this.tresult.matchType.label;
    // this.url = this.tresult.image;
    // this.result = this.tresult.result;
    //   console.log(this.result);
    //   console.log(this.tagList);
  },
  data: function () {
    return {
      // url:null,
      // result: "",
      radio: null,
      // name: "Jacket",
      // label: "夹克衫",
      // tagList: null,

      //评价
      rateValue: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
    }
  },
  methods: {
    sure: function () {
      //提交评价
      var rate = this.rateValue;
    }
  }
}
</script>
