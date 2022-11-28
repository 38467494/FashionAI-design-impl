<template>
  <div class="admin-form-container">
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
      <!-- <el-col type="flex" align="end">
        <el-button
          type="success"
          round
          plain
          :disabled="multipleSelection.length == 0"
          >通过选中</el-button
        >
      </el-col> -->
    </el-row>
    <el-table
      height="65vh"
      id="suit-admin-table"
      class="admin-table"
      ref="recSuitTable"
      key="recSuitTable"
      :data="tableData"
      stripe
      :default-sort="{ prop: 'id', order: 'descending' }"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @filter-change="handleFilterChange"
    >
      <el-table-column type="selection" width="30"> </el-table-column>
      <el-table-column type="expand" width="20">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="admin-table-expand"
            label-width="80px"
          >
            <el-form-item label="用户ID: ">
              <span>{{ props.row.customerId }}</span>
            </el-form-item>
            <el-form-item label="素材列表: ">
              <span>{{ props.row.materialIds }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="imgUrl" label="图片" width="180">
        <template slot-scope="scope">
          <el-image
            class="admin-item-img-large"
            :src="scope.row.imgUrl"
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="作品名"
        width="80"
        :show-overflow-tooltip="true"
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
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <!-- <el-table-column
        prop="scanCount"
        label="浏览数"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="likeCount"
        label="点赞数"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="collectCount"
        label="收藏数"
        width="80"
      ></el-table-column> -->
      <el-table-column prop="status" label="状态" width="80"
        ><template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.status == 0">
            <el-tooltip
              class="item"
              effect="dark"
              content="已被删除的作品"
              placement="right-start"
            >
              <span>已删除</span></el-tooltip
            ></el-tag
          >
          <el-tag type="info" v-if="scope.row.status == 1">
            <el-tooltip
              class="item"
              effect="dark"
              content="已保存为草稿的作品"
              placement="right-start"
              ><span>草稿</span></el-tooltip
            ></el-tag
          >
          <el-tag type="primary" v-if="scope.row.status == 2">
            <el-tooltip
              class="item"
              effect="dark"
              content="已发布到个人空间的作品"
              placement="right-start"
            >
              <span>已完成</span>
            </el-tooltip></el-tag
          >
          <el-tag type="success" v-if="scope.row.status == 3">
            <el-tooltip
              class="item"
              effect="dark"
              content="已发布到分享区的作品"
              placement="right-start"
              ><span>已发布</span></el-tooltip
            >
          </el-tag>
        </template></el-table-column
      >
      <el-table-column prop="auditStatus" label="审核结果" width="80"
        ><template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.auditStatus == 0">未审核</el-tag>
          <el-tag type="primary" v-if="scope.row.auditStatus == 1">通过</el-tag>
          <el-tag type="danger" v-if="scope.row.auditStatus == 2"
            >未通过</el-tag
          >
        </template></el-table-column
      >
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <!-- 可以审核的情况：用户选择发布作品到分享区-status=3 -->
          <!-- TOFIX -->
          <el-button
            @click="handleEdit(scope.$index, scope.row)"
            size="small"
            type="primary"
            :disabled="scope.row.status < 3"
            >审核</el-button
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
import { getSuitPage, getSuitByIds } from "@/api/recommendationAPI";
import { showLoading, hideLoading } from "../../loading";
import Vue from "vue";

export default {
  name: "suitTable",
  data: function () {
    return {
      statusFilters: [
        { text: "已删除", value: 0 },
        { text: "草稿", value: 1 },
        { text: "已完成", value: 2 },
        { text: "已发布", value: 3 },
      ],
      selectedStatus: [],
      multipleSelection: [], // 多选
      // 分页
      currentPage: 1,
      pageSize: 3,
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
      this.selectedStatus = columnKey.status;
      console.log("selectedStatus: ", this.selectedStatus);
      this.currentPage = 1; // 回到头一页
      this.initSuitList();
    },
    // 跳转到编辑页
    handleEdit(index, row) {
      this.$router.push({
        name: "suitEdit",
        query: { id: row.id }, // 编辑已有单品时要带上id
      });
    },
    // 跳转到新增页
    handleAdd() {
      this.$router.push({
        name: "suitEdit", // 新增单品不用带id
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
      this.initSuitList();
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
        this.initSuitList();
      } else {
        // 搜索该id相应的素材
        let id = value - 0;
        let ids = [];
        ids.push(id);
        getSuitByIds({ params: { ids: ids } }).then((res) => {
          console.log(res);
          this.tableData = res.data.data.suits;
        });
      }
    },
    /**
     * 初始化
     */
    initSuitList() {
      let status = [0, 2, 3]; // 草稿除外
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: status,
      };
      if (this.selectedStatus & (this.selectedStatus.length > 0)) {
        // 如果有筛选才传入status参数；否则不传入，则status不会成为筛选条件
        Vue.set(params, "status", this.selectedStatus);
      }
      showLoading(".admin-list-card");
      getSuitPage({
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
    this.initSuitList();
  },
};
</script>
<style>
</style>
