<template>
  <div>
    <GradientBackground/>
    <section class="flex justify-center">
      <el-card class="flex-column community-item-edit-card">
        <div class="flex justify-center">
          <div v-if="mode" class="community-item-edit-header">AIGC上传面板</div>
          <div v-else class="community-item-edit-header">AIGC修改面板</div>
        </div>
        <div class="flex justify-end" style="margin-right: 5%">
          <ats-button type="primary" @click="previewAIGC">
            <i class="bi bi-play" style="font-size: 15px">预览</i>
          </ats-button>
          <ats-button type="pink" @click="handleUpload">
            <i class="bi bi-arrow-bar-up" style="font-size: 15px">提交</i>
          </ats-button>
        </div>
        <div class="flex-column" style="margin-top: 10px">
          <div class="flex justify-start">
            <div class="community-item-edit-text">
              作品名称：
            </div>
            <el-input
              style="width: 40%"
              v-model="nameInput"
              :placeholder="namePlaceholder"
              clearable
            >
            </el-input>
<!--            <div class="community-item-edit-text">-->
<!--              添加prompt：-->
<!--            </div>-->
<!--            <div class="flex justify-start prompt-area">-->
<!--              <el-input-->
<!--                class="community-item-edit-prompt-input"-->
<!--                v-if="promptInputVisible"-->
<!--                v-model="promptInput"-->
<!--                ref="savePromptInput"-->
<!--                size="small"-->
<!--                @keyup.enter.native="promptInputConfirm"-->
<!--                @blur="promptInputConfirm"-->
<!--              >-->
<!--              </el-input>-->
<!--              <el-button-->
<!--                class="community-item-edit-prompt-button"-->
<!--                v-else-->
<!--                size="small"-->
<!--                @click="showPromptInput"-->
<!--              >-->
<!--                + New Prompt-->
<!--              </el-button>-->
<!--              <el-tag-->
<!--              class="community-item-edit-prompt"-->
<!--              v-for="prompt in prompts"-->
<!--              closable-->
<!--              :disable-transitions="false"-->
<!--              effect="dark"-->
<!--              @close="deletePrompt(prompt)"-->
<!--            >-->
<!--              {{prompt}}-->
<!--            </el-tag>-->
<!--            </div>-->
          </div>
          <div class="flex justify-start" style="margin-top: 5px">
            <div class="community-item-edit-text">
              作品描述：
            </div>
            <el-input
              style="width: 40%"
              type="textarea"
              resize="none"
              v-model="descriptionInput"
              :placeholder="descriptionPlaceholder"
              rows="3"
            >
            </el-input>
            <div class="community-item-edit-text">
              Prompt：
            </div>
            <el-input
              style="width: 40%"
              type="textarea"
              resize="none"
              v-model="promptInput"
              :placeholder="promptPlaceholder"
              rows="3"
            >
            </el-input>
