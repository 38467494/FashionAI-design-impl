<template>
  <el-drawer
    title="草稿"
    size="40%"
    :visible.sync="drawerVisible"
    direction="rtl"
    :before-close="handleDrawerClose"
  >
    <div style="margin-top: 5px; height: 100%" id="drawer-inner">
      <el-row
        id="draft-list"
        class="draft-list"
        justify="start"
        align="top"
        style="width: 100%; padding-left: 10px; padding-right: 10px"
        :gutter="10"
      >
        <!-- key用item的话出现warning：Duplicate keys detected: '[object Object]'. This may cause an update error. -->
        <el-empty v-if="records.length == 0" :image-size="200"></el-empty>
        <template v-if="isManageMode">
          <!-- 管理草稿 -->
          <el-checkbox-group
            v-model="selectedDraft"
            @change="handleDraftSelect"
          >
            <el-col :span="8" v-for="record in records" :key="record.id">
              <el-checkbox-button :label="record.id">
                <el-image
                  style="background: white"
                  :id="record.id"
                  :src="record.imgUrl"
                  fit="contain"
                >
                </el-image>
                <div style="margin-top: 20px">《{{ record.name }}》</div>
              </el-checkbox-button>
            </el-col>
          </el-checkbox-group>
        </template>
        <template v-else>
          <!-- 非管理模式 -->
          <el-col :span="8" v-for="record in records" :key="record.id">
            <el-link
              @click="handleDraftClick(record.canvas)"
              :title="record.description"
            >
              <el-card
                class="draft-card"
                shadow="hover"
                :body-style="{ padding: '2px' }"
              >
                <el-image :id="record.id" :src="record.imgUrl" fit="contain">
                </el-image>
                <div style="margin-top: 20px">《{{ record.name }}》</div>
              </el-card>
            </el-link>
          </el-col>
        </template>
      </el-row>
      <template v-if="isManageMode" id="draft-manage-bth">
        <el-button
          size="small"
          type="primary"
          class="draft-manage-btn"
          @click="handleManageModeChange"
          >取消</el-button
        >
        <el-button
          size="small"
          type="danger"
          style="margin-left: 5px"
          class="delete-btn"
          @click="handleDraftDelete"
          >删除</el-button
        >
      </template>
      <template v-else>
        <el-button
          size="small"
          type="primary"
          class="draft-manage-btn"
          @click="handleManageModeChange"
        >
          管理</el-button
        >
      </template>
      <el-pagination
        id="draft-pagination"
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
  </el-drawer>
</template>
<script>
import { getSuitPage, deleteDrafts } from "@/api/recommendationAPI";
import { showLoading, hideLoading } from "./loading";

export default {
  name: "recSuitDraft",
  data: function () {
    return {
      drawerVisible: false,
      currentPage: 1,
      pageSize: 9,
      total: null, // 总素材数
      records: [],
      //   管理模式
      isManageMode: false,
      selectedDraft: [],
    };
  },
  methods: {
    /**管理模式 */
    handleManageModeChange() {
      this.isManageMode = !this.isManageMode;
    },
    handleDraftSelect(val) {
      console.log(val);
    },
    // 删除草稿
    handleDraftDelete() {
      this.$confirm("草稿被删除后不可复原，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var formData = new FormData();
          formData.append("ids", this.selectedDraft);
          formData.append("customerId", this.$store.state.phone);
          console.log(formData);
          showLoading("#drawer-inner");
          deleteDrafts(formData)
            .then((res) => {
              console.log(res);
              this.initSuitList();
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.isManageMode = false;
              hideLoading();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败",
              });
              hideLoading();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**将草稿添加到画布上 */
    handleDraftClick(canvas) {
      this.$emit("loadFromDraft", canvas);
      this.drawerVisible = false;
    },
    /**关闭抽屉 */
    drawerPop() {
      this.initSuitList(); // 每次弹出加载一次
      this.drawerVisible = true;
      this.isManageMode = false;
    },
    handleDrawerClose() {
      this.drawerVisible = false;
    },
    /**查询素材列表 */
    initSuitList() {
      showLoading(".draft-list");
      let status = [1]; // 发布到个人空间/分享区
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        customerId: this.$store.state.phone,
        status: status,
      };
      getSuitPage({ params: params }).then((res) => {
        let data = res.data.data;
        this.records = data.records;
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
  },
};
</script>
<style>
.draft-card {
  height: 150px;
  height: 150px;
  margin-bottom: 5px;
}
.draft-card .el-image {
  width: 100%;
  display: block;
}
.draft-manage-btn {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
.delete-btn {
  position: absolute;
  bottom: 5px;
  left: 80px;
}
#draft-pagination {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
</style>