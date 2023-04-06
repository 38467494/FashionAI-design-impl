<template>
  <div style="width: 100%">
    <!-- 操作步骤示意 -->
    <!-- tab-pane is-horizontal display: none时步骤条会无法显示 -->
    <div class="text-left font-semibold text-1xl border-b pb-2">选择期望的类型</div>
    <el-form
      class="recommend-form"
      ref="recForm"
      :model="recForm"
      :rules="rules"
      label-width="50px"
      label-position="left"
      style="width: 98%"
      v-loading="loading"
      :key="fresh"
    >
      <el-row
        type="flex"
        justify="space-between"
        align="center"
        style="margin-bottom: -10px"
      >
        <el-form-item label-width="0px" prop="matchType">
          <el-radio-group
            v-model="recForm.matchType"
            @change="handleMatchTypeChange"
          >
            <el-radio :label="this.LABEL_UPPER">上衣</el-radio>
            <el-radio :label="this.LABEL_BOTTOM">下衣</el-radio>
            <el-radio :label="this.LABEL_BAG">包</el-radio>
            <el-radio :label="this.LABEL_SHOE">鞋</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <div class="text-left font-semibold text-1xl  pb-2" v-if="upperDisabled == false||bottomDisabled == false">选择目前衣服穿搭</div>
      <el-form-item
        v-if="upperDisabled == false"
        label="上衣"
        prop="upper"
        style="width: 100%"
      >
        <el-card
          class="box-card rec-form-card"
          shadow="never"
          :body-style="{ padding: '0px' }"
        >
          <el-row type="flex" justify="space-between" align="center" :span="24">
            <div>
              <el-radio-group
                class="rec-input-radio-group"
                v-model="recForm.upper"
                size="mini"
                @change="handleUpperChange"
                :disabled="upperDisabled"
              >
                <el-radio-button
                  class="rec-input-btn"
                  v-for="u in uppers"
                  :key="u.id"
                  :label="u"
                >
                  <el-image
                    :category="u.category"
                    :id="u.id"
                    class="rec-input-img"
                    :src="u.imgUrl"
                    fit="contain"
                  ></el-image>
                </el-radio-button>
              </el-radio-group>
            </div>
            <el-button
              class="material-add-btn"
              style="float: right; padding: 3px 0"
              type="text"
              @click="goRecMaterialListPage('上衣', 'upper')"
              ><template
                ><span style="color: #BDBDBD">更多</span><i></i></template
            ></el-button>
          </el-row>
        </el-card>
      </el-form-item>
      <el-form-item
        v-if="bottomDisabled == false"
        label="下衣"
        prop="bottom"
        style="width: 100%"
      >
        <el-card
          class="box-card"
          shadow="never"
          :body-style="{ padding: '0px' }"
        >
          <el-row type="flex" justify="space-between" align="center" :span="24">
            <div>
              <el-radio-group
                class="rec-input-radio-group"
                v-model="recForm.bottom"
                size="mini"
                @change="handleBottomChange"
                :disabled="bottomDisabled"
              >
                <el-radio-button
                  class="rec-input-btn"
                  v-for="b in bottoms"
                  :key="b.id"
                  :label="b"
                >
                  <el-image
                    :category="b.category"
                    :id="b.id"
                    class="rec-input-img"
                    :src="b.imgUrl"
                    fit="contain"
                  ></el-image>
                </el-radio-button>
              </el-radio-group>
            </div>
            <el-button
              class="material-add-btn"
              style="float: right; padding: 3px 0"
              type="text"
              @click="goRecMaterialListPage('下衣', 'bottom')"
              ><template
                ><span style="color: #BDBDBD">更多</span><i></i></template
            ></el-button>
          </el-row>
        </el-card>
      </el-form-item>
      <el-form-item
        v-if="bagDisabled == false"
        label="包"
        prop="bag"
        style="width: 100%"
      >
        <el-card
          class="box-card"
          shadow="never"
          :body-style="{ padding: '0px' }"
        >
          <el-row type="flex" justify="space-between" align="center" :span="24">
            <div>
              <el-radio-group
                class="rec-input-radio-group"
                v-model="recForm.bag"
                size="mini"
                @change="handleBagChange"
                :disabled="bagDisabled"
              >
                <el-radio-button
                  class="rec-input-btn"
                  v-for="b in bags"
                  :key="b.id"
                  :label="b"
                >
                  <el-image
                    :category="b.category"
                    :id="b.id"
                    class="rec-input-img"
                    :src="b.imgUrl"
                    fit="contain"
                  ></el-image>
                </el-radio-button>
              </el-radio-group>
            </div>
            <el-button
              class="material-add-btn"
              style="float: right; padding: 3px 0"
              type="text"
              @click="goRecMaterialListPage('包', 'bag')"
              ><template
                ><span style="color: #BDBDBD">更多</span><i></i></template
            ></el-button>
          </el-row>
        </el-card>
      </el-form-item>
      <el-form-item
        v-if="shoeDisabled == false"
        label="鞋"
        prop="shoe"
        style="width: 100%"
      >
        <el-card
          class="box-card"
          shadow="never"
          :body-style="{ padding: '0px' }"
        >
          <el-row type="flex" justify="space-between" align="center" :span="24">
            <div>
              <el-radio-group
                class="rec-input-radio-group"
                v-model="recForm.shoe"
                size="mini"
                @change="handleShoeChange"
                :disabled="shoeDisabled"
              >
                <el-radio-button
                  class="rec-input-btn"
                  v-for="s in shoes"
                  :key="s.id"
                  :label="s"
                >
                  <el-image
                    :category="s.category"
                    :id="s.id"
                    class="rec-input-img"
                    :src="s.imgUrl"
                    fit="contain"
                  ></el-image>
                </el-radio-button>
              </el-radio-group>
            </div>
            <el-button
              class="material-add-btn"
              style="float: right; padding: 3px 0"
              type="text"
              @click="goRecMaterialListPage('鞋', 'shoe')"
              ><template
                ><span style="color: #BDBDBD">更多</span><i></i></template
            ></el-button>
          </el-row>
        </el-card>
      </el-form-item>
      <el-form-item>
        <AtsButton type="primary" @click="onSubmit('recForm')"
        >进行推荐</AtsButton>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