<!--            <div class="community-item-edit-text">-->
<!--              添加tag：-->
<!--            </div>-->
<!--            <div class="flex justify-start">-->
<!--              <el-tag-->
<!--                class="community-item-edit-prompt"-->
<!--                v-for="tag in tags"-->
<!--                closable-->
<!--                :disable-transitions="false"-->
<!--                effect="dark"-->
<!--                @close="deleteTag(tag)"-->
<!--              >-->
<!--                {{tag}}-->
<!--              </el-tag>-->
<!--              <el-input-->
<!--                class="community-item-edit-prompt-input"-->
<!--                v-if="tagInputVisible"-->
<!--                v-model="tagInput"-->
<!--                ref="saveTagInput"-->
<!--                size="small"-->
<!--                @keyup.enter.native="tagInputConfirm"-->
<!--                @blur="tagInputConfirm"-->
<!--              >-->
<!--              </el-input>-->
<!--              <el-button-->
<!--                class="community-item-edit-prompt-button"-->
<!--                v-else-->
<!--                size="small"-->
<!--                @click="showTagInput"-->
<!--              >-->
<!--                + New Tag-->
<!--              </el-button>-->
<!--              <div class="community-item-edit-tag-prompt" @click="synchronizeTagPrompt">-->
<!--                <i class="bi bi-arrow-repeat" style="font-size: 15px"></i>-->
<!--                Tag与Prompt同步-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </div>
        <div class="flex justify-center" style="margin-top: 20px">
          <el-collapse v-model="activeNames" class="community-item-edit-collapse">
            <el-collapse-item name="1">
              <template slot="title">
                <i class="bi bi-card-image collapse-title">原始图像 *</i>
              </template>
              <div class="flex justify-start" v-loading="loading0">
                <div class="community-item-edit-upload-box flex-column">
                  <el-upload
                    class="avatar-uploaderAIGC w-full h-auto"
                    ref="upload0"
                    action="http://upload-z2.qiniup.com"
                    accept="image"
                    :show-file-list="false"
                    :data="uploadData[0]"
                    :auto-upload = "false"
                    :multiple="true"
                    :on-change = "handleChange0"
                    :on-success="handleSuccess0"
                    :before-upload="beforeUpload0"
                    :on-Error="handleError"
                    :file-list="fileLists[0]"
                  >
                    <el-image v-if="imageUrl0" :src="imageUrl0" class="avatarAIGC" fit="contain">
                    </el-image>
                    <div v-else
                         class="uploaderAIGC-tips mx-auto flex flex-col items-center justify-center text-center"
                    >
                      <i class="uploaderAIGC-tips-txt bi bi-plus-circle "></i>
                      <p class="uploaderAIGC-tips-txt">上传图片</p>
                    </div>
                  </el-upload>
                  <el-button
                    v-if="imageUrl0"
                    @click="removeImage(0)"
                  >
                    移除
                  </el-button>
                </div>
                <div class="flex justify-center" style="width: 10%" v-if="imageUrl0">
                  <el-image
                    class="community-item-edit-arrow"
                    src="http://resource.voguexplorer.com/community/test-arrow.jpg"
                    fit="contain"
                  >
                  </el-image>
                </div>
                <div class="flex justify-center" style="width: 70%; margin: auto" v-if="imageUrl0">
                  <div style="width: 25%; overflow: hidden;">
                    <img class="show-up-left" :src="imageUrl0"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-up-right" :src="imageUrl0"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-left" :src="imageUrl0"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-right" :src="imageUrl0"/>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template slot="title">
                <i class="bi bi-box-arrow-up-left collapse-title">细化图像（左上）</i>
              </template>
              <div class="flex justify-center" v-if="originImageReady" v-loading="loading1">
                <div class="community-item-edit-upload-box flex-column">
                  <el-upload
                    class="avatar-uploaderAIGC w-full h-auto"
                    ref="upload1"
                    action="http://upload-z2.qiniup.com"
                    accept="image"
                    :show-file-list="false"
                    :data="uploadData[1]"
                    :auto-upload = "false"
                    :multiple="true"
                    :on-change = "handleChange1"
                    :on-success="handleSuccess1"
                    :before-upload="beforeUpload1"
                    :on-Error="handleError"
                    :file-list="fileLists[1]"
                  >
                    <el-image v-if="imageUrl1" :src="imageUrl1" class="avatarAIGC" fit="contain">
                    </el-image>
                    <div v-else
                         class="uploaderAIGC-tips mx-auto flex flex-col items-center justify-center text-center"
                    >
                      <i class="uploaderAIGC-tips-txt bi bi-plus-circle "></i>
                      <p class="uploaderAIGC-tips-txt">上传图片</p>
                    </div>
                  </el-upload>
                  <el-button
                    v-if="imageUrl1"
                    @click="removeImage(1)"
                  >
                    移除
                  </el-button>
                </div>
                <div class="flex justify-center" style="width: 10%" v-if="imageUrl1">
                  <el-image
                    class="community-item-edit-arrow"
                    src="http://resource.voguexplorer.com/community/test-arrow.jpg"
                    fit="contain"
                  >
                  </el-image>
                </div>
                <div class="flex justify-center" style="width: 70%; margin: auto" v-if="imageUrl1">
                  <div style="width: 25%; overflow: hidden;">
                    <img class="show-up-left" :src="imageUrl1"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-up-right" :src="imageUrl1"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-left" :src="imageUrl1"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-right" :src="imageUrl1"/>
                  </div>
                </div>
              </div>
              <div class="flex justify-center origin-image-not-ready-warning" v-else>
                请先上传原始图像!
              </div>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template slot="title">
                <i class="bi bi-box-arrow-up-right collapse-title">细化图像（右上）</i>
              </template>
              <div class="flex justify-center" v-if="originImageReady" v-loading="loading2">
                <div class="community-item-edit-upload-box flex-column">
                  <el-upload
                    class="avatar-uploaderAIGC w-full h-auto"
                    ref="upload2"
                    action="http://upload-z2.qiniup.com"
                    accept="image"
                    :show-file-list="false"
                    :data="uploadData[2]"
                    :auto-upload = "false"
                    :multiple="true"
                    :on-change = "handleChange2"
                    :on-success="handleSuccess2"
                    :before-upload="beforeUpload2"
                    :on-Error="handleError"
                    :file-list="fileLists[2]"
                  >
                    <el-image v-if="imageUrl2" :src="imageUrl2" class="avatarAIGC" fit="contain">
                    </el-image>
                    <div v-else
                         class="uploaderAIGC-tips mx-auto flex flex-col items-center justify-center text-center"
                    >
                      <i class="uploaderAIGC-tips-txt bi bi-plus-circle "></i>
                      <p class="uploaderAIGC-tips-txt">上传图片</p>
                    </div>
                  </el-upload>
                  <el-button
                    v-if="imageUrl2"
                    @click="removeImage(2)"
                  >
                    移除
                  </el-button>
                </div>
                <div class="flex justify-center" style="width: 10%" v-if="imageUrl2">
                  <el-image
                    class="community-item-edit-arrow"
                    src="http://resource.voguexplorer.com/community/test-arrow.jpg"
                    fit="contain"
                  >
                  </el-image>
                </div>
                <div class="flex justify-center" style="width: 70%; margin: auto" v-if="imageUrl2">
                  <div style="width: 25%; overflow: hidden;">
                    <img class="show-up-left" :src="imageUrl2"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-up-right" :src="imageUrl2"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-left" :src="imageUrl2"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-right" :src="imageUrl2"/>
                  </div>
                </div>
              </div>
              <div class="flex justify-center origin-image-not-ready-warning" v-else>
                请先上传原始图像!
              </div>
            </el-collapse-item>
            <el-collapse-item name="4">
              <template slot="title">
                <i class="bi bi-box-arrow-down-left collapse-title">细化图像（左下）</i>
              </template>
              <div class="flex justify-center" v-if="originImageReady" v-loading="loading3">
                <div class="community-item-edit-upload-box flex-column">
                  <el-upload
                    class="avatar-uploaderAIGC w-full h-auto"
                    ref="upload3"
                    action="http://upload-z2.qiniup.com"
                    accept="image"
                    :show-file-list="false"
                    :data="uploadData[3]"
                    :auto-upload = "false"
                    :multiple="true"
                    :on-change = "handleChange3"
                    :on-success="handleSuccess3"
                    :before-upload="beforeUpload3"
                    :on-Error="handleError"
                    :file-list="fileLists[3]"
                  >
                    <el-image v-if="imageUrl3" :src="imageUrl3" class="avatarAIGC" fit="contain">
                    </el-image>
                    <div v-else
                         class="uploaderAIGC-tips mx-auto flex flex-col items-center justify-center text-center"
                    >
                      <i class="uploaderAIGC-tips-txt bi bi-plus-circle "></i>
                      <p class="uploaderAIGC-tips-txt">上传图片</p>
                    </div>
                  </el-upload>
                  <el-button
                    v-if="imageUrl3"
                    @click="removeImage(3)"
                  >
                    移除
                  </el-button>
                </div>
                <div class="flex justify-center" style="width: 10%" v-if="imageUrl3">
                  <el-image
                    class="community-item-edit-arrow"
                    src="http://resource.voguexplorer.com/community/test-arrow.jpg"
                    fit="contain"
                  >
                  </el-image>
                </div>
                <div class="flex justify-center" style="width: 70%; margin: auto" v-if="imageUrl3">
                  <div style="width: 25%; overflow: hidden;">
                    <img class="show-up-left" :src="imageUrl3"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-up-right" :src="imageUrl3"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-left" :src="imageUrl3"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-right" :src="imageUrl3"/>
                  </div>
                </div>
              </div>
              <div class="flex justify-center origin-image-not-ready-warning" v-else>
                请先上传原始图像!
              </div>
            </el-collapse-item>
            <el-collapse-item name="5">
              <template slot="title">
                <i class="bi bi-box-arrow-down-right collapse-title">细化图像（右下）</i>
              </template>
              <div class="flex justify-center" v-if="originImageReady" v-loading="loading4">
                <div class="community-item-edit-upload-box flex-column">
                  <el-upload
                    class="avatar-uploaderAIGC w-full h-auto"
                    ref="upload4"
                    action="http://upload-z2.qiniup.com"
                    accept="image"
                    :show-file-list="false"
                    :data="uploadData[4]"
                    :auto-upload = "false"
                    :multiple="true"
                    :on-change = "handleChange4"
                    :on-success="handleSuccess4"
                    :before-upload="beforeUpload4"
                    :on-Error="handleError"
                    :file-list="fileLists[4]"
                  >
                    <el-image v-if="imageUrl4" :src="imageUrl4" class="avatarAIGC" fit="contain">
                    </el-image>
                    <div v-else
                         class="uploaderAIGC-tips mx-auto flex flex-col items-center justify-center text-center"
                    >
                      <i class="uploaderAIGC-tips-txt bi bi-plus-circle "></i>
                      <p class="uploaderAIGC-tips-txt">上传图片</p>
                    </div>
                  </el-upload>
                  <el-button
                    v-if="imageUrl4"
                    @click="removeImage(4)"
                  >
                    移除
                  </el-button>
                </div>
                <div class="flex justify-center" style="width: 10%" v-if="imageUrl4">
                  <el-image
                    class="community-item-edit-arrow"
                    src="http://resource.voguexplorer.com/community/test-arrow.jpg"
                    fit="contain"
                  >
                  </el-image>
                </div>
                <div class="flex justify-center" style="width: 70%; margin: auto" v-if="imageUrl4">
                  <div style="width: 25%; overflow: hidden;">
                    <img class="show-up-left" :src="imageUrl4"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-up-right" :src="imageUrl4"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-left" :src="imageUrl4"/>
                  </div>
                  <div style="width: 25%">
                    <img class="show-down-right" :src="imageUrl4"/>
                  </div>
                </div>
              </div>
              <div class="flex justify-center origin-image-not-ready-warning" v-else>
                请先上传原始图像!
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </section>
  </div>

