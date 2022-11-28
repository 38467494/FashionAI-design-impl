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
      id="category-admin-table"
      class="admin-table"
      ref="recCategoryTable"
      key="recCategoryTable"
      :data="tableData"
      stripe
      :default-sort="{ prop: 'id', order: 'ascending' }"
      style="width: 100%"
      @selection-change="handleSelectionChange"
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
        prop="categoryName"
        label="种类名"
        width="80"
      ></el-table-column>
      <!-- 如果不设置width就会自动填充 -->
      <!-- 过长则省略 -->
      <el-table-column
        prop="description"
        label="描述"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <!-- 注意做非空判断，否则取length会报错 -->
          <span
            style="color: lightgrey"
            v-if="
              scope.row.description == null || scope.row.description.length == 0
            "
          >
            暂无描述
          </span>
          <span v-else> {{ scope.row.description }}</span>
        </template></el-table-column
      >
      <el-table-column prop="recCategory" label="分类" width="80">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.recCategory == 'upper'"
            >上衣</el-tag
          >
          <el-tag type="success" v-if="scope.row.recCategory == 'bottom'"
            >下衣</el-tag
          >
          <el-tag type="warning" v-if="scope.row.recCategory == 'bag'"
            >包</el-tag
          >
          <el-tag type="danger" v-if="scope.row.recCategory == 'shoe'"
            >鞋</el-tag
          >
          <el-tag type="info" v-if="scope.row.recCategory == 'invalid'"
            >其他</el-tag
          >
        </template>
      </el-table-column>
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
  getCategoryList,
  recoverCategories,
  getCategoryByIds,
} from "@/api/recommendationAPI";
import { showLoading, hideLoading } from "../../loading";
import Vue from "vue";

export default {
  name: "categoryDeletedItems",
  computed: {
    tableData: function () {
      // 添加前端分页，如果把分页表达式直接放在html里selection会失效：会连续执行两次handleSelectionChange
      return this.categories.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  data: function () {
    return {
      multipleSelection: [], // 多选
      // 分页
      currentPage: 1,
      pageSize: 5,
      total: 0,
      categories: [],
      // 搜索
      search: null,
    };
  },
  methods: {
    /**
     * 表格
     */
    // 跳转到列表页
    goToTable() {
      this.$router.push({
        name: "categoryTable",
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
          recoverCategories(formData)
            .then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "还原成功",
              });
              this.initCategoryList(); // 刷新一下！
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
          recoverCategories(formData)
            .then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "还原成功",
              });
              this.initCategoryList();
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
      // 使用前端分页，所以无需重新加载initCategoryList
      this.currentPage = currentPage;
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
        this.initCategoryList();
      } else {
        // 搜索该id相应的素材
        let id = value - 0;
        let ids = [];
        ids.push(id);
        getCategoryByIds({ params: { ids: ids, status: 0 } }).then((res) => {
          console.log(res);
          this.categories = res.data.data.categories;
        });
      }
    },
    /**初始化品牌列表 */
    initCategoryList() {
      showLoading(".admin-list-card");
      getCategoryList({ params: { status: 0 } }).then((res) => {
        console.log(res);
        let data = res.data.data;
        this.categories = data.categories;
        this.total = this.categories.length;
      });
      hideLoading();
    },
  },
  mounted: function () {
    this.initCategoryList();
  },
};
</script>
<style>
</style>
