<template>
  <div>
    <rec-form
      @getRecommendations="getRecommendations"
      style="width: 100%"
    ></rec-form>
    <div id="rec-list" class="material-list">
      <div class="text-left font-semibold text-1xl border-b pb-2" v-if="recommendations.length>0">推荐结果显示</div>
      <el-row id="rec-ul" class="ul" type="flex" align="start">
        <el-link
          v-for="recommendation in recommendations.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )"
          :key="recommendation.id"
        >
          <!-- 每个图片的id都是其对应素材对象的id；可拖动 -->
          <el-image
            :id="recommendation.id"
            :price="recommendation.price"
            :src="recommendation.imgUrl"
            :categoryId="recommendation.categoryId"
            :recCategory="recommendation.recCategory"
            :title="recommendation.description"
            class="item-img"
            draggable="true"
            @dragstart="handleDragStart($event)"
            @dragend="handleDragEnd($event)"
            fit="contain"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-link>
      </el-row>
      <el-row
        v-if="recommendations && recommendations.length > 0"
        type="flex"
        justify="space-between"
        align="bottom"
      >
        <div class="response-time" style="margin-bottom: 5px">
          响应时间：
          <!-- 根据响应时间长度用不同颜色 -->
          <template class="response-time-rank">
            <span v-if="interval < 30" style="color: green">
              {{ interval }}s</span
            >
            <span v-else-if="interval < 60" style="color: blue">
              {{ interval }}s</span
            >
            <span v-else style="color: lightsalmon"> {{ interval }}s</span>
          </template>
        </div>
        <el-pagination
          small
          type="flex"
          class="pagination"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="recommendations.length"
        >
        </el-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import RecForm from "./recForm.vue";
export default {
  name: "recMenu",
  components: {
    RecForm,
  },
  data: function () {
    return {
      interval: 0, // 查询用时
      currentPage: 1, // 推荐库初始页面
      pageSize: 4, // 推荐库每页显示数据
      recommendations: [],
    };
  },
  methods: {
    /** 推荐列表 */
    getRecommendations(data) {
      console.log(data);
      this.interval = data.interval;
      this.recommendations = data.recommendations;
      console.log("recommendations: ", this.recommendations);
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
    /** 分页 */
    // 推荐分页页面大小管理
    handlePageSizeChange(size) {
      this.pageSize = size;
      console.log(this.pageSize);
    },
    // 推荐换页管理
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage);
    },
  },
};
</script>
<style>
#rec-list {
  height: 160px;
  position: relative;
}
#rec-ul {
  height: 100%;
}
.response-time {
  color: grey;
  font-size: 13px;
}
.item-img {
  width: 130px;
  height: 160px;
  cursor: move;
  background: white;
  padding-left: 2px;
  padding-right: 2px;
  margin-top: 19px;
  margin-left: 27px;
}
</style>
