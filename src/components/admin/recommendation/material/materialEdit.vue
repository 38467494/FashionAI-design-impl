<template>
  <!-- 素材新增/修改 -->
  <div class="admin-form-container">
    <el-empty
      v-if="materialEditForm.id == null && materialId != null"
      :image-size="200"
    ></el-empty>
    <el-form
      v-else
      ref="materialEditForm"
      :model="materialEditForm"
      :rules="rules"
      label-width="80px"
      label-position="left"
      style="width: 100%"
    >
      <el-row type="flex" justify="start">
        <el-col :span="9" justify="center">
          <el-form-item label="ID" prop="id">
            <el-input v-model="materialEditForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item prop="imgUrl">
            <!-- 选择图片时不上传，按下提交按钮再上传（手动上传）；只接受jpg和png；不接受多选 -->
            <!-- 图片上传逻辑：可以成功提交的两种情况：if file; else if imgUrl && !file;   -->
            <el-upload
              ref="materialFileUpload"
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
                v-else-if="materialEditForm.imgUrl"
                class="admin-edit-img"
                :src="materialEditForm.imgUrl"
                fit="contain"
              ></el-image>
              <i v-else class="el-icon-plus admin-edit-img-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="12" align="start">
          <el-form-item label="种类" prop="categoryId">
            <el-select
              v-model="materialEditForm.categoryId"
              placeholder="请选择种类"
              filterable
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.categoryName"
                :value="category.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId">
            <el-select
              v-model="materialEditForm.brandId"
              placeholder="请选择品牌"
              filterable
            >
              <el-option
                v-for="brand in brands"
                :key="brand.id"
                :label="brand.brandName"
                :value="brand.id"
              ></el-option
            ></el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="materialEditForm.price"></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="linkUrl">
            <el-input v-model="materialEditForm.linkUrl"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              v-model="materialEditForm.description"
              auto-complete="off"
              :rows="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="目标人群" prop="targetPopulation">
            <el-select
              v-model="materialEditForm.targetPopulation"
              placeholder="请选择目标人群"
            >
              <el-option
                v-for="option in targetPopulationOptions"
                :key="option.label"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-row
            type="flex"
            align="end"
            justify="end"
            style="margin-top: -15px"
          >
            <el-button @click="goBack()">返回</el-button>
            <el-button @click="submitForm('materialEditForm')" type="primary"
              >提交</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  getMaterialByIds,
  getCategoryList,
  getBrandList,
  saveMaterial,
} from "@/api/recommendationAPI";
import { hideLoading, showLoading } from "../../../recommendation/loading";
export default {
  name: "materialEdit",
  data: function () {
    // 图片校验
    // 图片上传逻辑：可以成功提交的两种情况：if file：上传了本地图片; else if imgUrl && !file：没有更新图片但是有原数据
    var validateImg = (rule, value, callback) => {
      if (this.uploadFile != null) {
        callback();
      } else if (this.materialEditForm.imgUrl != null) {
        callback();
      } else {
        callback(new Error("请上传图片"));
      }
    };
    return {
      uploadFile: null,
      tmpUrl: null, // 本地图片地址
      materialEditForm: {
        id: null,
        brandId: null,
        brandName: null,
        categoryId: null,
        categoryName: null,
        description: null,
        imgUrl: null,
        linkUrl: null,
        price: null,
        recCategory: null,
        status: null,
        targetPopulation: null,
      },
      rules: {
        categoryId: [
          { required: true, message: "请选择种类", trigger: "blur" },
        ],
        brandId: [{ required: true, message: "请选择品牌", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        linkUrl: [
          { required: true, message: "请输入商品链接", trigger: "blur" },
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
        targetPopulation: [
          { required: true, message: "请选择目标人群", trigger: "blur" },
        ],
        imgUrl: [{ validator: validateImg, trigger: "blur" }],
      },
      materialId: null,
      targetPopulationOptions: [
        {
          label: "女",
          value: "F",
        },
        {
          label: "男",
          value: "M",
        },
        {
          label: "女孩",
          value: "G",
        },
        {
          label: "男孩",
          value: "B",
        },
      ],
      categories: [],
      brands: [],
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
          const form = this.materialEditForm;
          console.log("materialEditForm: ", this.materialEditForm);
          var formData = new FormData();
          formData.append("id", form.id);
          formData.append("brandId", form.brandId);
          formData.append("categoryId", form.categoryId);
          formData.append("description", form.description);
          formData.append("price", form.price);
          formData.append("linkUrl", form.linkUrl);
          formData.append("targetPopulation", form.targetPopulation);
          formData.append("file", this.uploadFile);
          console.log("form data: ", formData);
          saveMaterial(formData).then((res) => {
            // 应该返回id
            console.log(res);
            let data = res.data.data;
            this.$message({
              showClose: true,
              message: "信息提交成功！一秒钟后跳转页面……",
              type: "success",
            });
            setTimeout(() => {
              this.$router.push({
                name: "materialResult",
                query: { id: data.id },
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
        name: "materialTable",
      });
    },
    init() {
      this.$router.onReady(() => {
        this.materialId = this.$route.query.id;
        showLoading(".admin-form-container");
        getCategoryList({}).then((res) => {
          console.log("categoryList res: ", res);
          let data = res.data;
          this.categories = data.data.categories;
          this.categoryFilters = this.categories.map((item) => {
            return {
              text: item.categoryName,
              value: item.categoryName,
              id: item.id,
            };
          });
          getBrandList({}).then((res) => {
            console.log("brandList res: ", res);
            let data = res.data;
            this.brands = data.data.brands;
            this.brandFilters = this.brands.map((item) => {
              return {
                text: item.brandName,
                value: item.brandName,
                id: item.id,
              };
            });
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
          });
        });
        hideLoading();
      });
    },
  },
  mounted: function () {
    this.init();
  },
};
</script>
