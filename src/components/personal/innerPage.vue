<template>
  <div v-loading="loading">
    <div
      class="border shadow-lg rounded-lg mx-auto my-12 p-8"
      round-radius="2xl"
      style="width:80%;"
    >
      <div v-if="isPublic" class="text-left mb-6">
        <AtsButton @click="goBack" type="primary" round plain size="small">
          <i class="bi bi-arrow-left"></i>
          返回
        </AtsButton>
      </div>

      <div class="flex gap-x-12 pb-8 pt-4">
        <div class="basis-4/12">
          <div class="p-2 rounded-xl border shadow-lg">
            <el-carousel height="400px" indicator-position="outside">
              <template v-for="(item, index) in urls">
                <el-carousel-item :key="index">
                  <el-image
                    v-if="item"
                    :src="item"
                    fit="contain"
                    style="height: 100%"
                  ></el-image>
                </el-carousel-item>
              </template>
            </el-carousel>
            <!-- 素材列表，点击可以跳转到原商品页面 -->
            <div v-if="category == '搭配推荐结果' && materials != null">
              <el-row type="flex" justify="start" align="top">
                <div
                  v-for="material in materials.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                  )"
                  :key="material.id"
                >
                  <el-link :href="material.linkUrl" target="_blank">
                    <!-- 每个图片的id都是其对应素材对象的id；可拖动 -->
                    <el-image
                      :id="material.id"
                      :categoryid="material.categoryId"
                      :recCategory="material.recCategory"
                      :price="material.price"
                      :src="material.imgUrl"
                      :title="material.description"
                      class="suit-item-img"
                      fit="contain"
                    >
                    </el-image>
                  </el-link>
                </div>
              </el-row>
              <el-row style="float: right; margin-top: -20px">
                <el-pagination
                  small
                  class="pagination"
                  @current-change="handleCurrentPageChange"
                  :current-page="currentPage"
                  :page-size="pageSize"
                  layout="prev, next"
                  :total="total"
                  style="opacity: 0.7"
                >
                </el-pagination>
              </el-row>
            </div>
          </div>
        </div>
        <div class="basis-6/12">
          <div v-if="isPublic">
            <h1 class="text-left font-bold text-3xl mb-12">
              {{ title }}
            </h1>

            <!-- label-descibe blocks-->
            <div class="text-left my-8">
              <div class="mb-8">
                <span class="font-bold text-base">类型：</span>
                <span class="text-slate-400">{{ category }}</span>
              </div>
              <div class="mb-8">
                <span class="font-bold text-base">作者：</span>
                <span @click="intoSpace" class="author-link ">{{
                  user
                }}</span>
                <span class="">于</span>
                <span class="text-slate-400">{{ date }}</span>
                <span class="">生成</span>
              </div>
              <div class="mb-8">
                <span
                  class="font-bold text-base"
                  v-if="category == '搭配推荐结果'"
                  >价格：</span
                >
                <span class="text-slate-400">{{ price }}</span>
              </div>
              <div class="mb-8">
                <span class="font-bold text-base">描述：</span>
                <span class="text-slate-400">{{ description }}</span>
              </div>
              <div v-if="category == '协同设计结果'">
                <div class="font-bold text-lg mb-8
                border-b-4 border-blue-500 max-w-max
                ">所属项目</div>
                <div class="mb-8 text-left">
                  <span class="font-bold text-base">项目名称:</span>
                  <span class="text-slate-400">
                    {{ projectIntro[0].content }}
                  </span>
                </div>
                <div class="text-left mb-8">
                  <span class="font-bold text-base">项目简介:</span>
                  <span class="text-slate-400">
                    {{ projectIntro[3].content }}
                  </span>
                </div>
              </div>
            </div>

            <div class="">
              <div class="flex justify-start cursor-pointer-items">
                <!-- 点赞 -->
                <div class="basis-1/5">
                  <div
                    style="width: 40px;height: 40px;text-align: center;margin: auto"
                  >
                    <span @click="handleZan">
                      <i class="iconfont el-icon-my-zan" v-if="!isZan"></i>
                      <i
                        class="iconfont iconfont-click el-icon-my-dianzan_kuai"
                        v-else
                      ></i>
                    </span>
                  </div>
                  <span
                    style="display: block"
                    class="text"
                    v-if="likeCnt != 0"
                    >{{ likeCnt }}</span
                  >
                  <span style="display: block" class="text" v-else>点赞</span>
                </div>

                <!-- 踩 (deprecated) -->
                <div style="display: none">
                  <div @click="handleCai">
                    <i class="iconfont el-icon-my-cai" v-if="!isCai"></i>
                    <i
                      class="iconfont iconfont-click el-icon-my-cai1"
                      v-else
                    ></i>
                  </div>
                  <span style="display: block" class="text">不喜欢</span>
                </div>

                <!-- 评论 -->
                <div class="basis-1/5">
                  <div
                    @click="handleComment"
                    style="width: 40px;height: 40px;text-align: center;margin: auto"
                  >
                    <i class="iconfont el-icon-my-duihua"></i>
                  </div>
                  <span style="display: block" class="text">评论</span>
                </div>

                <!-- 收藏 -->
                <div class="basis-1/5">
                  <!--                    <el-tooltip  effect="dark" content="收藏" placement="top-start">-->
                  <div
                    style="width: 40px;height: 40px;text-align: center;margin: auto"
                  >
                    <i
                      class="iconfont el-icon-my-shoucang"
                      @click="saveShare"
                      v-if="!isCollect"
                    ></i>
                    <i
                      class="iconfont iconfont-click el-icon-my-shoucang1"
                      style="color: #409EFF"
                      @click="deleteShare"
                      v-else
                    ></i>
                  </div>
                  <span style="display: block" class="text" v-if="!isCollect"
                    >收藏</span
                  >
                  <span style="display: block" class="text" v-else>已收藏</span>
                  <!--                    </el-tooltip>-->
                  <!--                    <span style="display: block" class="text">5</span>-->
                </div>

                <div class="basis-1/5" v-if="category == '协同设计结果'">
                  <div
                    style="width: 40px;height: 40px;text-align: center;margin: auto"
                  >
                    <el-tooltip
                      effect="dark"
                      content="添加为自己的协同设计项目"
                      placement="top-start"
                    >
                      <i
                        class="iconfont el-icon-my-tianjia"
                        style="font-size: 30px;margin: 5px"
                        @click="saveProject"
                      ></i>
                    </el-tooltip>
                  </div>
                  <span style="display: block" class="text">添加</span>
                </div>

                <div class="basis-1/5" v-if="isBenren == true">
                  <div
                    style="width: 40px;height: 40px;text-align: center;margin: auto"
                  >
                    <!--                    <el-tooltip  effect="dark" content="取消分享" placement="top-start">-->
                    <i
                      class="iconfont el-icon-my-shanchu"
                      style="font-size: 30px;margin: 5px"
                      @click="cancelWorkShare"
                    ></i>
                    <!--                    </el-tooltip>-->
                  </div>
                  <span style="display: block" class="text">取消分享</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="font-bold text-2xl text-left">发布你的设计稿</div>
            <br />
            <el-form label-width="50px" label-suffix=":">
              <el-form-item label="标题">
                <el-input class="bolded-input" v-model="title" placeholder="请输入标题"></el-input>
              </el-form-item>

              <el-form-item label="类型" style="text-align: left">
                <span class="variable">{{ category }}</span>
              </el-form-item>

              <el-form-item label="作者">
                <div class="text-left">
                  <span class="author-link">{{ user }}</span>
                  <span class="text">&nbsp;于&nbsp;</span>
                  <span class="text-slate-400"> {{ date }}</span>
                  <span class="text">&nbsp 生成 &nbsp</span>
                </div>
              </el-form-item>

              <el-form-item label="价格" v-if="category == '搭配推荐结果'">
                <p class="variable" style="margin: 0px">￥{{ price }}</p>
              </el-form-item>

              <el-form-item label="描述">
                <el-input
                  class="bolded-input"
                  v-model="description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入描述"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="所属项目"
                v-if="category == '协同设计结果'"
                label-width="100px"
              >
                <div style="text-align: left">
                  <span class="text">项目名称</span>
                  <span class="variable">
                    {{ projectIntro[0].content }}
                  </span>
                </div>
                <div style="text-align: left">
                  <span class="text">项目简介</span>
                  <span class="variable">
                    {{ projectIntro[3].content }}
                  </span>
                </div>
              </el-form-item>

              <el-form-item style="text-align: left">
                <AtsButton type="primary" @click="releaseShare">发布</AtsButton>
                <AtsButton type="pink" plain @click="deleteProject">删除设计</AtsButton>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="basis-2/12">
          <RecommendWorks/>
        </div>
      </div>

      <!--      评论区-->
      <div v-if="commentVisible">
        <el-divider></el-divider>
        <comment :wid="wid" :commentList="commentList"></comment>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <new-project
        :is-from-share="true"
        @saveVersion="saveVersion"
      ></new-project>
    </el-dialog>
  </div>
