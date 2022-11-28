<template>
  <!-- 素材新增/修改 -->
  <div class="admin-form-container">
    <el-empty v-if="suitEditForm == null" :image-size="200"></el-empty>
    <el-form
      v-else
      id="suitEditForm"
      ref="suitEditForm"
      :model="suitEditForm"
      label-width="80px"
      label-position="left"
      style="width: 100%"
    >
      <el-row type="flex" justify="start">
        <el-col :span="11" align="start" justify="center">
          <el-form-item>
            <!-- 选择图片时不上传，按下提交按钮再上传（手动上传）；只接受jpg和png；不接受多选 -->
            <!-- 图片上传逻辑：可以成功提交的两种情况：if file; else if imgUrl && !file;   -->
            <div class="admin-result-img-container">
              <el-image
                class="admin-edit-img"
                :src="suitEditForm.imgUrl"
                fit="contain"
              ></el-image>
            </div>
          </el-form-item>
          <el-descriptions direction="vertical" size="small" :column="6" border>
            <el-descriptions-item label="作品ID">{{
              suitEditForm.id
            }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{
              suitEditForm.customerId
            }}</el-descriptions-item>
            <el-descriptions-item label="价格">{{
              suitEditForm.price
            }}</el-descriptions-item>
            <el-descriptions-item label="浏览数">{{
              suitEditForm.scanCount
            }}</el-descriptions-item>
            <el-descriptions-item label="点赞数">{{
              suitEditForm.likeCount
            }}</el-descriptions-item>
            <el-descriptions-item label="收藏数">{{
              suitEditForm.collectCount
            }}</el-descriptions-item>
            <el-descriptions-item label="描述">
              {{ suitEditForm.description }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="10" align="start">
          <el-form-item label="审核状态">
            <el-select
              v-model="suitEditForm.auditStatus"
              placeholder="请选择审核状态"
              filterable
            >
              <el-option
                v-for="option in auditStatusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              type="textarea"
              v-model="suitEditForm.auditDescription"
              auto-complete="off"
              :rows="3"
            ></el-input>
          </el-form-item>
          <el-row type="flex" align="end" justify="end">
            <el-button @click="goBack()">回到列表</el-button>
            <el-button
              @click="submitForm('suitEditForm')"
              type="primary"
              :disabled="suitEditForm.auditStatus == 0"
              >提交</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getSuitByIds, auditSuits } from "@/api/recommendationAPI";
import { hideLoading, showLoading } from "../../../recommendation/loading";
export default {
  name: "suitEdit",
  data: function () {
    return {
      suitEditForm: null,
      suitId: null,
      auditStatusOptions: [
        {
          label: "待审核",
          value: 0,
        },
        {
          label: "通过",
          value: 1,
        },
        {
          label: "不通过",
          value: 2,
        },
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "suitTable",
      });
    },
    // 提交审核
    submitForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          showLoading("#suit-dialog");
          const form = this.suitEditForm;
          let formData = new FormData();
          formData.append("id", form.id);
          formData.append("auditStatus", form.auditStatus);
          formData.append("auditDescription", form.auditDescription);
          auditSuits(formData)
            .then((res) => {
              console.log(res);
              this.$message({
                showClose: true,
                message: "审核信息提交成功！一秒钟后跳转页面……",
                type: "success",
              });
              setTimeout(() => {
                this.$router.push({
                  name: "suitTable",
                  // query: { id: data.id },
                });
              }, 1000);
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "审核信息提交失败",
              });
            });
          hideLoading();
        }
      });
    },
    // 初始化
    init() {
      this.$router.onReady(() => {
        this.suitId = this.$route.query.id;
        showLoading(".admin-form-container");
        if (this.suitId) {
          // 如果有id，则为修改原有商品；否则为新增
          let ids = [];
          ids.push(this.suitId);
          getSuitByIds({ params: { ids: ids } }).then((res) => {
            let data = res.data;
            this.suitEditForm = data.data.suits[0];
            console.log("suit edit form: ", this.suitEditForm);
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
<style>
#suitEditForm .el-form__label {
  color: lightgrey;
}
</style>