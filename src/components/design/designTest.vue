<template>
  <div>
    <div v-drag class="drag">
    </div>
    <div>
      <template>
        <beautiful-chat
          :participants="participants"
          :titleImageUrl="titleImageUrl"
          :onMessageWasSent="onMessageWasSent"
          :messageList="messageList"
          :newMessagesCount="newMessagesCount"
          :isOpen="isChatOpen"
          :close="closeChat"
          :icons="icons"
          :open="openChat"
          :showEmoji="true"
          :showFile="true"
          :showEdition="true"
          :showDeletion="true"
          :showTypingIndicator="showTypingIndicator"
          :showLauncher="true"
          :showCloseButton="true"
          :colors="colors"
          :alwaysScrollToBottom="alwaysScrollToBottom"
          :messageStyling="messageStyling"
          @onType="handleOnType"
          @edit="editMessage">
          <!--          一些插槽用法-->
          <template v-slot:header>
            时尚小谙
          </template>
        </beautiful-chat>
      </template>
    </div>
  </div>
</template>

<script>

import {getUploadToken, ripupload} from "../../api/design";
import {showError} from "./alert";
import AtsButton from "../common/AtsButton.vue";
import CloseIcon from '../../assets/icons/x-circle.svg'
import OpenIcon from '../../assets/icons/chat-dots.svg'
import FileIcon from '../../assets/icons/file-earmark-check.svg'
import CloseIconSvg from '../../assets/icons/arrow-through-heart.svg'


export default {
  name: "designTest",
  components: {AtsButton},
  directives:{
    drag(el,bindings){
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
  data() {
    return {
      icons:{
        open:{
          img: OpenIcon,
          name: '小谙',
        },
        close:{
          img: CloseIcon,
          name: 'default',
        },
        file:{
          img: FileIcon,
          name: 'default',
        },
        closeSvg:{
          img: CloseIconSvg,
          name: 'default',
        },
      },
      participants: [
        {
          id: 'user1',
          name: 'Matteo',
          imageUrl: 'http://euphonium.cn/develop_team/zcx.png'
        },
      ], //对话的所有参与者的列表。“ name”是用户名，“ id”用于建立消息作者，“ imageUrl”是用户头像。
      titleImageUrl: 'http://euphonium.cn/develop_team/zcx.png',
      messageList: [
        { type: 'text', author: `me`, data: { text: `` } },
        { type: 'text', author: `user1`, data: { text: `No.` } },

      ], // 显示的消息列表，可以动态分页和调整
      newMessagesCount: 0,
      isChatOpen: false, // 确定应该打开还是关闭聊天窗口
      showTypingIndicator: '', // 设置为与participant.id相匹配的值时，它将显示特定用户的打字指示
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          //bg: '#4e8cff'
          bg: '#b5eafd'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // 指定组件的配色方案
      alwaysScrollToBottom: false,
      messageStyling: true
    }
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({author: 'support', type: 'text', data: {text}})
      }
    },
    onMessageWasSent(message) {
      this.messageList = [...this.messageList, message]
      console.log('消息已发出');
      this.messageList.push(
        { type: 'text', author: `user1`, data: { text: `haha.` } }
      )
    },
    openChat() {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat() {
      this.isChatOpen = false
    },
    handleScrollToTop() {
    },
    handleOnType() {
      console.log('Emit typing event')
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
    testA(){
      console.log('aaaaa');
    }
  },
}
</script>

<style scoped>
.drag{
  flex: auto;
  justify-content: center;
  width: 80px;
  height: 80px;
  position: absolute;
  border-radius: 60px;
  top: 500px;
  right: 0;
  background-color: var(--base-primary);
  background-image: url("http://resource.voguexplorer.com/fashion/robot/robot.png");
}
</style>
