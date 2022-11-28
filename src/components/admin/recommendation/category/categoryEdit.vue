<template>
  <!-- 素材新增/修改 -->
  <div class="admin-form-container">
    <el-empty
      v-if="categoryEditForm.id == null && categoryId != null"
      :image-size="200"
    ></el-empty>
    <el-form
      v-else
      ref="categoryEditForm"
      :model="categoryEditForm"
      :rules="rules"
      label-width="80px"
      label-position="left"
      style="width: 100%"
    >
      <el-row type="flex" justify="start">
        <el-col :span="9" justify="center">
          <el-form-item label="ID" prop="id">
            <el-input v-model="categoryEditForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item prop="imgUrl">
            <!-- 选择图片时不上传，按下提交按钮再上传（手动上传）；只接受jpg和png；不接受多选 -->
            <!-- 图片上传逻辑：可以成功提交的两种情况：if file; else if imgUrl && !file;   -->
            <el-upload
              ref="categoryFileUpload"
              class="admin-edit-uploader"
              action="#"
              accept=".png, .jpg"
              :multiple="false"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleChange"
            >
              <el-image
                v-if="tmpUrl"
                class="admin-edit-img"
                :src="tmpUrl"
                fit="contain"
              ></el-image>
              <el-image
                v-else-if="categoryEditForm.imgUrl"
                class="admin-edit-img"
                :src="categoryEditForm.imgUrl"
                fit="contain"
              ></el-image>
              <i v-else class="el-icon-plus admin-edit-img-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="12" align="start">
          <el-form-item label="名称" prop="categoryName">
            <el-input v-model="categoryEditForm.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="recCategory">
            <el-select
              v-model="categoryEditForm.recCategory"
              placeholder="请选择分类"
            >
              <el-option
                v-for="option in recCategoryOptions"
                :key="option.label"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              v-model="categoryEditForm.description"
              auto-complete="off"
              :rows="3"
            ></el-input>
          </el-form-item>

          <el-row type="flex" align="end" justify="end">
            <el-button @click="goBack()">返回</el-button>
            <el-button @click="submitForm('categoryEditForm')" type="primary"
              >提交</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getCategoryByIds, saveCategory } from "@/api/recommendationAPI";
import { hideLoading, showLoading } from "../../../recommendation/loading";
export default {
  name: "categoryEdit",
  data: function () {
    // 图片校验
    // 图片上传逻辑：可以成功提交的两种情况：if file：上传了本地图片; else if imgUrl && !file：没有更新图片但是有原数据
    var validateImg = (rule, value, callback) => {
      if (this.uploadFile != null) {
        callback();
      } else if (this.categoryEditForm.imgUrl != null) {
        callback();
      } else {
        callback(new Error("请上传图片"));
      }
    };
    return {
      uploadFile: null,
      tmpUrl: null, // 本地图片地址
      categoryEditForm: {
        id: null,
        categoryName: null,
        description: null,
        imgUrl: null,
        recCategory: null,
      },
      rules: {
        recCategory: [
          { required: true, message: "请选择分类", trigger: "blur" },
        ],
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        imgUrl: [{ validator: validateImg, trigger: "blur" }],
      },
      categoryId: null,
      recCategoryOptions: [
        {
          label: "上衣",
          value: "upper",
        },
        {
          label: "下衣",
          value: "bottom",
        },
        {
          label: "包",
          value: "bag",
        },
        {
          label: "鞋",
          value: "shoe",
        },
        {
          label: "其他",
          value: "invalid",
        },
      ],
    };
  },
  methods: {
    // 选择图片后显示
    handleChange(file) {
      console.log(file);
      this.uploadFile = file.raw; // blob格式
      let reader = new FileReader();
      reader.readAsDataURL(this.uploadFile);
      let that = this;
      reader.onload = function (e) {
        that.tmpUrl = e.target.result;
      };
      console.log(this.uploadFile, this.tmpUrl);
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          showLoading(".admin-form-container");
          const form = this.categoryEditForm;
          console.log("categoryEditForm: ", this.categoryEditForm);
          var formData = new FormData();
          formData.append("id", form.id);
          formData.append("categoryName", form.categoryName);
          formData.append("recCategory", form.recCategory);
          formData.append("description", form.description);
          formData.append("file", this.uploadFile);
          console.log("form data: ", formData);
          saveCategory(formData).then((res) => {
            // 应该返回id
            console.log(res);
            let data = res.data.data;
            this.$message({
              showClose: true,
              message: "信息提交成功！一秒后刷新页面……",
              type: "success",
            });
            setTimeout(() => {
              this.$router.push({
                name: "categoryTable",
              });
            }, 1000);
          });
        } else {
          // 一定要写else要不然validate不会生效
          console.log("error submit");
          this.$message({
            showClose: true,
            message: "信息提交失败",
            type: "error",
          });
          return false;
        }
        hideLoading();
      });
    },
    goBack() {
      this.$router.push({
        name: "categoryTable",
      });
    },
  },
  mounted: function () {
    this.$router.onReady(() => {
      this.categoryId = this.$route.query.id;
      showLoading(".admin-form-container");
      if (this.categoryId) {
        // 如果有id，则修改原数据，否则为新增
        let ids = [];
        ids.push(this.categoryId);
        getCategoryByIds({ params: { ids: ids } }).then((res) => {
          let data = res.data.data;
          this.categoryEditForm = data.categories[0];
          console.log("category edit form: ", this.categoryEditForm);
        });
      }
      hideLoading();
    });
  },
};
</script>
