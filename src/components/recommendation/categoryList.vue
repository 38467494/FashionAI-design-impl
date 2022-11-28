<template>
  <div>
  <el-row
    id="category-ul"
    class="ul"
    type="flex"
    align="center"
    justify="center"
  >
    <el-col>
      <el-empty v-if="errRequest" :image-size="200" description="加载失败">
        <el-button type="text" @click="getCategoryList">刷新</el-button></el-empty
      >
    </el-col>
    <el-button
      class="category-radio"
      v-for="category in categories"
      :key="category.id"
      :label="category"
      :title="category.categoryName"
      @click="goMaterialListPage(category.id, category.categoryName)"
      style="margin-bottom: 24px; margin-left: 21px"
    >
      <el-image
        class="category-img"
        :src="category.imgUrl"
        fit="contain"
      ></el-image>
      <div class="category-name-link" style="margin-top: 2px">
        {{ category.categoryName }}
      </div>
    </el-button>
  </el-row>
  </div>
</template>
<script>
import { getCategoryList } from "@/api/recommendationAPI";
import { showLoading, hideLoading } from "./loading";
export default {
  name: "categoryList",
  data: function () {
    return {
      categories: [],
      errRequest: false,
    };
  },
  methods: {
    // 用点击函数；如果用router-link包裹图像和文字，点击按钮不会跳转
    goMaterialListPage(categoryId, categoryName) {
      this.$router.push({
        name: "materialList",
        query: { categoryId: categoryId, categoryName: categoryName },
      });
    },
    getCategoryList() {
      showLoading("#category-ul");
      getCategoryList({})
        .then((res) => {
          this.errRequest = false;
          console.log("categoryList res: ", res);
          let data = res.data;
          this.categories = data.data.categories;
        })
        .catch((err) => {
          this.errRequest = true;
        });
      hideLoading();
    },
  },
  mounted: function () {
    this.getCategoryList();
  },
};
</script>
<style>
#category-ul {
  display: flex;
  flex-wrap: wrap;
  width: 98%;
  justify-content: flex-start;
}
.category-img {
  width: 35px;
  height: 35px;
  cursor: pointer;
  background: white;
}
.category-radio {
  width: 80px;
  height: 80px;
  /* border: none; */
}
a {
  text-decoration: none;
  color: black;
}
.router-link-active {
  text-decoration: none;
  color: black;
}
</style>