</template>

<script>
import GradientBackground from "../common/GradientBackground";
import AtsButton from "../common/AtsButton";
import {addOneContent, getUploadToken} from "../../api/communityAPI";
export default {
  name: "communityItemEdit",
  components: {GradientBackground, AtsButton},
  data: function (){
    return{
      mode: true,  // true表示新增，false表示修改
      loading0: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,

      nameInput: '',
      namePlaceholder: '请输入作品名称 *',
      descriptionInput: '',
      descriptionPlaceholder: '请输入作品描述',
      promptInput: '',
      promptPlaceholder: '请输入prompt *',

      activeNames: ['1'],
      originImageReady: false,

      fileLists: [
        [],[],[],[],[]
      ],
      uploadData: [
        {
          token:"",
          key:""
        },
        {
          token:"",
          key:""
        },
        {
          token:"",
          key:""
        },
        {
          token:"",
          key:""
        },
        {
          token:"",
          key:""
        }
      ],
      imageUrl0: null,
      imageUrl1: null,
      imageUrl2: null,
      imageUrl3: null,
      imageUrl4: null,
      imageKeys:['','','','',''],
    }
  },
  created: function () {
    console.log(this.$store.state.roleType)
    console.log(this.$route.query.mode)
    this.mode = this.$route.query.mode === 'add'
  },
  mounted: function (){
    this.getToken()
  },
  methods:{
    // upload相关
    getToken:function (){
      let _this = this
      getUploadToken({
        forever: true
      }).then(res=>{
        console.log("getUploadToken:",res.data.data);
        _this.uploadData.forEach((i)=>{
          i.token = res.data.data
        })
      })
    },
    handleChange0: function (file, fileList){
      if(this.beforeUpload0(file.raw) && file.status === 'ready'){
        this.handleChange(file, fileList, 0)
      }
    },
    handleChange1: function (file, fileList){
      if(this.beforeUpload1(file.raw) && file.status === 'ready'){
        this.handleChange(file, fileList, 1)
      }
    },
    handleChange2: function (file, fileList){
      if(this.beforeUpload2(file.raw) && file.status === 'ready'){
        this.handleChange(file, fileList, 2)
      }
    },
    handleChange3: function (file, fileList){
      if(this.beforeUpload3(file.raw) && file.status === 'ready'){
        this.handleChange(file, fileList, 3)
      }
    },
    handleChange4: function (file, fileList){
      if(this.beforeUpload4(file.raw) && file.status === 'ready'){
        this.handleChange(file, fileList, 4)
      }
    },
    handleChange: function (file, fileList, index){
      if(fileList.length>1){
        fileList.splice(0,1)
      }
      console.log(fileList[0])
      var This = this
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function(e){
        // this.result // 这个就是base64编码了
        var target = 'imageUrl' + index.toString()
        switch (index){
          case 0: This.imageUrl0 = this.result; break
          case 1: This.imageUrl1 = this.result; break
          case 2: This.imageUrl2 = this.result; break
          case 3: This.imageUrl3 = this.result; break
          case 4: This.imageUrl4 = this.result; break
        }
        // 因为允许用户自己选择素材库，所以如果在上传之前，用户先选了素材库（会导致imageKeyList对应项有值），那么必须赋予null值
        This.imageKeys[index] = null
        This.originImageReady = true
        setTimeout(()=>{
          This.loading0 = false
          This.loading1 = false
          This.loading2 = false
          This.loading3 = false
          This.loading4 = false
        },1000)
      }
    },
    beforeUpload0: function (file){
      this.loading0 = true
      return this.beforeUpload(file, 0)
    },
    beforeUpload1: function (file){
      this.loading1 = true
      return this.beforeUpload(file, 1)
    },
    beforeUpload2: function (file){
      this.loading2 = true
      return this.beforeUpload(file, 2)
    },
    beforeUpload3: function (file){
      this.loading3 = true
      return this.beforeUpload(file, 3)
    },
    beforeUpload4: function (file){
      this.loading4 = true
      return this.beforeUpload(file, 4)
    },
    beforeUpload: function (file, index){
      const suffix = file.name.split('.')
      const banlist = suffix[suffix.length-1] === 'jfif'
      const isJPG = (file.type === "image/jpeg") || (file.type === "image/png")
      console.log('文件名:'+file.name)
      console.log("beforeUpload",isJPG)
      if(!isJPG){
        this.$message.error('上传图片只能为JPG或PNG格式')
        this.fileLists[index] = []
        this.imageKeys[index] = ''
        return false;
      }
      console.log(index);
      console.log(this.uploadData[index])
      this.uploadData[index].key=this.getName(file.name)
      return true;
    },
    removeImage:function (index){
      this.fileLists[index] = []
      this.imageKeys[index] = ''
      switch (index){
        case 0: {
          this.imageUrl0 = null
          this.originImageReady = false
          break
        }
        case 1: this.imageUrl1 = null; break
        case 2: this.imageUrl2 = null; break
        case 3: this.imageUrl3 = null; break
        case 4: this.imageUrl4 = null; break
      }
    },
    handleSuccess0: function (res, file){
      this.handleSuccess(res, file, 0)
    },
    handleSuccess1: function (res, file){
      this.handleSuccess(res, file, 1)
    },
    handleSuccess2: function (res, file){
      this.handleSuccess(res, file, 2)
    },
    handleSuccess3: function (res, file){
      this.handleSuccess(res, file, 3)
    },
    handleSuccess4: function (res, file){
      this.handleSuccess(res, file, 4)
    },
    handleSuccess: function (res, file, index){
      switch (index){
        case 0: this.imageUrl0 = this.$store.state.domain  + res.key; break
        case 1: this.imageUrl1 = this.$store.state.domain  + res.key; break
        case 2: this.imageUrl2 = this.$store.state.domain  + res.key; break
        case 3: this.imageUrl3 = this.$store.state.domain  + res.key; break
        case 4: this.imageUrl4 = this.$store.state.domain  + res.key; break
      }
      this.imageKeys[index] = res.key
      console.log(this.imageUrl0)
      console.log(res.key)

      if(index === 0){
        if(this.imageKeys[1] == null){
          this.$refs.upload1.submit()
        }else if(this.imageKeys[2] == null){
          this.$refs.upload2.submit()
        }else if(this.imageKeys[3] == null){
          this.$refs.upload3.submit()
        }else if(this.imageKeys[4] == null){
          this.$refs.upload4.submit()
        }else{
          this.submit()
        }
      }else if(index === 1){
        if(this.imageKeys[2] == null){
          this.$refs.upload2.submit()
        }else if(this.imageKeys[3] == null){
          this.$refs.upload3.submit()
        }else if(this.imageKeys[4] == null){
          this.$refs.upload4.submit()
        }else{
          this.submit()
        }
      }else if(index === 2){
        if(this.imageKeys[3] == null){
          this.$refs.upload3.submit()
        }else if(this.imageKeys[4] == null){
          this.$refs.upload4.submit()
        }else{
          this.submit()
        }
      }else if(index === 3){
        if(this.imageKeys[4] == null){
          this.$refs.upload4.submit()
        }else{
          this.submit()
        }
      }else{
        this.submit()
      }
    },
    handleUpload:function (){
      if(this.nameInput === ''){
        this.$message.error('作品名称不能为空！')
        return
      }
      if(this.promptInput === ''){
        this.$message.error('作品的prompt不能为空！')
        return
      }
      if(this.imageKeys[0] == null){
        this.$refs.upload0.submit();
      }else{
        this.$message.error('原始图像不能为空！')
      }
    },
    submit: function (){
      console.log('check urls before submit to back end')
      console.log(this.imageUrl0)
      console.log(this.imageUrl1)
      console.log(this.imageUrl2)
      console.log(this.imageUrl3)
      console.log(this.imageUrl4)
      let data={
        imageUrl1: this.imageUrl0,
        imageUrl2: this.imageUrl1,
        imageUrl3: this.imageUrl2,
        imageUrl4: this.imageUrl3,
        imageUrl5: this.imageUrl4,
        name: this.nameInput,
        description: this.descriptionInput,
        prompt: this.promptInput,
        publisherId: parseInt(this.$store.state.userId),
      }
      this.$message.warning('作品正在上传，请耐心等待~')
      addOneContent(data).then(async res => {
        console.log('upload success!')
        this.$message.success('上传作品成功！')
        await setTimeout(function (){
          location.reload()
        }, 1000)
      })
      // todo: 调用创建或修改AIGC的api
    },
    handleError: function (res){
      console.log("Error:",res);
    },
    getName: function (name){
      let timestamp = Date.parse(new Date())
      let newName = "community/community_" + timestamp + '_' + name
      console.log("newName: ",newName)
      return newName
    },
    previewAIGC: function (){
      // todo: 使用dialog呈现预览效果
      this.$message('该功能尚未开放')
    }

  }
}
</script>