// import { getRecommendationList } from "@/api/recommendationAPI";
import { getRecommendationList } from "../../api/recommendationAPI"
import AtsButton from "../common/AtsButton.vue";

export default {
  name: "RecForm",
  components:{
    AtsButton
  },
  computed: {
    // 从vuex中取出输入单品列表
    ...mapState({
      uppers: "upper",
      bottoms: "bottom",
      bags: "bag",
      shoes: "shoe",
      price: "price"
    }),
  },
  mounted() {
    console.log("mounted",this.$store.state.upper)
  },
  watch: {
    // 根据用户选择的待推荐项，不显示待推荐项对应的输入单品选择框
    "recForm.matchType": function (val) {
      this.upperDisabled = val == this.LABEL_UPPER;
      this.bottomDisabled = val == this.LABEL_BOTTOM;
      this.shoeDisabled = val == this.LABEL_SHOE;
      this.bagDisabled = val == this.LABEL_BAG;
    },
    '$store.state.price': function (){
      this.fresh +=1
      console.log("change watch",this.recForm)
    },
    // 如果原本选中的元素被从画布上移除，要清空单品选择框的选定状态；但是当uppers被清空为0的时候没法监听到……
    uppers: function (val) {
      // 有选定的上衣
      if (this.recForm.upper) {
        if (val.length == 0) {
          // 画布上没有上衣对象了
          this.recForm.upper = null;
        } else {
          let flag = false; // 画布上有无选定对象
          val.forEach((item) => {
            flag = item.id == this.recForm.upper.id ? true : false; // 有
          });
          this.recForm.upper = flag ? this.recForm.upper : null;
        }
      }
    },
    bottoms: function (val) {
      if (this.recForm.bottom) {
        if (val.length == 0) {
          this.recForm.bottom = null;
        } else {
          let flag = false;
          val.forEach((item) => {
            flag = item.id == this.recForm.bottom.id ? true : false;
          });
          this.recForm.bottom = flag ? this.recForm.bottom : null;
        }
      }
    },
    bags: function (val) {
      if (this.recForm.bag) {
        if (val.length == 0) {
          this.recForm.bag = null;
        } else {
          let flag = false;
          val.forEach((item) => {
            flag = item.id == this.recForm.bag.id ? true : false;
          });
          this.recForm.bag = flag ? this.recForm.bag : null;
        }
      }
    },
    shoes: function (val) {
      if (this.recForm.shoe) {
        if (val.length == 0) {
          this.recForm.shoe = null;
        } else {
          let flag = false;
          val.forEach((item) => {
            flag = item.id == this.recForm.shoe.id ? true : false;
          });
          this.recForm.shoe = flag ? this.recForm.shoe : null;
        }
      }
    },
  },
  data: function () {
    var validateUpper = (rule, value, callback) => {
      console.log("upper value: ", value);
      if (this.upperDisabled) {
        // 希望被推荐上衣
        callback();
      } else if (value) {
        // 已经选择了上衣
        callback();
      } else {
        callback(new Error("请选择上衣"));
      }
    };
    var validateBottom = (rule, value, callback) => {
      console.log("bottom value: ", value);
      if (this.bottomDisabled) {
        callback();
      } else if (value) {
        callback();
      } else {
        callback(new Error("请选择下衣"));
      }
    };
    var validateBag = (rule, value, callback) => {
      console.log("bag value: ", value);
      if (this.bagDisabled) {
        callback();
      } else if (value) {
        callback();
      } else {
        callback(new Error("请选择包"));
      }
    };
    var validateShoe = (rule, value, callback) => {
      console.log("shoe value: ", value);
      if (this.shoeDisabled) {
        callback();
      } else if (value) {
        callback();
      } else {
        callback(new Error("请选择鞋"));
      }
    };
    // 用自带validate会有红色星号，不太好看
    var validateMatchType = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请选择待推荐类别"));
      }
    };
    return {
      stepsActive: 1,
      loading: false,
      LABEL_UPPER: "upper",
      LABEL_BOTTOM: "bottom",
      LABEL_BAG: "bag",
      LABEL_SHOE: "shoe",
      upperDisabled: true,
      bottomDisabled: true,
      bagDisabled: true,
      shoeDisabled: true,
      recForm: {
        matchType: null,
        upper: null,
        bottom: null,
        bag: null,
        shoe: null,
      },
      fresh:0,
      rules: {
        matchType: [
          {
            validator: validateMatchType,
            trigger: "blur",
          },
        ],
        upper: [
          {
            validator: validateUpper,
            trigger: "blur",
          },
        ],
        bottom: [
          {
            validator: validateBottom,
            trigger: "blur",
          },
        ],
        bag: [
          {
            validator: validateBag,
            trigger: "blur",
          },
        ],
        shoe: [
          {
            validator: validateShoe,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    goRecMaterialListPage(recTypeName, recType) {
      this.$router.push({
        name: "recMaterialList",
        query: { recTypeName: recTypeName, recType: recType },
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let itemIds = [];
          console.log("recForm: ", this.recForm);
          if (this.recForm.upper != null) itemIds.push(this.recForm.upper.id);
          if (this.recForm.bottom != null) itemIds.push(this.recForm.bottom.id);
          if (this.recForm.shoe != null) itemIds.push(this.recForm.shoe.id);
          if (this.recForm.bag != null) itemIds.push(this.recForm.bag.id);
          const params = {
            itemIds: itemIds,
            matchType: this.recForm.matchType,
          };
          console.log(params);
          // 改变步骤条进度
          this.stepsActive = 3;
          // 用封装的loading显！示！不！出！来！完全不理解
          this.loading = true;
          // 计时开始
          let start = new Date();
          console.log("start", start);
          getRecommendationList({ params: params })
            .then((res) => {
              console.log("recommendations res: ", res);
              let data = res.data.data;
              // 计时结束
              let end = new Date();
              console.log("end", end);
              let interval = (end - start) / 1000;
              console.log("interval: ", interval, "s");
              data["interval"] = interval;
              // this.recommendations = data.data.records;
              this.$emit("getRecommendations", data);
              this.loading = false;
              // 改变步骤条进度
              this.stepsActive = 4;
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
              this.$message({
                showClose: true,
                message: "查询失败",
                type: "warning",
              });
              this.stepsActive = 2;
            });
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    /** 选择想要得到推荐的类别 */
    handleMatchTypeChange(val) {
      // 改变步骤条进度
      if (this.stepsActive != 2) this.stepsActive = 2;
      let formName = "recForm";
      this._data[formName][val] = null; // 清除该类别的输入
      // 清除一下校验信息：待输入单品会改变
      this.$refs[formName].clearValidate();
      // 改变步骤条进度
      this.stepsActive = 2;
    },
    handleUpperChange(val) {
      console.log("selected upper: ", this.recForm.upper);
    },
    handleBottomChange(val) {
      console.log("selected bottom: ", this.recForm.bottom);
    },
    handleBagChange(val) {
      console.log("selected bag: ", this.recForm.bag);
    },
    handleShoeChange(val) {
      console.log("selected shoe: ", this.recForm.shoe);
    },
  },
  activated() {
    console.log("----------activated--------");
    console.log(this.recForm);
  },
  deactivated() {
    console.log("----------deactivated--------");
    console.log(this.recForm);
  },
};
</script>
<style>
.rec-form-card {
  width: 100%;
}
.material-add-btn {
  height: 50px;
  width: 50px;
}
.radio-group-wrapper {
  height: 50px;
  /* box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1); */
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}
.rec-input-radio-group {
  height: 100%;
  width: 100%;
}
.rec-input-img {
  height: 45px;
  width: 45px;
  cursor: pointer;
  background: #D9D9D9;
}
.rec-input-btn {
  display: inline-block;
}
.recommend-form .el-form-item {
  margin-bottom: 15px;
  font-weight: bold;
}
/* 步骤条 */
.el-step.is-center .el-step__description {
  padding-left: 10%;
  padding-right: 10%;
}

.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #FFF;
    background-color: #409EFF !important;
    border-color: #409EFF;
    -webkit-box-shadow: -1px 0 0 0 #409eff;
    box-shadow: -1px 0 0 0 #409eff;
}
.el-radio-button--mini.rec-input-btn .el-radio-button__inner {
    padding: 3px 3px;
    font-size: 12px;
    border-radius: 0;
}
</style>
