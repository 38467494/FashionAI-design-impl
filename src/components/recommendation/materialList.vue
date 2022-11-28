<template>
  <!-- 素材库查询结果页面，筛选器+素材列表 -->
  <div>
    <el-page-header @back="goBack" :content="categoryName"></el-page-header>
    <el-row
      type="flex"
      justify="center"
      align="center"
      style="margin-top: 5px; margin-bottom: 10px"
    >
      <el-cascader
        class="filter-selector"
        ref="categoryCascader"
        :show-all-levels="false"
        filterable
        placeholder="种类"
        @change="handleCascaderChange"
        :props="cascaderProps"
      ></el-cascader>
      <el-select
        id="target-population-select"
        class="filter-selector"
        v-model="selectedPopulation"
        clearable
        filterable
        placeholder="目标人群"
        @change="handleTargetPopulationSelectChange"
      >
        <el-option
          v-for="targetPopulation in targetPopulations"
          :key="targetPopulation.id"
          :label="targetPopulation.name"
          :value="targetPopulation.value"
        >
        </el-option
      ></el-select>
      <el-select
        id="brand-select"
        v-model="selectedBrands"
        multiple
        collapse-tags
        clearable
        filterable
        placeholder="品牌"
        @change="handleBrandSelectChange"
        value-key="id"
        style="margin-right: 5px"
      >
        <el-option
          v-for="brand in brands"
          :key="brand.id"
          :label="brand.brandName"
          :value="brand"
        >
        </el-option>
      </el-select>
    </el-row>
    <material-page
      ref="materialPage"
      :selectedBrands="selectedBrands"
      :selectedCategory="categoryId"
      :selectedPopulation="selectedPopulation"
    ></material-page>
  </div>
</template>
<script>
import { getBrandList, getCategoryByRecType } from "@/api/recommendationAPI";
import materialPage from "./materialPage.vue";
import { showLoading, hideLoading } from "./loading";

export default {
  name: "materialList",
  components: {
    materialPage,
  },
  data: function () {
    return {
      categoryId: null,
      categoryName: null,
      brands: [],
      // 品牌选择器
      selectedBrands: [],
      // 种类级联选择器
      cascaderProps: {
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      // 目标人群选择器
      selectedPopulation: "F", // 默认为女性
      targetPopulations: [
        {
          id: 1,
          name: "女",
          value: "F",
        },
        {
          id: 2,
          name: "男",
          value: "M",
        },
        {
          id: 3,
          name: "女童",
          value: "G",
        },
        {
          id: 4,
          name: "男童",
          value: "B",
        },
      ],
    };
  },
  methods: {
    // 级联选择器改变
    handleCascaderChange(val) {
      console.log(val); // array，按顺序记录每一层的value
      this.categoryId = val[1];
      let checkedNodes = this.$refs["categoryCascader"].getCheckedNodes();
      this.categoryName = checkedNodes[0].data.label; // 当前节点的label
      this.$refs["materialPage"].currentPage = 1;
    },
    // 级联选择器懒加载
    lazyLoad(node, resolve) {
      console.log("node: ", node);
      setTimeout(() => {
        if (node.level == 0) {
          const recTypes = [
            {
              value: "upper",
              label: "上衣",
            },
            {
              value: "bottom",
              label: "下衣",
            },
            {
              value: "bag",
              label: "包",
            },
            {
              value: "shoe",
              label: "鞋",
            },
            {
              value: "invalid",
              label: "其他",
            },
          ];
          resolve(recTypes);
        }
        if (node.level == 1) {
          let recType = node.value;
          getCategoryByRecType({ params: { recType: recType } }).then((res) => {
            const categories = res.data.data.categories.map((item) => {
              return {
                value: item.id,
                label: item.categoryName,
                leaf: node.level >= 1,
              }; // leaf: level 1为叶子节点
            });
            resolve(categories);
          });
        }
      }, 100);
    },
    goBack() {
      this.$router.push({ name: "categoryList" }).catch((err) => err);
    },
    handleBrandSelectChange(val) {
      // 改变品牌
      console.log(val);
      console.log("selected Brands", this.selectedBrands);
      this.$refs["materialPage"].currentPage = 1;
    },
    handleTargetPopulationSelectChange(val) {
      //改变目标人群
      console.log(val);
      console.log("selected population", this.selectedPopulation);
      this.$refs["materialPage"].currentPage = 1;
    },
    init() {
      showLoading("#material-list");
      this.$router.onReady(() => {
        this.categoryId = this.$route.query.categoryId;
        this.categoryName = this.$route.query.categoryName;
        console.log("category info: ", this.categoryId, this.categoryName);
        getBrandList({}).then((res) => {
          console.log("brandList res: ", res);
          let data = res.data;
          this.brands = data.data.brands;
          this.selectedBrands = data.data.brands;
          hideLoading();
        }).catch(err => {
          console.log("获取品牌数据失败", err);
          hideLoading();
        });
      });
    },
  },
  mounted: function () {
    this.init();
  },
};
</script>
<style>
.filter-selector {
  width: 150px;
  margin-right: 5px;
}
</style>
