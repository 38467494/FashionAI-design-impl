<template>
    <div style="min-height: 80vh">
        <GradientBackground/>
        <process-graph @getComment="getComment" ref="processGraph"></process-graph>
        <el-card class="box-card" style="width:80%;margin:0 auto;" v-if="vid !=-1">
            <div>
              <div class="finish-div" v-if="status == 0">
                <span class="finish-text">已结束</span>
              </div>
                <el-row type="flex">
                    <el-col :span="12">
                        <el-image :src="url" v-if="(frontback == 1)&&url" fit="fill" style="padding: 10px"></el-image>
                        <el-image :src="backURL" v-else-if="(frontback == 2)&&backURL" fit="fill" style="padding: 10px"></el-image>
                        <el-image v-else src="/static/transparent-cloth.png"></el-image>
                      <el-row style="text-align: center">
                        <el-radio-group v-model="frontback">
                          <el-radio :label="1">正面</el-radio>
                          <el-radio :label="2">背面</el-radio>
                        </el-radio-group>
                      </el-row>


                    </el-col>
                    <el-col :span="12">
                        <div >
                          <br/><br/>
                            <template v-for="(item,index) in intro">
                                <el-row type="flex" :key="index" justify="space-between">
                                    <el-col :span="6">
                                        <p class="label-text font-bold text-1xl  pb-2">
                                            {{item.label}} : &nbsp;
                                        </p>
                                    </el-col>
                                    <el-col :span="18">
                                        <p class="content-text ">
                                            {{item.content}}
                                        </p>
                                    </el-col>
                                </el-row>

                            </template>

                        </div>
                      <br/><br/><br/><br/>

                      <el-row type="flex" v-if="status==1">
                        <el-col :span="2">

                        </el-col>
                        <el-col :span="22">
                          <div style="text-align: left; ">
                            <AtsButton class="abutton" round @click="toDesign"  v-if="status==1" type="primary">我来设计</AtsButton>
                            <AtsButton class="abutton" round type="pink"  plain @click="deleteProject">删除项目</AtsButton>
<!--                            <el-button type="success" @click="finishProject">结束项目</el-button>-->
                            <AtsButton class="abutton" type="primary" round  @click="collectItem" v-if="!collectFlag">收藏</AtsButton>
                            <AtsButton class="abutton" type="info" round  v-else>已收藏</AtsButton>

                          </div>

                        </el-col>
                      </el-row>
                      <br/>

                      <el-row type="flex">
                        <el-col :span="2">

                        </el-col>
                        <el-col :span="22">
                          <div style="text-align: left; ">
                            <!--                            <el-button> 赞</el-button>-->
                            <!--                            <el-button> 踩</el-button>-->
                            <!--                            <el-button>我要评论</el-button>-->
                            <AtsButton class="abutton" type="primary" round @click="editIntro">编辑项目</AtsButton>
                            <AtsButton class="abutton" type="primary" round plain @click="downloadPNG">下载PNG</AtsButton>
                            <AtsButton class="abutton" type="primary" round @click="downloadbackSVG">下载SVG</AtsButton>
                          </div>
                        </el-col>
                      </el-row>

                      <br/>
                      <el-row type="flex">
                        <el-col :span="6">

                        </el-col>
                        <el-col :span="18">
<!--                          <div style="text-align: left; ">-->
<!--                            &lt;!&ndash;                            <el-button> 赞</el-button>&ndash;&gt;-->
<!--                            &lt;!&ndash;                            <el-button> 踩</el-button>&ndash;&gt;-->
<!--                            &lt;!&ndash;                            <el-button>我要评论</el-button>&ndash;&gt;-->
<!--                            <el-button type="primary" @click="collectItem" v-if="!collectFlag">收藏</el-button>-->
<!--                            <el-button type="info"  v-else>已收藏</el-button>-->
<!--                          </div>-->
                        </el-col>
                      </el-row>



                    </el-col>
                </el-row>
            </div>

