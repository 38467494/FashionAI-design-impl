<template>
<!-- 素材列表 -->
  <div id="material-list" class="material-list" style="margin-top: 5px">
    <div class="ul" type="flex" align="center">
      <!-- key用item的话出现warning：Duplicate keys detected: '[object Object]'. This may cause an update error. -->
      <el-empty v-if="materials.length == 0" :image-size="200"></el-empty>
      <el-link v-for="material in materials" :key="material.id">
        <!-- 每个图片的id都是其对应素材对象的id；可拖动 -->
        <el-image
          :id="material.id"
          :categoryid="material.categoryId"
          :price="material.price"
          :recCategory="material.recCategory"
          :src="material.imgUrl"
          :title="material.description"
          class="item-img"
          draggable="true"
          @dragstart="handleDragStart($event)"
          @dragend="handleDragEnd($event)"
          fit="contain"
          style="margin-bottom: 24px; margin-left: 21px"
        >
        </el-image>
      </el-link>
    </div>
    <el-pagination
      small
      type="flex"
      align="end"
      class="pagination"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import { getMaterialPage } from "@/api/recommendationAPI";
import { showLoading, hideLoading } from "./loading";

export default {
  name: "materialPage",
  props: {
    selectedBrands: {
      type: Array,
      default: [],
    },
    selectedCategory: {
      type: Number, 
      default: 0,
    },
    selectedPopulation: {
      type: String,
      default: "F",
    },
  },
  watch: {
    //   通过监听品牌、分类、目标人群、页面来判断是否刷新素材列表内容
    selectedCategory: function(val) {
        this.initMaterialList();
    },
    selectedPopulation: function(val) {
        this.initMaterialList();
    },
    selectedBrands: function(val) {
        this.initMaterialList();
    },
    currentPage: function(val) {
        this.initMaterialList();
    }
  },
  data: function () {
    return {
      currentPage: 1,
      pageSize: 20,
      total: null, // 总素材数
      materials: [],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    /** 根据多选条件更新素材；分页 */
    initMaterialList() {
      let categoryIds = [];
      categoryIds.push(this.selectedCategory);
      let brandIds = this.selectedBrands.map((item) => {
        return item.id;
      });
      if (categoryIds.length != 1 || brandIds.length == 0) {
        this.materials = [];
        console.log("invalid filter!");
        return;
      }
      console.log("categoryIds: ", categoryIds, " brandIds: ", brandIds);
      const params = {
        categoryIds: categoryIds,
        brandIds: brandIds,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      if (this.selectedPopulation) {
        // 如果选了目标人群则添加查询条件
        params["targetPopulation"] = this.selectedPopulation;
      }
      showLoading("#material-list");
      getMaterialPage({
        params: params,
      }).then((res) => {
        console.log("materialList res: ", res);
        let data = res.data.data;
        this.materials = data.records;
        this.total = data.total;
      });
      hideLoading();
    },
    /** 分页 */
    // 分页页面大小管理
    handlePageSizeChange(size) {
      this.pageSize = size;
    //   this.initMaterialList();
      console.log("pagesize: ", this.pageSize);
    },
    // 换页管理
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
      console.log("currentpage: ", this.currentPage);
    //   this.initMaterialList();
    },
    /** 针对图片: 素材拖拽状态的添加和移除 */
    // 针对素材图片；dragstart：开始拖拽
    handleDragStart(e) {
      console.log("dragstart e.target: ", e.target);
      e.target.classList.add("dragging-img"); // 移除拖动标记
    },
    // 针对素材图片；dragend：结束拖拽
    handleDragEnd(e) {
      console.log("dragend e.target: ", e.target);
      e.target.classList.remove("dragging-img"); // 移除拖动标记
    },
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
</style>
