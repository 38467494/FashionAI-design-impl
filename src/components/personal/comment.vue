<template>
  <div class="flex flex-col gap-y-6">
    <div class="font-bold text-xl text-left">评论区</div>
    <div class="flex flex-col gap-y-4">
      <div>
        <el-input
          class="bolded-input"
          type="textarea"
          :autosize="{minRows: 6, maxRows: 8}"
          v-model="comment"
          placeholder="说点什么吧~"
        ></el-input>
      </div>
      <AtsMultiOptionGroup :options="commentOptions"/>
      <div class="flex justify-end">
        <AtsButton style="width: 180px;" type="primary" @click="saveComment"
          >发表评论</AtsButton
        >
      </div>
    </div>
    <div class="divide-y">
      <template v-for="(item, index) in infoArr">
        <div class="flex gap-x-8 py-4">
          <!-- avatar -->
          <div
            class="flex-none flex flex-col gap-y-3 items-center justify-center"
          >
            <!-- <i class="text-2xl iconfont el-icon-my-geren"></i> -->
            <el-avatar :src="avatarPlaceholder" :size="40" />
            <span class="text-base text-slate-900">{{ item.userName }}</span>
          </div>
          <!-- comment content -->
          <div class="grow text-left">
            <span>{{ item.content }}</span>
          </div>
          <!-- date -->
          <div class="flex-none text-slate-400 text-right">
            <span>{{ item.createTime }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { saveOneComment } from "../../api/comment";
import AtsButton from "../common/AtsButton.vue";
import AtsMultiOptionGroup from "../common/AtsMultiOptionGroup.vue";

export default {
  name: "Comment",
  props: {
    wid: {
      type: Number,
      default: -1
    },
    commentList: {
      type: Array,
      default: null
    }
  },
  watch: {
    commentList: function() {
      this.infoArr = this.commentList;
      this.changeFormat();
      console.log(this.infoArr);
    }
  },
  mounted: function() {
    console.log(this.commentList);
    this.infoArr = this.commentList;
    this.changeFormat();
  },
  data: function() {
    return {
      avatarPlaceholder:
        "https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png",
      comment: null,
      infoArr: [
        {
          username: "张三",
          createTime: "2022-06-03",
          content: "好看！"
        },
        {
          username: "李四",
          createTime: "2022-06-03",
          content: "好看！"
        }
      ],
      commentOptions: [
        {
          emoji: '&#128525;',
          text: '超棒',
        },
        {
          emoji: '&#128518;',
          text: '优秀',
        },
        {
          emoji: '&#128523;',
          text: '不错',
        },
        {
          emoji: '&#128531;',
          text: '一般',
        }
      ],
    };
  },
  methods: {
    //修改传入的comment格式用于显示
    changeFormat: function() {
      for (var i = 0; i < this.infoArr.length; i++) {
        this.infoArr[i].createTime = this.infoArr[i].createTime.substr(0, 10);
      }
    },
    getTime: function() {
      var myDate = new Date();
      var year = myDate.getFullYear();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "-" + month + "-" + day;
    },
    checkLogin: function() {
      if (this.$store.state.phone == null) {
        this.$router.push({
          path: "/login",
          query: {
            redirect: "/innerPage"
          }
        });
        this.$message({
          type: "warning",
          message: "请先登录..."
        });
        return false;
      }
      return true;
    },
    saveComment: function() {
      if (!this.checkLogin()) {
        return;
      }
      if (this.comment == null || this.comment == "") {
        this.$message({
          type: "warning",
          message: "评论内容不能为空"
        });
      } else {
        let _this = this;
        var data = {
          uid: this.$store.state.phone,
          userName: this.$store.state.userName,
          content: this.comment,
          wid: this.wid
        };
        saveOneComment(data).then(res => {
          console.log(res.data);
          _this.$message({
            type: "success",
            message: "评论发表成功"
          });
          _this.comment = "";
          var time = _this.getTime();
          data["createTime"] = time;
          _this.infoArr.push(data);
          console.log(_this.infoArr);
        });
      }
    }
  },
  components: { AtsButton, AtsMultiOptionGroup }
};
</script>

<style>
/* .variable {
  color: #8c939d;
  font-size: 16px;
  text-align: left;
  /*font-family: "Adobe 楷体 Std R";*/
</style>
