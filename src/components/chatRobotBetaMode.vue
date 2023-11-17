<template>
  <div>
    <div class="chatAppBody">
      <section class="flex">
        <section class="grow chatTitleBeta">
          时尚小谙Beta
          <ats-button @click="changeMode($event)">Alpha</ats-button>
        </section>
      </section>
      <div class="chatBox">
        <div v-for="item in historyList">
          <div class="chatServer" v-if="item.user==='server'">
            <div class="chatTimestamp">{{item.showtime}}</div>
            <div class="chatRow">
              <el-avatar class="chatAvatar" :size="30" src="http://euphonium.cn/develop_team/zcx.png"></el-avatar>
              <div class="chatMsgContent">
                <div class="chatUsername">小谙Beta</div>
                <!--      基于chatGPT，暂时规定type均为text，即纯文本对话          -->
                <div class="chatContent" v-if="item.type==='text'">
                  {{item.data.message}}
                </div>
                <!--      todo：some v-elseif v-else cases          -->
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
  </div>
</template>

<script>
import AtsButton from "./common/AtsButton";
import { v4 as uuidv4 } from 'uuid';
import ImageShow from "./design/ImageShow";
import {chatGPTAPI} from "../api/design";
export default {
  name: "chatRobotBetaMode",
  components: {ImageShow, AtsButton},
  props:{
  },
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
            message:'您好，我是小谙Beta，很高兴为您服务。',
            appendix: '',
          }
        },
        {
          user:'server',
          datetime:{},
          showtime:'',
          type:'text',
          data:{
            message:'小谙Beta会尽力解决您在时尚穿搭方面的疑问和需求，现在我们可以开始交流了。',
            appendix: '',
          }
        },
      ],
      answerSet:'', // 将有效的回答拼接在一起
      serverList:[],
      clientList:[],
      loading: false,
    }
  },
  directives:{
    drag(el,bindings){ // 使组件可拖动
      el.onmousedown = function(e){
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
  mounted:function (){
    console.log('gptversion');
    this.historyList.forEach((i)=>{
      i.datetime = new Date();
      i.showtime = this.shortTime(i.datetime);
    })
  },
  methods:{
    changeMode:function(e){
      this.$emit("changeMode",e.currentTarget, false);
    },
    showCheckBox(){
      if(!this.chatBoxVisible){
        this.chatBoxVisible = true;
        this.scrollBottom();
      }else{
        this.chatBoxVisible = false;
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
    sendMessageByClient: function () {
      console.log('sending message');
      if(this.textarea === '' || !this.textarea) return;
      var question = {
        message: this.textarea,
        appendix: '',
      }
      this.clientList.push(question);
      this.addToHistory('client','text',question);
      this.textarea = '';
      this.processMessageByServer(question.message);
    },
    processMessageByServer: function (message){
      console.log('processing message');
      chatGPTAPI({text:message}).then(res=>{
        console.log(res.data);
        var answer = {
          message: res.data,
          appendix: '',
        }
        this.serverList.push(answer);
        this.addToHistory('server','text',answer);
      }).catch(res=>{
        console.log(res);
      })
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
    scrollBottom:function(){
      var _this=this;
      this.$nextTick(function(){
        var container = _this.$el.querySelector(".chatBox");
        container.scrollTop = 999999999;
      });
    },
  }
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
  border-radius: 15px;
  z-index: 777;
}
.chatTitleBeta{
  background: var(--base-pink-lightup);
  color: white;
  font-family: "KaiTi",serif;
  font-size: x-large;
  padding: 10px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.chatCloseBtn{
  background: var(--base-primary-darken);
  border-top-right-radius: 15px;
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
  margin: 10px;
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
