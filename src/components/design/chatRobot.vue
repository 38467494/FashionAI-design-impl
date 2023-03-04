<template>
  <div>
    <div v-drag class="drag">
      <el-button
        circle
        class="circleBtn"
        @click="showCheckBox"
      >
      </el-button>
    </div>
    <div class="chatAppBody" v-if="chatBoxVisible">
      <section class="flex">
        <section class="grow chatTitle">
          时尚小谙
        </section>
        <section class="flex-none">
          <el-button class="chatCloseBtn" @click="chatBoxVisible=false">
            <i class="bi bi-x-lg" style="right:5px"></i>
          </el-button>
        </section>

      </section>
      <div class="chatBox">
        <div v-for="item in historyList">
          <div class="chatServer" v-if="item.user==='server'">
            <div class="chatTimestamp">{{item.showtime}}</div>
            <div class="chatRow">
              <el-avatar class="chatAvatar" :size="30" src="http://euphonium.cn/develop_team/zcx.png"></el-avatar>
              <div class="chatMsgContent">
                <div class="chatUsername">小谙</div>
                <div class="chatContent" v-if="item.type==='text'">
                  {{item.data.message}}
                  <el-link v-if="item.data.appendix!=='' && item.data.appendix" style="color:blue" @click="ignoreQuestion(item)">{{item.data.appendix}}</el-link>
                </div>
                <div class="chatSendProduct" v-else>
                  <img :src="item.data.previewImgUrl" class="productImg"/>
                  <div class="productInfo">
                    <div>{{item.data.message}}</div>
                  </div>
                  <div class="productBtns">
                    <el-button size="mini" type="primary" @click="checkProposalDetails(item)">查看详情</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="chatClient" v-else>
            <div class="chatTimestamp">{{item.showtime}}</div>
            <div class="chatRow chatRowMe">
              <div class="chatTimestamp"></div>
              <div class="chatContent">{{item.data.message}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chatBottom">
        <div class="chatArea">
          <textarea
            class="chatAreaInput"
            v-model="textarea"
            @keyup.ctrl.enter.exact="chatToUser($event)"
            @keyup.enter.exact="chatToUser($event,'enter')"
          >
          </textarea>
          <i class="bi bi-send"></i>
        </div>
        <div class="chatCopyright">
          <i class="el-icon-chat-dot-round"></i> Powered by ICES
        </div>

      </div>
    </div>
    <el-dialog
      :visible.sync="proposalVisible"
      width="55%"
      style="min-width: 840px;"
    >
      <template>
        <div class="text-left font-bold text-2xl px-5 py-2">推荐方案详情</div>
      </template>
      <template v-loading="loading">
        <div class="flex flex-col divide-x px-6">
          <section>
            <div class="text-left text-large px-5 py-2">推荐方案：{{currentProposal.message}}</div>
            <div class="text-left text-large px-5 py-2">推荐理由：{{currentProposal.details}}</div>
          </section>
          <section>
            <image-show
              v-bind:urls="currentProposal.imgUrls">
            </image-show>
          </section>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import AtsButton from "../common/AtsButton";
import GradientBackground from "../common/GradientBackground";
import {judgeRobot, recommendRobot, detailRobot} from "../../api/design";
import { v4 as uuidv4 } from 'uuid';
import xss from "xss";
import ImageShow from "./ImageShow";
export default {
  name: 'chatRobot',
  components: {ImageShow, AtsButton, GradientBackground},
  data() {
    return {
      circleBtn: true,
      chatBoxVisible: false,
      textarea: '',
      // 按照时间顺序存放客服和用户的对话
      historyList:[
        {
          user:'server',
          datetime:{},
          showtime:'',
          type:'text',
          data:{
            message:'您好，我是小谙，很高兴为您服务。',
            appendix: '',
          }
        },
        {
          user:'server',
          datetime:{},
          showtime:'',
          type:'text',
          data:{
            message:'我将向您提出几个问题，根据您的描述，我会提供专业的穿搭推荐，好吗？',
            appendix: '',
          }
        },
        // 例子：发送推荐结果
        {
          user:'server',
          datetime:{},
          showtime:'',
          type:'link',
          data:{
            message:'推荐理由balabalabala',
            appendix:'',
            previewImgUrl:'http://euphonium.cn/develop_team/zcx.png',
            imgUrls:[
              'http://euphonium.cn/develop_team/zcx.png',
              'http://euphonium.cn/develop_team/zcx.png',
              'http://euphonium.cn/develop_team/zcx.png',
            ], // 只有当type为link时才有图片字段，而且小卡片上只会体现第一张图片
            details:'推荐理由详情balabalabala', // 只会显示在详情页
            imgKeywords: [], // 用户查看推荐详情时，用于爬取图片的关键词；应后端要求，为list类型
            pid: uuidv4(), // 对于推荐方案，在一次页面刷新周期内，应该具有全局的标识，而对话问答每轮都会刷新，因此不需要uuid
            loadReady: true,
          },
        }
      ],
      // 储存客服的提问与回复，基于规则
      questionList:[

        {
          message: '您想要的搭配哪些服装套件呢（衣服、裤子、鞋、包等）？',
          appendix: '【忽略此问题】',
          field: 1, // 这个参数面向模型接口，表示该问题面向的字段，目前1代表可检测的衣着字段，2代表其他所有不可检测的字段
        },
        {
          message: '请问你预期的穿搭场合是什么？',
          appendix: '【忽略此问题】',
          field: 2,
        },
        {
          message: '可以告诉小安您的外形描述吗？比如身材肤色发型等。',
          appendix: '【忽略此问题】',
          field: 2,
        },
        {
          message: '您想穿上去看起来达到什么效果呢？',
          appendix: '【忽略此问题】',
          field: 2,
        },
        {
          message: '最后您还有什么其他需求要告诉小安的吗？',
          appendix: '【忽略此问题】',
          field: 2,
        },
      ],
      questionRemainList:[],
      currentQuestion:null,
      serverList:[
        // 预设对话，待填充
        {
          message: '好的。',
          appendix: '',
        },
        {
          message: '不好意思，小谙没有理解您的回答，您可以重新回答，或者',
          appendix: '【忽略此问题】',
        },
        {
          message: '提问结束，小谙马上为您提供穿搭推荐方案。。。',
          appendix: '',
        },

      ],
      answerSet:'', // 将有效的回答拼接在一起
      clientList:[],
      proposals:[],
      proposalVisible: false,
      loading: false,
      currentProposal: {},
    }
  },
  directives:{
    drag(el,bindings){ // 使组件可拖动
      el.onmousedown = function(e){
        // console.log('pagex: '+e.pageX);
        // console.log('pagey: '+e.pageY);
        // console.log('offsetleft: '+el.offsetLeft);
        // console.log('offsettop: '+el.offsetTop);
        var disx = e.pageX - el.offsetLeft;
        var disy = e.pageY - el.offsetTop;
        document.onmousemove = function (e){
          el.style.left = e.pageX - disx+'px';
          el.style.top = e.pageY - disx+'px';
        }
        document.onmouseup = function(){
          document.onmousemove = document.onmouseup = null;
        }
      }
    }
  },
  mounted: function () {
    this.questionRemainList = this.questionList;
    this.proposals.push(this.historyList[2].data);
    this.historyList.forEach((i)=>{
      i.datetime = new Date();
      i.showtime = this.shortTime(i.datetime);
    })
  },
  methods: {
    // todo 对话延迟一定秒数

    showCheckBox(){
      if(!this.chatBoxVisible){
        this.chatBoxVisible = true;
        this.scrollBottom();
      }
    },
    chatToUser:function(e) {
      let _this=this;
      //用户点击了ctrl+enter触发
      if(e.keyCode === 13){
        if(e.ctrlKey){
          this.textarea += '\n';
        }
        else{
          this.sendMessageByClient();
          this.textarea = '';
        }
      }
    },
    shortTime: function (t){
      let time=new Date(t);
      let today = new Date();
      let todayYear = today.getFullYear();
      let todayMonth = today.getMonth()+1;
      let todayDate = today.getDate();

      let targetYear = time.getFullYear();
      let targetMonth = time.getMonth()+1;
      let targetDate = time.getDate();
      let targetHour = time.getHours();
      let targetMinutes = time.getMinutes();
      let targetSeconds = time.getSeconds();
      // 同一天，只显示小时、分钟、秒
      if (todayYear === targetYear && todayMonth === targetMonth && todayDate === targetDate) {
        if (targetHour < 10) {
          targetHour = "0" + targetHour;
        }
        if (targetMinutes < 10) {
          targetMinutes = "0" + targetMinutes;
        }
        if (targetSeconds < 10) {
          targetSeconds = "0" + targetSeconds;
        }
        return targetHour + ":" + targetMinutes + ":" + targetSeconds;
      }
      // 同一年，只显示月日等
      if (todayYear === targetYear) {

        if (targetMonth < 10) {
          targetMonth = "0" + targetMonth;
        }
        if (targetDate < 10) {
          targetDate = "0" + targetDate;
        }
        if (targetHour < 10) {
          targetHour = "0" + targetHour;
        }
        if (targetMinutes < 10) {
          targetMinutes = "0" + targetMinutes;
        }
        if (targetSeconds < 10) {
          targetSeconds = "0" + targetSeconds;
        }
        return `${targetMonth}-${targetDate} `+targetHour + ":" + targetMinutes + ":" + targetSeconds;
      }
      return t;
    },
    addToHistory: function (user, type, data){
      var dt = new Date();
      var st = this.shortTime(dt);
      this.historyList.push({
        user: user,
        datetime: dt,
        showtime: st,
        type: type,
        data: data,
      })
      this.scrollBottom();
    },
    receiveMessageFromClient: function (){
      // 如果还没开始提问，那么不必调模型
      console.log(this.currentQuestion);
      if(!this.currentQuestion){
        this.currentQuestion = this.questionRemainList[0];
        this.addToHistory('server','text',this.currentQuestion);
      }
      else{
        // 将用户回复传给模型1，判断是否有效
        this.addToHistory('server', 'text', this.serverList[0]);
        var val = {
          source: this.clientList[this.clientList.length-1].message,
          type: this.currentQuestion.field,
        }
        judgeRobot(val).then(res=>{
          console.log('success',res.data.result);
          console.log(typeof (res.data.result));
          if(res.data.result === 1){
            this.answerSet += this.clientList[this.clientList.length-1].message + ' '
            this.nextQuestionByServer();
          }
          // 不满足要求，那么会向用户再次确认
          else{
            this.addToHistory('server', 'text', this.serverList[1]);
          }
        }).catch(res=>{
          console.log('error', res);
          this.addToHistory('server', 'text', this.serverList[1]);
        })
      }
    },
    // 从统一性上来说，这个函数应该命名为nextMessageByServer，但是实际上这个函数只负责切换问题
    nextQuestionByServer: function () {
      this.questionRemainList.shift();
      console.log(this.questionRemainList);
      console.log(this.currentQuestion);
      if(this.questionRemainList.length===0){
        // 如果当前问题是最后一个问题，且模型调用成功的情况下，就终止提问，并且等待模型2的结果
        this.addToHistory('server', 'text', this.serverList[2]);
        // 调用模型2
        // console.log(this.answerSet);
        recommendRobot({source: this.answerSet}).then(res=>{
          console.log(res.data);
          this.provideProposals(res.data);
          this.newRound();
        }).catch(res=>{
          console.log(res);
          this.newRound();
        })
      }
      // 接着提问下一个问题
      else{
        this.currentQuestion = this.questionRemainList[0];
        this.addToHistory('server','text', this.currentQuestion);
      }
    },
    sendMessageByClient: function () {
      console.log('sending message');
      if(this.textarea === '' || !this.textarea) return;
      var answer = {
        message: this.textarea,
        appendix: '',
      }
      this.clientList.push(answer);
      this.addToHistory('client','text',answer);
      this.textarea = '';
      this.receiveMessageFromClient();
    },
    ignoreQuestion: function (item){
      // 忽略问题的处理逻辑
      // 如果忽略的是当前正在问的问题，那么一定是questionRemainList的第一个元素，删除之
      // 如果忽略的是已经回答或者已经忽略的问题，那么一定在questionRemainList找不到
      if('field' in item.data){
        if(this.questionRemainList.includes(item.data)){
          this.nextQuestionByServer();
        }
      }
      else{
        this.nextQuestionByServer();
      }
    },
    // 开启新一轮的对话
    newRound:function (){
      this.questionRemainList = this.questionList;
      this.currentQuestion = null;
      this.clientList.length = 0;
      this.answerSet = '';
    },
    provideProposals: function (proposalsData){
      var limitLength = (proposalsData.length<=3)?proposalsData.length:3;
      for(var i = 0 ; i < limitLength; i++){
        let kws = [];
        proposalsData[i].keyword.forEach((j)=>{
          let kw = '';
          j.forEach((k)=>{
            kw += k + ' ';
          })
          kws.push(kw);
        })
        let sentence = proposalsData[i].sentence;
        let text = proposalsData[i].text;
        // 先选一张预览图
        detailRobot({keywords: kws.slice(0,1)}).then(res=>{
          let previewImgUrl = res.data.data.images[0];
          let p = {
            message: sentence,
            appendix: '',
            previewImgUrl: previewImgUrl,
            imgUrls: [],
            // 在详情页显示的信息
            details: text,
            imgKeywords: kws,
            // 不可见信息
            pid: uuidv4(),
            loadReady: false, // 用来标记该推荐方案下的图片是否全部加载，默认false
          }
          p.imgUrls.push(previewImgUrl);
          this.proposals.push(p);
          this.addToHistory('server','link',p);
        }).catch(res=>{
          console.log(res)
        })

      }
    },
    checkProposalDetails: function (item){
      console.log(item.data);
      this.loading = true;
      var pos = 0;
      for(;pos<this.proposals.length;pos++){
        if(this.proposals.pid === item.pid){
          break;
        }
      }
      let _this=this;
      if(item.data.loadReady === false){
        var kws = item.data.imgKeywords;
        detailRobot({keywords:kws.slice(1,kws.length)}).then(res=>{
          console.log(res.data.data.images);
          res.data.data.images.forEach((i)=>{
            this.proposals[pos].imgUrls.push(i);
          })
          _this.loading = false;
          _this.showProposalDetails(this.proposals[pos]);
        }).catch(res=>{
          console.log(res);
        })
      }
      else{
        console.log('否则');
        _this.loading = false;
        _this.showProposalDetails(this.proposals[pos]);
      }
    },
    showProposalDetails: function (proposal){
      console.log(proposal);
      this.proposalVisible = true;
      this.currentProposal = proposal;


    },
    scrollBottom:function(){
      var _this=this;
      this.$nextTick(function(){
        var container = _this.$el.querySelector(".chatBox");
        container.scrollTop = 999999999;
      });
    },
  },
}
</script>

<style>
.drag{
  flex: auto;
  justify-content: center;
  width: 80px;
  height: 80px;
  position: absolute;
  border-radius: 40px;
  top: 500px;
  right: 0;
  z-index: 778;
  /*background-color: var(--base-primary);*/
  /*background-image: url("http://resource.voguexplorer.com/fashion/robot/robot.png");*/
}
.circleBtn{
  flex: auto;
  width: 80px;
  height: 80px;
  background-image: url("http://resource.voguexplorer.com/fashion/robot/robot.png");
}
.chatAppBody{
  display: flex;
  flex-direction: column;
  width: 30vw;
  height: 80vh;
  position: absolute;
  top: 100px;
  right: 100px;
  background-color: #f1f5f8;
  z-index: 777;
}
.chatTitle{
  background: var(--base-primary-darken);
  color: white;
  font-family: "KaiTi",serif;
  font-size: x-large;
}
.chatCloseBtn{
  background: var(--base-primary-darken);
  color: white;
}
.chatBox{
  flex: 1;
  padding: 0 5px;
  overflow-y: scroll;
}
.chatBottom{
  background: #fff;
}
.chatServer{
  display: flex;
  flex-direction: column;
}
.chatClient{
  display: flex;
  flex-direction: column;
}
.chatRow{
  display: flex;
  align-items: flex-start;
  margin: 5px 0px;
}
.chatAvatar{
  margin-right: 5px;
  flex-shrink: 0;
}
.chatMsgContent{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.chatUsername {
  font-size: 12px;
  white-space: nowrap;
  color: #999;
  margin-bottom: 2px;
}
.chatTimestamp{
  font-size: 12px;
  white-space: nowrap;
  color: #999a9b;
  text-align: center;
}
.chatContent{
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  background-color: rgb(255,255,255);
  box-shadow: 0 5px 30px rgb(50 50 93 / 8%), 0 1px 3px rgb(0 0 0 / 5%);
  font-size: 14px;
  word-break: break-all;
  line-height: 21px;
  text-align: left;
}
.chatRowMe{
  justify-content: flex-end;
}
.chatRowMe .chatContent{
  border-radius: 10px 10px 0px 10px;
  text-align: left;
}
.chatArea{
  margin: 0px 10px;
  margin-bottom: 10px;
  display: flex;
  padding: 6px 5px;
  align-items: center;
  flex:1;
  box-shadow: 0 5px 30px rgb(50 50 93 / 8%), 0 1px 3px rgb(0 0 0 / 5%);
  border-radius: 10px;
  background: #fff;
}
.chatAreaInput{
  border-radius: 10px;
  border: none;
  flex: 1;
  outline: none;
  resize: none;
  box-sizing: border-box;
  color: #505050;
  min-height: 35px;
  font-size: 16px;
}
.chatCopyright{
  color: #999a9b;
  font-size: 12px;
  text-align: center;
  margin-bottom: 10px;
  filter: grayscale(1);
  opacity: .9;
  font-family: Inter,-apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Tahoma,Arial,sans-serif;
}
.chatSendProduct{
  display: flex;
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  background-color: rgb(255,255,255);
  box-shadow: 0 5px 30px rgb(50 50 93 / 8%), 0 1px 3px rgb(0 0 0 / 5%);
  font-size: 14px;
  word-break: break-all;
  line-height: 21px;
  /*background: #fff;*/
  /*margin: 2px 10px;*/
  /*padding: 10px;*/
  /*font-size: 14px;*/
  /*border-radius: 10px;*/
  /*position: absolute;*/
  /*bottom: 85px;*/
  /*left: 0;*/
  /*right: 0;*/
  /*z-index: 999;*/
  /*box-shadow: 0 5px 30px rgb(50 50 93 / 8%), 0 1px 3px rgb(0 0 0 / 5%);*/
}
.chatSendProduct .productImg{
  max-width: 80px;
  max-height: 80px;
}
.chatSendProduct .productInfo{
  margin: 0 5px;
  flex: 1;
  text-align: left;
}
.chatSendProduct .productBtns{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
}
</style>