<style scoped>
.community-item-edit-card{
  flex-direction: row;
  width: 80%;
  margin-top: 50px;
  margin-bottom: 50px;
  border-radius:  0.8rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.community-item-edit-header{
  font-size: 50px;
  font-weight: bold;
}
.community-item-edit-text{
  margin-left: 2%;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}
.prompt-area{
  width: 40%;
  overflow: auto;
}
.prompt-area::-webkit-scrollbar{
  width: 0;
  height: 2px;
  background-color: lightgrey;
}
.prompt-area::-webkit-scrollbar-thumb{
  border-radius: 0.5rem;
  background-color: darkgrey;
}
.community-item-edit-prompt{
  height: 30px;
  margin-right: 5px;
}
.community-item-edit-prompt-input{
  width: 80px;
  height: 30px;
  margin-right: 5px;
}
.community-item-edit-prompt-button{
  width: 150px;
  height: 30px;
  margin-right: 5px;
}
.community-item-edit-tag-prompt{
  font-size: 15px;
  color: blue;
  text-decoration: underline;
  text-underline: blue;
}
.community-item-edit-tag-prompt:hover{
  cursor: pointer;
}
.community-item-edit-collapse{
  width: 95%;
}
.collapse-title{
  font-size: 20px;
}
.origin-image-not-ready-warning{
  font-size: 30px;
  color: grey;
}
.community-item-edit-upload-box{
  width: 20%;
}
.community-item-edit-arrow{
  width: 50%;
}
.show-up-left{
  clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
  transform: translate(25%, 25%);
}
.show-up-right{
  clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
  transform: translate(-25%, 25%);
}
.show-down-left{
  clip-path: polygon(0 50%, 50% 50%, 50% 100%, 0 100%);
  transform: translate(25%, -25%);
}
.show-down-right{
  clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
  transform: translate(-25%, -25%);
}

.avatar-uploaderAIGC .el-upload{
  border-radius: 6px;
  border: 3px dashed rgba(189, 189, 189, 1);
  background-color: rgba(243, 244, 248, 1);
  cursor: pointer;
  overflow: hidden;
  margin: auto;
  width: 100%;
  transition: all .2s;
}
.avatar-uploaderAIGC .el-upload:hover {
  border-color: var(--base-primary);
}
.uploaderAIGC-tips-txt {
  transition: all .2s;
}
.avatar-uploaderAIGC:hover .uploaderAIGC-tips-txt {
  color: var(--base-primary);
}
.uploaderAIGC-tips {
  color: rgba(189, 189, 189, 1);
  width: 100px;
  height: 100px;
  text-align: center;
}
i.uploaderAIGC-tips-txt{
  font-size: 30px;
}
.avatarAIGC {
  width: 100%;
  /*position: absolute;*/
  /*display: block;*/
}

.errorAlertAIGC{
  width: 50%;
  padding: 0 5px 10px 10px;

}
</style>
