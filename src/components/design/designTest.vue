<template>
  <div>
    <div v-drag class="drag">
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
            Good chat between {{participants.map(m=>m.name).join(' & ')}}
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
// import CloseIcon from 'vue-beautiful-chat/src/assets/close-icon.png'
// import OpenIcon from 'vue-beautiful-chat/src/assets/logo-no-bg.svg'
// import FileIcon from 'vue-beautiful-chat/src/assets/file.svg'
// import CloseIconSvg from 'vue-beautiful-chat/src/assets/close.svg'


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
          // img: OpenIcon,
          img: 'http://euphonium.cn/develop_team/zcx.png',
          name: 'default',
        },
        close:{
          // img: CloseIcon,
          img: 'http://euphonium.cn/develop_team/zcx.png',
          name: 'default',
        },
        file:{
          // img: FileIcon,
          img: '',
          name: 'default',
        },
        closeSvg:{
          // img: CloseIconSvg,
          img: '',
          name: 'default',
        },
      },
      participants: [
        {
          id: 'user1',
          name: 'Matteo',
          imageUrl: '/u/1915989?s=230&v=4'
        },
        {
          id: 'user2',
          name: 'Support',
          imageUrl: '/u/37018832?s=200&v=4'
        }
      ], //对话的所有参与者的列表。“ name”是用户名，“ id”用于建立消息作者，“ imageUrl”是用户头像。
      titleImageUrl: '/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
        { type: 'text', author: `me`, data: { text: `Say yes!` } },
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
          bg: '#4e8cff'
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