</template>

<script>
import {
  cancelWorkShare,
  getWorkDetail,
  saveOneLike,
  deleteOneLike,
  saveOneWork,
  deleteOneWork
} from "../../api/workAPI";
import { shareWorkCriteria } from "../../api/workAPI";
import { deleteShare, saveOneShare } from "../../api/shareAPI";
import NewProject from "../collaborate/main/newProject";
import { ColLogin, insertVersionDouble } from "../../api/collaborateAPI";
import Comment from "./comment";
import { getMaterialByIds } from "../../api/recommendationAPI";
import SimpleInfoCard from "../common/SimpleInfoCard";
import AtsButton from "../common/AtsButton";
import RecommendWorks from "../common/RecommendWorks.vue";

export default {
  name: "innerPage",
  components: { AtsButton, SimpleInfoCard, Comment, NewProject, RecommendWorks },
  data: function() {
    return {
      //当前模块是否是开放的（true：分享区内页，false：发布）
      isPublic: false,

      originalData: null, //从数据库中读取的初始数据

      // 走马灯中的图片
      urls: [],

      uid: null, //当前用户id

      wid: -1,
      title: null,
      user: "", //作者名称
      phone: "", //作者id
      date: "",
      // description: "这是一段介绍这是一段介绍这是一段介绍这是一段介绍这是一段介绍这是一段介绍这是一段介绍这是一段介绍这是一段介绍这是一段介绍",
      description: null,
      category: "",
      isBenren: false, //是否为本人

      // 搭配推荐
      price: null,
      materials: null,
      currentPage: 1,
      pageSize: 4,
      total: 0, // 素材数量

      isZan: false,
      lid: 0, //点赞对应id
      likeCnt: 10,
      isCai: false,
      isCollect: false, //当前设计是否被收藏
      shareId: -1,
      key: 0,

      //协同设计
      projectIntro: null,
      version: null,

      loading: true,

      dialogVisible: false,

      commentList: [],

      commentVisible: false
    };
  },
  mounted() {
    this.loading = true;
    var id = this.$store.state.shareInnerId;
    var uid = this.$store.state.phone;
    this.uid = uid;

    console.log(uid);

    let _this = this;

    getWorkDetail({
      wid: id,
      uid: uid
    }).then(res => {
      _this.originalData = res.data.data;
      _this.getInfo(res.data.data);
      _this.loading = false;
      _this.commentList = res.data.data.commentList;
      _this.lid = res.data.data.lid;
      _this.likeCnt = res.data.data.likeCnt;
      if (_this.lid == 0 || _this.lid == null) {
        _this.isZan = false;
      } else {
        _this.isZan = true;
      }
      if (uid == res.data.data.phone) {
        _this.isBenren = true;
      } else _this.isBenren = false;
      if (res.data.data.shareId != null && res.data.data.shareId != 0) {
        _this.isCollect = true;
        _this.shareId = res.data.data.shareId;
        console.log("shareId", _this.shareId);
      }
      console.log("innerPage", res.data.data);
    });
  },

  methods: {
    //通用函数
    //进入设计稿作者的个人空间
    intoSpace: function() {
      console.log("intoSpace", this.phone);
      this.$store.commit("changePersonalSpace", {
        phone: this.phone,
        userName: this.user
      });
      this.$router.push("/share-space");
    },
    //初始化页面信息
    getInfo: function(data) {
      this.wid = data.id;
      this.category = this.getCategoryName(data.category);
      this.phone = data.phone;
      this.user = data.userName;

      var uid = this.$store.state.phone;
      if (this.phone == uid) this.isCollect = true;
      // console.log(this.isCollect)

      if (data.category == "collaborate") this.getProjectIntro();

      this.getImages(data);

      if (data.workShared == 0) this.isPublic = false;
      else this.isPublic = true;

      if (this.isPublic) {
        this.title = data.title;
        this.description = data.wordDescription;
      }

      // 搭配推荐，已有部分作品信息
      if (data.category == "recommend") {
        this.title = data.title;
        this.description = data.wordDescription;
        this.price = JSON.parse(data.workDescription).price;
        // 获得materials信息
        let materialIds = JSON.parse(data.workDescription).materialIds;
        getMaterialByIds({ params: { ids: materialIds } }).then(res => {
          let data = res.data;
          this.materials = data.data.materials;
          this.total = this.materials.length;
          console.log("materials: ", this.materials);
        });
      }

      var date = data.createTime;
      var idx = date.indexOf("T");
      this.date = date.slice(0, idx);
    },
    getCategoryName: function(title) {
      //根据category的英文转成中文
      var titles = [
        "vton",
        "collaborate",
        "recommend",
        "MMC",
        "render",
        "outfit"
      ];
      var cName = [
        "虚拟换装结果",
        "协同设计结果",
        "搭配推荐结果",
        "搭配生成结果",
        "渲染生成结果",
        "推荐生成结果"
      ];
      for (var i = 0; i < titles.length; i++) {
        if (titles[i] == title) {
          return cName[i];
        }
      }
      return "";
    },
    getImages: function(data) {
      //根据work获得imageurl
      this.urls = [];
      this.urls.push(data.coverUrl);

      var work = JSON.parse(data.workDescription);
      if (data.category == "MMC") {
        this.urls.push(work.image);
        this.urls.push(work.result);
      } else if (data.category == "outfit") {
        this.urls.push(work.clothImage);
        this.urls = this.urls.concat(work.resultList);
        this.urls = this.urls.concat(work.maskList);
      } else if (data.category == "collaborate") {
        this.urls.push(work.frontImg);
        this.urls.push(work.backImg);
      } else if (data.category == "vton") {
        this.urls.push(work.model);
        this.urls.push(work.cloth);
        this.urls.push(work.result);
      } else if (data.category == "render") {
        this.urls.push(work.result);
        this.urls.push(work.sketch);
        this.urls.push(work.color);
      } else if (data.category == "recommend") {
        let urlStr = work.materialUrls;
        let urls = urlStr.split(",");
        console.log("urls", urls);
        for (let i = 0; i < urls.length; i++) {
          this.urls.push(urls[i]);
        }
      }
      console.log(work, this.urls);
    },
    getProjectIntro: function() {
      //若为协同设计，获取项目介绍
      var intro = JSON.parse(this.originalData.workDescription);
      this.projectIntro = intro.introduce;
      this.version = intro.version;
    },
    //返回上一个页面
    goBack: function() {
      this.$router.back();
    },

    //设计稿未发布相关函数
    //发布设计稿
    releaseShare: function() {
      if (this.title == null || this.title == "") {
        this.$message({
          type: "warning",
          message: "项目标题不能为空"
        });
        return;
      }

      let _this = this;

      shareWorkCriteria({
        id: _this.wid,
        title: _this.title,
        wordDescription: _this.description
      }).then(res => {
        _this.$message({
          type: "success",
          message: "设计稿发布成功"
        });
        var id = this.$store.state.shareInnerId;
        var uid = this.$store.state.phone;
        getWorkDetail({
          wid: id,
          uid: uid
        }).then(res => {
          _this.originalData = res.data.data;
          _this.getInfo(res.data.data);
        });
      });
    },

    //设计稿发布后 相关函数
    //检查用户是否登录
    checkLogin: function() {
      if (this.$store.state.phone == null) {
        this.$router.push({
          path: "/login",
          query: {
            redirect: "/innerPage"
          }
        });
        return false;
      }
      return true;
    },

    //收藏设计稿到 我的收藏
    saveShare: function() {
      let _this = this;
      if (!this.checkLogin()) {
        return;
      }
      var phone = this.$store.state.phone;
      var userName = this.$store.state.userName;
      saveOneShare({
        creatorUserName: _this.user,
        creatorPhone: _this.phone,
        creatorCoverUrl: _this.originalData.coverUrl,

        wid: _this.originalData.id,
        phone: phone,
        userName: userName,
        workCategory: _this.originalData.category
      }).then(res => {
        console.log("saveOneWork", res.data);
        _this.isCollect = true;
        _this.$message({
          type: "success",
          message: "收藏成功"
        });
        _this.shareId = res.data.data;
      });
    },

    deleteShare: function() {
      let _this = this;
      if (!this.checkLogin()) {
        return;
      }
      if (this.isBenren) {
        this.$message({
          type: "warning",
          message: "您为该设计的作者，不能取消收藏"
        });
        return;
      }
      deleteShare(this.shareId).then(res => {
        console.log(res.data);
        _this.isCollect = false;
      });
    },

    //点赞
    handleZan: function() {
      if (!this.checkLogin()) {
        return;
      }
      if (!this.isZan) {
        saveOneLike({
          wid: this.wid,
          uid: this.uid
        }).then(res => {
          console.log(res.data);
          this.isZan = !this.isZan;
          this.lid = res.data.data;
          this.likeCnt += 1;
        });
      } else {
        var lid = this.lid;
        deleteOneLike(lid).then(res => {
          console.log(res.data);
          this.isZan = !this.isZan;
          this.likeCnt -= 1;
        });
      }
    },

    //踩
    handleCai: function() {
      if (!this.checkLogin()) {
        return;
      }
      this.isCai = !this.isCai;
    },

    //评论
    handleComment: function() {
      this.commentVisible = !this.commentVisible;
    },

    cancelWorkShare: function() {
      let _this = this;
      if (!this.checkLogin()) {
        return;
      }
      this.$confirm("确认取消该设计的分享吗？", "取消分享", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          //删除
          cancelWorkShare(_this.wid).then(res => {
            _this.$router.back();
            console.log("cancelWorkshare", res.data);
          });
        })
        .catch(() => {});
    },

    deleteProject: function() {
      let _this = this;
      if (!this.checkLogin()) {
        return;
      }
      this.$confirm("确认删除该设计吗？", "删除设计", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          //删除
          deleteOneWork(_this.wid).then(res => {
            _this.$router.back();
            console.log("cancelWorkshare", res.data);
          });
        })
        .catch(() => {});
    },

    //协同设计，将当前设计稿添加为自己的项目
    saveProject: function() {
      if (!this.checkLogin()) {
        return;
      }
      this.dialogVisible = true;

      console.log(this.version);

      //更新collaborate的uid
      var phone = this.$store.state.phone;
      var userName = this.$store.state.userName;
      console.log("collogin before", phone, userName);
      let _this = this;
      ColLogin({
        phone: phone,
        userName: userName
      }).then(res => {
        console.log("col login", res.data);
        _this.uid = res.data;
        this.$store.commit("changeCollaborateInfo", {
          uid: _this.uid,
          pid: -1,
          vid: -1
        });
        // console.log("main mounted")
      });
    },
    saveVersion: function() {
      console.log(this.version);

      var pid = this.$store.state.collaborateInfo.pid;
      var version = {
        pid: pid,
        canvas: this.version.canvas,
        backCanvas: this.version.backCanvas,
        frontImage: this.version.image,
        backImage: this.version.backImage,
        parent: -1
      };

      let _this = this;
      insertVersionDouble(version).then(res => {
        console.log("insertVersion", res);

        _this.dialogVisible = false;
      });
    },
    /** 分页 */
    // 换页管理
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
    }
  }
};
</script>

<style scoped>
.iconfont {
  font-size: 40px;
}

.iconfont:hover {
  color: #409eff;
}

.iconfont-click {
  color: #409eff;
  font-size: 30px;
}

>>> .el-form-item__label {
  font-weight: bold;
  /*color: #409EFF;*/
  font-size: 16px;
  color: black;
  text-align: left;
}

.variable {
  color: #8c939d;
  font-size: 16px;
  text-align: left;
}

.text {
  font-size: 16px;
  text-align: center;
}

.text-button {
  color: black;
  font-size: 16px;
}
.text-button:hover {
  color: #409eff;
}
.suit-item-img {
  width: 80px;
  height: 80px;
  background: white;
  padding-left: 2px;
  padding-right: 2px;
}
.author-link {
  transition: all .2s;
  font-size: 1.1rem;
  color: var(--base-primary);
  cursor: pointer;
  text-decoration: none;
  border: 2px solid var(--base-primary);
  padding: 0.3rem;
  background-color: var(--base-primary-opac);
  border-radius: 0.5rem;
}
.author-link:hover {
  background-color: var(--base-primary);
  color: #fff;
  border: 2px solid var(--base-primary);
}
.cursor-pointer-items > div{
  cursor: pointer;
}
</style>
