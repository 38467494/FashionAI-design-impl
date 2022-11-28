<template>
  <div>
    <template v-for="(item, index) in projects">
      <el-row :key="index" v-if="index % 4 == 0" type="flex">
        <el-col :span="6" v-if="index < projects.length">
          <AtsCard class="m-2" @onClick="jumpToProcess(item)">
            <template v-slot:image>
              <div class="icon iconfont el-icon-my-huahua"></div>
            </template>
            <template v-slot:title>
              {{ projects[index].name }}
            </template>
            <template v-slot:subtitle>
              <p class="text-slate-400">作者 @author</p>
            </template>
          </AtsCard>
          <!-- <div class="project-button" @click="jumpToProcess(item)">
                      <div class="icon iconfont el-icon-my-huahua"></div>
                        <p>
                        </p>
                    </div> -->
        </el-col>
        <el-col :span="6" v-if="index + 1 < projects.length">
          <AtsCard class="m-2" @onClick="jumpToProcess(projects[index + 1])">
            <template v-slot:image>
              <div class="icon iconfont el-icon-my-huahua"></div>
            </template>
            <template v-slot:title>
              {{ projects[index + 1].name }}
            </template>
            <template v-slot:subtitle>
              <p class="text-slate-400">作者 @author</p>
            </template>
          </AtsCard>
          <!-- <div
            class="project-button"
            @click="jumpToProcess(projects[index + 1])"
          >
            <div class="icon iconfont el-icon-my-huahua"></div>
            <p>
              {{ projects[index + 1].name }}
            </p>
          </div> -->
        </el-col>
        <el-col :span="6" v-if="index + 2 < projects.length">
          <AtsCard class="m-2" @onClick="jumpToProcess(projects[index + 2])">
            <template v-slot:image>
              <div class="icon iconfont el-icon-my-huahua"></div>
            </template>
            <template v-slot:title>
              {{ projects[index + 2].name }}
            </template>
            <template v-slot:subtitle>
              <p class="text-slate-400">作者 @author</p>
            </template>
          </AtsCard>
          <!-- <div
            class="project-button"
            @click="jumpToProcess(projects[index + 2])"
          >
            <div class="icon iconfont el-icon-my-huahua"></div>
            <p>
              {{ projects[index + 2].name }}
            </p>
          </div> -->
        </el-col>
        <el-col :span="6" v-if="index + 3 < projects.length">
          <AtsCard class="m-2" @onClick="jumpToProcess(projects[index + 3])">
            <template v-slot:image>
              <div class="icon iconfont el-icon-my-huahua"></div>
            </template>
            <template v-slot:title>
              {{ projects[index + 3].name }}
            </template>
            <template v-slot:subtitle>
              <p class="text-slate-400">作者 @author</p>
            </template>
          </AtsCard>
          <!-- <div
            class="project-button"
            @click="jumpToProcess(projects[index + 3])"
          >
            <div class="icon iconfont el-icon-my-huahua"></div>
            <p>
              {{ projects[index + 3].name }}
            </p>
          </div> -->
        </el-col>
      </el-row>
      <p :key="index + 1" v-if="index % 4 == 0"></p>
    </template>
    <el-pagination
      layout="prev, pager, next"
      :total="projectLength"
      :page-size="pageSize"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getProjects } from "../../../api/collaborateAPI";
import AtsCard from "../../common/AtsCard.vue";
export default {
  name: "collaborate-project",
  data: function() {
    return {
      svg:
        '<svg t="1641456160488" class="project-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5034" width="200" height="200"><path d="M224 800c0 9.6 3.2 44.8 6.4 54.4 6.4 48-48 76.8-48 76.8s80 41.6 147.2 0S464 796.8 368 736c-22.4-12.8-41.6-19.2-57.6-19.2-51.2 0-83.2 44.8-86.4 83.2z m336-124.8l-32 51.2c-51.2 51.2-83.2 32-83.2 32 25.6 67.2 0 112-12.8 128 25.6 6.4 51.2 9.6 80 9.6 54.4 0 102.4-9.6 150.4-32 3.2 0 3.2-3.2 3.2-3.2 22.4-16 12.8-35.2 6.4-44.8-9.6-12.8-12.8-25.6-12.8-41.6 0-54.4 60.8-99.2 137.6-99.2h22.4c12.8 0 38.4 9.6 48-25.6 0-3.2 0-3.2 3.2-6.4 0-3.2 3.2-6.4 3.2-6.4 6.4-16 6.4-16 6.4-19.2 9.6-35.2 16-73.6 16-115.2 0-105.6-41.6-198.4-108.8-268.8C704 396.8 560 675.2 560 675.2z m-336-256c0-28.8 22.4-51.2 51.2-51.2 28.8 0 51.2 22.4 51.2 51.2 0 28.8-22.4 51.2-51.2 51.2-28.8 0-51.2-22.4-51.2-51.2z m96-134.4c0-22.4 19.2-41.6 41.6-41.6 22.4 0 41.6 19.2 41.6 41.6 0 22.4-19.2 41.6-41.6 41.6-22.4 0-41.6-19.2-41.6-41.6zM457.6 208c0-12.8 12.8-25.6 25.6-25.6s25.6 12.8 25.6 25.6-12.8 25.6-25.6 25.6-25.6-12.8-25.6-25.6zM128 505.6C128 592 153.6 672 201.6 736c28.8-60.8 112-60.8 124.8-60.8-16-51.2 16-99.2 16-99.2l316.8-422.4c-48-19.2-99.2-32-150.4-32-211.2-3.2-380.8 169.6-380.8 384zM764.8 86.4c-22.4 19.2-390.4 518.4-390.4 518.4-22.4 28.8-12.8 76.8 22.4 99.2l9.6 6.4c35.2 22.4 80 12.8 99.2-25.6l9.6-19.2C569.6 560 790.4 140.8 803.2 112c6.4-19.2-3.2-32-19.2-32-6.4-3.2-12.8 0-19.2 6.4z" p-id="5035"></path></svg>',
      projects: [],
      allProjects: [],
      projectLength: 0,
      pageSize: 8,
      uid: -1,
      currentPage: 0
    };
  },
  mounted: function() {
    this.uid = this.$store.state.collaborateInfo.uid;
    var uid = this.uid;
    var _this = this;
    console.log("project", uid);
    getProjects({
      id: uid
    }).then(res => {
      console.log("search project", res.data);
      _this.allProjects = res.data;
      _this.projectLength = _this.allProjects.length;
      _this.divideProject();
    });
  },
  methods: {
    divideProject: function() {
      var projects = this.allProjects;
      this.allProjects = [];
      for (var i = 0; i < projects.length; i += this.pageSize) {
        var page = [];
        for (var j = 0; j < this.pageSize && i + j < projects.length; j++) {
          page.push(projects[i + j]);
        }
        this.allProjects.push(page);
      }
      this.projects = this.allProjects[0];
      console.log(this.allProjects);
    },
    changePage: function(page) {
      console.log(page);
      this.projects = this.allProjects[page - 1];
    },
    jumpToProcess: function(item) {
      //更新选择的项目id
      console.log("jump to process", item);
      this.$store.commit("changeCollaborateInfo", {
        pid: item.id
      });
      this.$router.push({
        name: "collaborate-process"
      });
    }
  },
  components: { AtsCard }
};
</script>

<style scoped>
@import "../../../assets/css/collaborate/project.css";
</style>
