<template>
  <div>
    <el-page-header @back="goBack" :content="recCategoryName"></el-page-header>
    <el-row
      type="flex"
      justify="center"
      align="center"
      style="margin-top: 5px; margin-bottom: 10px"
    >
      <el-select
        class="filter-selector"
        v-model="selectedCategory"
        filterable
        placeholder="类别"
        @change="handleCategorySelectChange"
        value-key="id"
      >
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.categoryName"
          :value="category"
        >
        </el-option>
      </el-select>
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
      :selectedCategory="selectedCategory.id"
      :selectedPopulation="selectedPopulation"
    >
    </material-page>
  </div>
</template>
<script>
import {
  getBrandList,
  getMaterialPage,
  getCategoryByRecType,
} from "@/api/recommendationAPI";
import materialPage from "./materialPage.vue";

import { showLoading, hideLoading } from "./loading";

export default {
  name: "recMaterialList",
  components: {
    materialPage,
  },
  data: function () {
    return {
      categoryId: null,
      recCategoryName: null,
      recType: null,
      brands: [],
      categories: [],
      materials: [],
      // 品牌选择器
      selectedBrands: [],
      // 种类选择器
      selectedCategory: [],
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
    goBack() {
      this.$router.go(-1);
    },
    handleBrandSelectChange(val) {
      // 改变品牌
      console.log(val);
      console.log("selected Brands", this.selectedBrands);
      this.$refs["materialPage"].currentPage = 1;
    },
    handleCategorySelectChange(val) {
      // 改变品牌
      console.log(val);
      console.log("selected Category", this.selectedCategory);
      this.$refs["materialPage"].currentPage = 1;
    },
    handleTargetPopulationSelectChange(val) {
      //改变目标人群
      console.log(val);
      console.log("selected population", this.selectedPopulation);
      this.$refs["materialPage"].currentPage = 1;
    },
    init() {
      this.$router.onReady(() => {
        showLoading("#material-list");
        this.recCategoryName = this.$route.query.recTypeName;
        this.recType = this.$route.query.recType;
        // 获得该大类对应的子类
        getCategoryByRecType({
          params: { recType: this.recType },
        })
          .then((res) => {
            console.log("categoryList res", res);
            let data = res.data;
            this.categories = data.data.categories;
            this.selectedCategory = this.categories[0];
            getBrandList({})
              .then((res) => {
                console.log("brandList res: ", res);
                let data = res.data;
                this.brands = data.data.brands;
                this.selectedBrands = data.data.brands;
                hideLoading();
              })
              .catch((err) => {
                console.log("获取品牌数据失败", err);
                hideLoading();
              });
          })
          .catch((err) => {
            console.log("获取类别数据失败", err);
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
.item-img {
  width: 80px;
  height: 80px;
  cursor: move;
  background: white;
  padding-left: 2px;
  padding-right: 2px;
}
.material-list {
  position: relative;
}
.filter-selector {
  width: 150px;
  margin-right: 5px;
}
</style>