<!--          修改项目信息的对话框-->
          <el-dialog title="编辑项目" :visible.sync="editVisible">
            <el-form :model="projectForm" label-width="80px">
              <el-form-item label="项目名称">
                <el-input v-model="projectForm.name"></el-input>
              </el-form-item>
              <el-form-item label="项目简介">
                <el-input type="textarea" :row="4" placeholder="项目简介" v-model="projectForm.description"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitEdit">提交修改</el-button>
            </span>
          </el-dialog>

            <el-divider></el-divider>

<!--            <div style="display: none">-->
<!--                <h2 style="text-align: left;margin:0 10px;">评论区</h2>-->
<!--                <br>-->
<!--                <div style="height: 400px;">-->
<!--                    <el-scrollbar style="height:100%">-->
<!--                        <div>-->
<!--                            <more-comment v-bind:vid="vid"></more-comment>-->
<!--                        </div>-->
<!--                    </el-scrollbar>-->

<!--                </div>-->
<!--            </div>-->
        </el-card>
    </div>
</template>

<script>
import processGraph from './process/graph.vue'
import {getProjectbyId} from "../../api/collaborateAPI";
import {editProject} from "../../api/collaborateAPI";
import {deleteProject} from "../../api/collaborateAPI";
import {finishProject} from "../../api/collaborateAPI";
import {saveOneWork} from "../../api/workAPI";
import {getCoverImg} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton.vue";
import GradientBackground from "../common/GradientBackground";
// import {resolve} from "../../../build/webpack.base.conf";
export default {
  components: { processGraph,AtsButton,GradientBackground},
    name: "process",
    data: function(){
        return {
            project: null,
            pid: -1,    //project id
            vid: -1,    //version id
            version: null,
            uid: -1,    //user id
          status: 0,

            url: '',
            intro: [
              {
                label:"项目名称",
                content:""
              },
                {
                    label: "设计者",
                    content: " Jack"
                },
                {
                    label: "发布时间",
                    content: " 2021/12/31",
                },
                {
                    label: "简介",
                    content: " 本组/款设计以突出女性柔和的粉色系为基调，融合了洛可可样式的细节变化，和现在的流行裁剪方法，于表现一种新时代的反复、融合的女性美；随着本季复古和甜美风的强势回归，及全球经济的回暖，人们开始关注如粉色系的柔美感觉以冲淡生活中激烈的竞争色彩，本组/款设计具有时代性的商业价值。",
                },
                // {
                //     label: "评论的统计信息",
                //     content: "有5个人觉得很赞，3个人觉得不喜欢"
                // }
            ],

          projectForm:{
              id:-1,
              name:"",
            description: ""
          },
          editVisible: false,

          frontback: 1, //记录当前显示的服装是正面还是背面
          backURL: null,
          collectFlag: false,
        }
    },
    mounted: function(){
      var pid = this.$store.state.collaborateInfo.pid;
      var uid = this.$store.state.collaborateInfo.uid;
        let _this=this;
      //根据项目pid查询信息
      getProjectbyId({
        id:pid
      }).then(res =>{
        console.log("process project", res.data);
        var project = res.data;
        _this.project = project;

        var pid = project.id;
        _this.pid=pid;
        _this.status = project.status;

        _this.$refs["processGraph"].showGraph(pid);

        console.log("process",pid)
      })


    },
    methods: {
        getComment: function(version){
            console.log('father',version);
            this.vid=Number(version.id);
            this.version = version;

            if(this.version.saved == 0){
              this.collectFlag = false;
            }
            else
              this.collectFlag = true;
            this.showComment(version);
        },
        showComment: function(version){
          this.intro[0].content = this.project.name;
            this.intro[1].content = this.project.principle_name;
            this.intro[2].content = version.create_time;
            this.intro[3].content = this.project.description;

            this.url = version.image;
            this.backURL = version.backImage;

        },

      editIntro: function (){
        this.projectForm.id = this.pid;
        this.projectForm.name = this.project.name;
        this.projectForm.description = this.project.description;
        this.editVisible = true;
      },
      submitEdit: function (){
          let _this=this;
          console.log(this.projectForm);
          editProject(this.projectForm).then(res=>{
            console.log(res.data);

            _this.$message({
              message: "项目发布成功",
              type: "success"
            });
            _this.editVisible = false;
            _this.project.name = _this.projectForm.name
            _this.project.description = _this.projectForm.description;
            _this.intro[0].content = _this.project.name;
            _this.intro[3].content = _this.project.description;
          })
      },
      deleteProject: function (){
          let _this=this;
          this.$confirm("确认删除该项目吗（删除后所有版本将不可恢复）？","提示",{
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() =>{
            deleteProject({
              id:_this.pid
            }).then(res => {
              console.log("delete",res.data);
              _this.$message({
                type:"success",
                message: "成功删除"
              });
              _this.$router.push({
                name: "collaborate-main",
              });
            })
          }).catch(()=>{
            this.$message({
              type:"info",
              message: '已取消删除'
            })
          })




      },
      finishProject: function (){
        let _this = this;
        this.$confirm("确认结束该项目吗（结束后所有版本将不可修改）？","提示",{
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() =>{
          console.log("finish check",_this.pid);
         finishProject({
            id:_this.pid
          }).then(res => {
            console.log("delete",res.data);
            _this.$message({
              type:"success",
              message: "成功结束"
            });
            _this.status = 0;
          })
        }).catch(()=>{
          this.$message({
            type:"info",
            message: '已取消删除'
          })
        })
      },

      downloadPNG: function (){
        var image = this.version.image;
        console.log("process image",image);
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.download = "version" + this.version.id || "photo"
        a.href = image;
        a.dispatchEvent(event);

      },
      downloadSVG: function (){
        var canvas = new fabric.Canvas('main');
        canvas.loadFromJSON(this.version.canvas);
        canvas.setWidth(1000);
        canvas.setHeight(1000);
        var svg = canvas.toSVG();
        console.log("process svg",svg);
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.download = "version" + this.version.id +".svg"
        a.href = 'data:text/plain;charset=utf-8,' + svg;
        a.dispatchEvent(event);
      },
      downloadbackSVG:async function (){
        var canvas = new fabric.Canvas('main');
        console.log(this.version.backCanvas)
        await new Promise((resolve,reject)=>{
          canvas.loadFromJSON(this.version.backCanvas, async function(json){
            resolve()
          })
        })
        canvas.loadFromJSON(this.version.backCanvas);

        canvas.setWidth(1000);
        canvas.setHeight(1000);

        var svg = canvas.toSVG();
        console.log("process svg",svg);
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.download = "version" + this.version.id +".svg"
        a.href = 'data:text/plain;charset=utf-8,' + svg;
        a.dispatchEvent(event);
      },

        //跳转到协同设计页面
        toDesign: function(){
            let _this=this;
            console.log(this.version)
            this.$store.commit("changeCollaborateInfo",{
              vid: _this.version.id,
              version: _this.version,
            })
            this.$router.push({
                name: 'collaborate-design',

            })
        },

      collectItem:async function (){
        let _this = this
        var res = await this.collectInfo()
        res["userName"] = this.$store.state.userName
        res["phone"] = this.$store.state.phone
        // console.log(res)
        saveOneWork(res).then( res => {
          console.log("save one work",res)
          _this.$message({
            message: "收藏成功",
            type: "success"
          });
          _this.collectFlag = true;
          _this.$refs.processGraph.updateSaved(_this.version.id,1)
        })
      },

      collectInfo:async function (){
          var workDescription = {
            frontImg: this.url,
            backImg: this.backURL,
            introduce: this.intro,
            version: this.version
          }
          console.log("version", workDescription.version)
          var cover = await getCoverImg("collaborate",workDescription)
          var info = {
            category: "collaborate",
            workDescription: workDescription,
            coverUrl: cover
          }
          return info
      }


    }
}
</script>

<style scoped>
@import "../../assets/css/collaborate/process.css";
.abutton{
  width: 105px;
  height: 40px;
}

</style>
