<template>
  <!-- 套装详细信息弹窗 -->
  <el-dialog
    title="作品预览"
    :visible.sync="dialogFormVisible"
    @close="dialogFormClose"
    width="60%"
  >
    <el-row type="flex" justify="space-between" id="suit-dialog-content">
      <el-col :span="15">
<!--        <h3 style="text-align: left">作品预览</h3>-->
        <div id="canvas-img-container"></div>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="7" justify="end">
        <el-form
          ref="suitForm"
          id="suitForm"
          :model="suitForm"
          :rules="rules"
          label-position="right"
          label-width="50px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="suitForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input
              v-model="price"
              disabled="disabled"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              type="textarea"
              v-model="suitForm.description"
              auto-complete="off"
              :rows="8"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormClose">取消</el-button>
      <el-button type="primary" @click="submitForm('suitForm', status)">{{
        submitLabel
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {saveSuit} from "../../api/recommendationAPI";
import { showLoading, hideLoading } from "./loading";
import { saveOneWork } from "../../api/workAPI";
export default {
  name: "SuitSaveDialog",
  props: {
    status: {
      type: Number,
      default: false,
    },
    canvas: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },

  computed: {
    submitLabel() {
      return this.status == 2 ? "收藏" : "保存草稿"; // 提交时按钮提示文字
    },
    materialIds() {
      return this.$store.state.materialIds;
    },
    materialUrls() {
      return this.$store.state.materialUrls;
    },
    price() {
      return this.$store.state.price;
    },
  },
  data: function () {
    return {
      outfitUrl: null,
      materialUrls: [],
      title: null,
      description: null,
      category: "",
      dialogFormVisible: false,
      suitForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入作品名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在1到15个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 弹出dialog */
    dialogFormPop() {
      if (this.canvas.getObjects().length < 1) {
        // 画布空白
        this.$message({
          showClose: true,
          message: "请先组合作品",
          type: "warning",
        });
        return false;
      }
      // 清除canvas中的选中框并重新渲染
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      console.log("canvas objects: ", this.canvas.getObjects());
      this.dialogFormVisible = true; // 得把弹窗打开才能获取到canvas-img-container
      // 生成canvas blob文件，并在dialog中创建对应的img对象
      var canvas = document.getElementById("canvas");
      canvas.toBlob(function (blob) {
        var newImg = document.createElement("img"); // <img>对象
        newImg.style.height = "300px";
        newImg.style.border = "solid 1px rgba(0, 0, 0, 0.1)";
        var url = URL.createObjectURL(blob);
        console.log(url);

        newImg.onload = function () {
          URL.revokeObjectURL(url); // 注销该url
        };
        newImg.src = url; // 设置选中的图片
        // 添加图片到dialog中
        var imgContainer = document.getElementById("canvas-img-container");
        imgContainer.appendChild(newImg);
      });
    },
    /** 关闭dialog */
    dialogFormClose() {
      var imgContainer = document.getElementById("canvas-img-container");
      while (imgContainer.firstChild) {
        // 清空container
        imgContainer.removeChild(imgContainer.firstChild);
      }
      this.dialogFormVisible = false;
    },
    /** 提交作品 */
    submitForm(formName, status) {
      let price = this.price;
      let materialIds = this.materialIds.join(",");
      let materialUrls = this.materialUrls.join(",");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          showLoading("#suit-dialog-content");
          const form = this.suitForm;
          var canvas = document.getElementById("canvas");
          canvas.toBlob((blob) => {
            // 上传文件和表单
            var formData = new FormData();
            formData.append("file", blob);
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", price);
            formData.append("status", status); // status: 0删除，1发布，2草稿
            formData.append("materialIds", materialIds);
            formData.append("materialUrls", materialUrls);
            formData.append("customerId", this.$store.state.phone); // 暂时用电话号码作为用户标识
            // 画布信息
            formData.append("canvas", JSON.stringify(this.canvas));
            console.log("form data: ", formData.getAll("file"));
            saveSuit(formData)
              .then(res => {
                console.log(res);
                let data = res.data.data.savedSuit;
                console.log(data);
                if (status == 2) {
                  // 如果是发布了的作品，保存到收藏表格
                  this.saveWork(data);
                } else {
                  // 如果是草稿，给个保存成功的提示就好咯
                  this.$message({
                    showClose: true,
                    message: "保存草稿成功",
                    type: "success",
                  });
                }
                this.dialogFormClose();
              })
              .catch((err) => {
                console.log(err);
                this.$message({
                  showClose: true,
                  message: this.submitLabel + "失败",
                  type: "error",
                });
              });
            hideLoading();
          });
        } else {
          // 一定要写else否则校验会失效，，，
          console.log("invalid form", valid);
        }
      });
    },
    /**收藏作品，work表 */
    saveWork(data) {
      var workDescription = {
        materialUrls: data.materialUrls,
        materialIds: data.materialIds,
        price: data.price,
      };
      var info = {
        category: "recommend",
        workDescription: workDescription,
        coverUrl: data.imgUrl,
        title: data.name,
        wordDescription: data.description,
      };
      info["userName"] = this.$store.state.userName;
      info["phone"] = this.$store.state.phone;
      console.log("info", info);
      saveOneWork(info)
        .then((res) => {
          console.log("save one work (include wordDescription and title)", res);
          this.$message({
            showClose: true,
            message: "发布作品成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log("save one work", err);
          this.$message({
            showClose: true,
            message: "发布作品失败",
            type: "error",
          });
        });
    },
  },
};
</script>
