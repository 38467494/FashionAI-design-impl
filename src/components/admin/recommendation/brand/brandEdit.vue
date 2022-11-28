<template>
  <!-- 素材新增/修改 -->
  <!-- <el-row class="admin-form-container" type="flex" justify="center" align="start" style="height: 100%;"> -->
  <div class="admin-form-container">
    <el-empty
      v-if="brandEditForm.id == null && brandId != null"
      :image-size="200"
    ></el-empty>
    <el-form
      v-else
      ref="brandEditForm"
      :model="brandEditForm"
      :rules="rules"
      label-width="80px"
      label-position="left"
      style="width: 100%"
    >
      <el-row type="flex" justify="start">
        <el-col :span="9" justify="center">
          <el-form-item label="ID" prop="id">
            <el-input v-model="brandEditForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item prop="imgUrl">
            <!-- 选择图片时不上传，按下提交按钮再上传（手动上传）；只接受jpg和png；不接受多选 -->
            <!-- 图片上传逻辑：可以成功提交的两种情况：if file; else if imgUrl && !file;   -->
            <el-upload
              ref="brandFileUpload"
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
                v-else-if="brandEditForm.imgUrl"
                class="admin-edit-img"
                :src="brandEditForm.imgUrl"
                fit="contain"
              ></el-image>
              <i v-else class="el-icon-plus admin-edit-img-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="12" align="start">
          <el-form-item label="名称" prop="brandName">
            <el-input v-model="brandEditForm.brandName"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              v-model="brandEditForm.description"
              auto-complete="off"
              :rows="3"
            ></el-input>
          </el-form-item>
          <el-row type="flex" align="end" justify="end">
            <el-button @click="goBack()">返回</el-button>
            <el-button @click="submitForm('brandEditForm')" type="primary"
              >提交</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <!-- </el-row> -->
  </div>
</template>
<script>
import { getBrandByIds, saveBrand } from "@/api/recommendationAPI";
import editDraw from "../../../collaborate/nav/editDraw.vue";
import { hideLoading, showLoading } from "../../../recommendation/loading";
export default {
  components: { editDraw },
  name: "brandEdit",
  data: function () {
    // 图片校验
    // 图片上传逻辑：可以成功提交的两种情况：if file：上传了本地图片; else if imgUrl && !file：没有更新图片但是有原数据
    var validateImg = (rule, value, callback) => {
      if (this.uploadFile != null) {
        callback();
      } else if (this.brandEditForm.imgUrl != null) {
        callback();
      } else {
        callback(new Error("请上传图片"));
      }
    };
    return {
      uploadFile: null,
      tmpUrl: null, // 本地图片地址
      brandEditForm: {
        id: null,
        brandName: null,
        description: null,
        imgUrl: null,
      },
      rules: {
        brandName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" },
          {
            min: 3,
            max: 200,
            message: "长度控制在3-200字之间",
            trigger: "blur",
          },
        ],
        imgUrl: [{ validator: validateImg, trigger: "blur" }],
      },
      brandId: null,
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
          const form = this.brandEditForm;
          console.log("brandEditForm: ", this.brandEditForm);
          var formData = new FormData();
          formData.append("id", form.id);
          formData.append("brandName", form.brandName);
          formData.append("description", form.description);
          formData.append("file", this.uploadFile);
          console.log("form data: ", formData);
          saveBrand(formData).then((res) => {
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
                name: "brandTable",
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
        name: "brandTable",
      });
    },
  },
  mounted: function () {
    this.$router.onReady(() => {
      this.brandId = this.$route.query.id;
      showLoading(".admin-form-container");
      if (this.brandId) {
        // 如果有id，则修改原数据，否则为新增
        let ids = [];
        ids.push(this.brandId);
        getBrandByIds({ params: { ids: ids } }).then((res) => {
          let data = res.data.data;
          this.brandEditForm = data.brands[0];
          console.log("brand edit form: ", this.brandEditForm);
        });
      }
      hideLoading();
    });
  },
};
</script>
