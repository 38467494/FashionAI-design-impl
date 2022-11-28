<template>
  <div>
    <el-row
      class="admin-table-batch-filter"
      type="flex"
      align="start"
      justify="center"
    >
      <!-- 搜索：TOFIX -->
      <el-col type="flex" align="start">
        <el-input
          v-model="search"
          class="admin-table-search"
          @change="handleSearchInputChange"
          @input="handleSearchInput"
          clearable
          style="width: 250px"
          placeholder="请输入ID（只允许数字）"
        ></el-input>
      </el-col>
      <el-col type="flex" align="end">
        <el-button
          type="danger"
          @click="handleBatchRecover"
          round
          plain
          :disabled="multipleSelection.length == 0"
          >还原选中</el-button
        >
        <el-button type="success" @click="goToTable" round plain
          >素材列表</el-button
        >
      </el-col>
    </el-row>
    <el-table
      height="65vh"
      id="material-admin-table"
      class="admin-table"
      ref="recMaterialTable"
      key="recMaterialTable"
      :data="tableData"
      stripe
      :default-sort="{ prop: 'id', order: 'ascending' }"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @filter-change="handleFilterChange"
    >
      <el-table-column type="selection" width="30"> </el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="imgUrl" label="图片" width="80">
        <template slot-scope="scope">
          <el-image
            class="admin-item-img"
            :src="scope.row.imgUrl"
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        label="种类"
        width="80"
        :filters="categoryFilters"
        column-key="category"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag type="primary">{{ scope.row.categoryName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="brand"
        label="品牌"
        width="80"
        :filters="brandFilters"
        column-key="brand"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.brandName }}</el-tag>
        </template></el-table-column
      >
      <el-table-column
        prop="linkUrl"
        label="链接"
        :show-overflow-tooltip="true"
        width="140"
      >
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.linkUrl" target="_blank">{{
            scope.row.linkUrl
          }}</el-link>
        </template>
      </el-table-column>
      <!-- 如果不设置width就会自动填充 -->
      <!-- 过长则省略 -->
      <el-table-column
        prop="description"
        label="描述"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.description.length != 0">{{
            scope.row.description
          }}</span>
          <span v-else style="color: lightgrey">暂无描述</span>
        </template></el-table-column
      >
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column prop="targetPopulation" label="人群" width="60"
        ><template slot-scope="scope">
          <span v-if="scope.row.targetPopulation == 'F'">女</span>
          <span v-if="scope.row.targetPopulation == 'M'">男</span>
          <span v-if="scope.row.targetPopulation == 'G'">女孩</span>
          <span v-if="scope.row.targetPopulation == 'B'">男孩</span>
        </template></el-table-column
      >
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            @click="handleRecover(scope.$index, scope.row)"
            size="small"
            >还原</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      small
      type="flex"
      align="end"
      class="pagination"
      @current-change="handleCurrentPageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import {
  getMaterialPage,
  getMaterialByIds,
  getBrandList,
  getCategoryList,
  recoverMaterials,
} from "@/api/recommendationAPI";
import { showLoading, hideLoading } from "../../loading";
import Vue from "vue";

export default {
  name: "materialDeletedItems",
  data: function () {
    return {
      categories: [],
      selectedCategories: [],
      categoryFilters: [],
      brands: [],
      selectedBrands: [],
      brandFilters: [],
      multipleSelection: [], // 多选
      // 分页
      currentPage: 1,
      pageSize: 5,
      total: null,
      tableData: [],
      // 搜索
      search: null,
    };
  },
  methods: {
    /**
     * 表格
     */
    handleFilterChange(columnKey) {
      // filter-method不适合：是一个前端过滤方法，会遍历表格的每一条数据对其执行filter-method
      // filter-change才是一个触发事件：columnKey会表明过滤器所在列（注意为column添加column-key）及其对应筛选条件的value列表
      console.log("column key: ", columnKey);
      this.selectedCategories = columnKey.category;
      this.selectedBrands = columnKey.brand;
      console.log("selectedCategories: ", this.selectedCategories);
      console.log("selectedBrands: ", this.selectedBrands);
      this.currentPage = 1; // 回到头一页
      this.initMaterialList();
    },
    // 跳转到列表页
    goToTable() {
      this.$router.push({
        name: "materialTable",
      });
    },
    // 还原选中行
    handleBatchRecover() {
      this.$confirm("此操作将还原该记录，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.multipleSelection.map((item) => {
            return item.id;
          });
          var formData = new FormData();
          formData.append("ids", ids);
          recoverMaterials(formData)
            .then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "还原成功",
              });
              this.initMaterialList(); // 刷新一下！
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "还原失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 还原单行
    handleRecover(index, row) {
      console.log("row: ", row);
      this.$confirm("此操作将还原该记录，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = [];
          ids.push(row.id);
          var formData = new FormData();
          formData.append("ids", ids);
          recoverMaterials(formData)
            .then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "还原成功",
              });
              this.initMaterialList();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "还原失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 多选内容
    handleSelectionChange(val) {
      // 表格选中行, multipleSelection: 选中的tableData
      this.multipleSelection = val;
      console.log("multipleSelection: ", this.multipleSelection);
    },
    /**
     * 分页
     */
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
      this.initMaterialList();
    },
    /**
     * 搜索
     */
    handleSearchInput(value) {
      // 只允许输入正数，如果输入符号则自动删除
      let data = String(value);
      data = data.replace(/[^\d]/g, ""); // 只留下数字
      console.log("trimmed input: ", data);
      this.search = data;
    },
    handleSearchInputChange(value) {
      console.log(value);
      if (value == "") {
        // 为空则‘全局搜索’
        this.initMaterialList();
      } else {
        // 搜索该id相应的素材
        let id = value - 0;
        let ids = [];
        ids.push(id);
        getMaterialByIds({ params: { ids: ids, status: 0 } }).then((res) => {
          console.log(res);
          this.tableData = res.data.data.materials;
        });
      }
    },
    /**
     * 初始化品牌，种类，和素材
     */
    init() {
      showLoading(".admin-table");
      getCategoryList({}).then((res) => {
        console.log("categoryList res: ", res);
        let data = res.data;
        this.categories = data.data.categories;
        this.categoryFilters = this.categories.map((item) => {
          return {
            text: item.categoryName,
            value: item.id,
          };
        });
        getBrandList({}).then((res) => {
          console.log("brandList res: ", res);
          let data = res.data;
          this.brands = data.data.brands;
          this.brandFilters = this.brands.map((item) => {
            return {
              text: item.brandName,
              value: item.id,
            };
          });
          this.initMaterialList();
        });
      });
      hideLoading();
    },
    initMaterialList() {
      // 查询status = 0的商品
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: 0,
      };
      // 注意使用筛选器的情况：不使用筛选时filter为空，这时候应该不传入对应id参数
      if (this.selectedBrands && this.selectedBrands.length > 0) {
        Vue.set(params, "brandIds", this.selectedBrands);
      }
      if (this.selectedCategories && this.selectedCategories.length > 0) {
        Vue.set(params, "categoryIds", this.selectedCategories);
      }
      showLoading(".admin-list-card");
      getMaterialPage({
        params: params,
      }).then((res) => {
        let data = res.data.data;
        this.tableData = data.records;
        this.total = data.total;
      });
      hideLoading();
    },
  },
  mounted: function () {
    this.init();
  },
};
</script>
<style>
</style>
