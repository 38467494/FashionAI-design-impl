<template>
  <!-- 素材新增/修改 -->
  <div class="admin-form-container">
    <el-empty
      v-if="materialEditForm.id == null && materialId != null"
      :image-size="200"
    ></el-empty>
    <el-form
      v-else
      :model="materialEditForm"
      label-width="80px"
      label-position="left"
      style="width: 100%"
    >
      <el-row type="flex" justify="start">
        <el-col :span="9" justify="center">
          <el-form-item prop="imgUrl">
            <!-- 选择图片时不上传，按下提交按钮再上传（手动上传）；只接受jpg和png；不接受多选 -->
            <!-- 图片上传逻辑：可以成功提交的两种情况：if file; else if imgUrl && !file;   -->
            <div class="admin-result-img-container">
              <el-image
                class="admin-edit-img"
                :src="materialEditForm.imgUrl"
                fit="contain"
              ></el-image>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="12" align="start">
          <el-form-item label="ID" prop="id">
            <span>{{ materialEditForm.id }}</span>
          </el-form-item>
          <el-form-item label="种类" prop="categoryId">
            <span>{{ materialEditForm.categoryName }}</span>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId">
            <span>{{ materialEditForm.brandName }}</span>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <span>{{ materialEditForm.price }}</span>
          </el-form-item>
          <el-form-item label="链接" prop="linkUrl">
            <span>{{ materialEditForm.linkUrl }}</span>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <span>{{ materialEditForm.description }}</span>
          </el-form-item>
          <el-form-item label="目标人群" prop="targetPopulation">
            <span v-if="materialEditForm.targetPopulation == 'F'">女</span>
            <span v-if="materialEditForm.targetPopulation == 'M'">男</span>
            <span v-if="materialEditForm.targetPopulation == 'G'">女孩</span>
            <span v-if="materialEditForm.targetPopulation == 'B'">男孩</span>
          </el-form-item>
          <el-row type="flex" align="end" justify="end">
            <el-button @click="goBack()">回到列表</el-button>
            <el-button @click="goToEdit()" type="primary">继续编辑</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getMaterialByIds } from "@/api/recommendationAPI";
import { hideLoading, showLoading } from "../../../recommendation/loading";
export default {
  name: "materialEdit",
  data: function () {
    // 图片校验
    return {
      materialEditForm: null,
      materialId: null,
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "materialTable",
      });
    },
    goToEdit() {
      this.$router.push({
        name: "materialEdit",
        query: { id: this.materialId },
      });
    },
    init() {
      this.$router.onReady(() => {
        this.materialId = this.$route.query.id;
        showLoading(".admin-form-container");
        if (this.materialId) {
          // 如果有id，则为修改原有商品；否则为新增
          let ids = [];
          ids.push(this.materialId);
          getMaterialByIds({ params: { ids: ids } }).then((res) => {
            let data = res.data;
            this.materialEditForm = data.data.materials[0];
            console.log("material edit form: ", this.materialEditForm);
          });
        }
        hideLoading();
      });
    },
  },
  mounted: function () {
    this.init();
  },
};
</script>
