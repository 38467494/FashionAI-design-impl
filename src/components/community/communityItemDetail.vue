<template>
  <div>
    <section class="flex justify-start">
      <div class="flex justify-start items-start" style="width: 12%">
        <el-button class="btn-back" circle @click="backToCommunity">
          <i class="bi bi-arrow-left" style="font-size: 50px; color: dimgrey"></i>
        </el-button>
      </div>
      <el-card class="community-item-card">
        <div class="flex divide-x px-2">
          <section class="flex-column" style="width:55%;" v-loading="loading">
            <div class="flex">
              <el-image
                class="basis-1/2 north-west-image"
                :src="imagesToShow[0].imageUrl"
                fit="contain"
                @click="zoominImage(imagesToShow[0].imageUrl)"
                @dblclick="refineImage(0)"
              >
                <img :src="imagesToShow[0].imageUrl" slot="placeholder" class="el-image__placeholder"/>
              </el-image>
              <el-image
                class="basis-1/2 north-east-image"
                :src="imagesToShow[2].imageUrl"
                fit="contain"
                @click="zoominImage(imagesToShow[2].imageUrl)"
                @dblclick="refineImage(2)"
              >
                <img :src="imagesToShow[2].imageUrl" slot="placeholder" class="el-image__placeholder"/>
              </el-image>
            </div>
            <div class="flex">
              <el-image
                class="basis-1/2 south-west-image"
                :src="imagesToShow[1].imageUrl"
                fit="contain"
                @click="zoominImage(imagesToShow[1].imageUrl)"
                @dblclick="refineImage(1)"
              >
                <img :src="imagesToShow[1].imageUrl" slot="placeholder" class="el-image__placeholder"/>
              </el-image>
              <el-image
                class="basis-1/2 south-east-image"
                :src="imagesToShow[3].imageUrl"
                fit="contain"
                @click="zoominImage(imagesToShow[3].imageUrl)"
                @dblclick="refineImage(3)"
              >
                <img :src="imagesToShow[3].imageUrl" slot="placeholder" class="el-image__placeholder"/>
              </el-image>
            </div>
            <div class="flex justify-start" style="margin-top: 5px">
              <div v-if="refinement" @click="returnFromRefine" class="return-text">
                <i class="bi bi-arrow-90deg-up" style="font-size: 20px; color: mediumblue">返回上一级</i>
              </div>
              <div v-else class="hint-text">
                * 单机放大图像，双击查看细化设计
              </div>
            </div>
            <el-image-viewer
              v-if="zoomin"
              :on-close="zoomoutImage"
              :url-list="imagePreview"
            >
            </el-image-viewer>
          </section>
          <section class="flex-column" style="width:45%; height: 800px; padding:10px">
            <section class="flex-column">
              <div class="flex justify-start">
                <div class="community-item-name">{{item.name}}</div>
              </div>
              <div class="flex justify-start">
                <div class="community-item-publishment">{{item.publishTime}}</div>
                <div class="community-item-publishment">by</div>
                <el-avatar :src="item.publisherAvatar" :size="20" />
                <div class="community-item-publishment">{{item.publisher}}</div>
              </div>
              <div class="flex justify-start" style="height: 60px; overflow: hidden">
                <div class="community-item-description" style="text-align: left">{{item.description}}</div>
              </div>
<!--不再显示作品prompt，prompt以及真值只在作者个人空间可以查看-->
<!--              <div class="flex justify-start" style="margin-top: 20px">-->
<!--                <el-card class="community-item-prompt-card" shadow="hover">-->
<!--                  <div class="community-item-prompt-header">PROMPT</div>-->
<!--                  <div class="community-item-prompt-content" v-if="isLogin">{{item.prompt}}</div>-->
<!--                  <div class="community-item-prompt-content" v-else>请先登录查看作品prompt</div>-->
<!--                </el-card>-->
<!--              </div>-->
              <div class="flex justify-space-between" style="margin-top: 20px">
                <div class="basis-1/2 flex justify-start">
                  <el-badge :value="item.browsed" class="community-item-icon">
                    <i class="bi bi-eye" style="font-size: 25px"></i>
                  </el-badge>
                  <el-badge :value="item.liked" class="community-item-icon pointer">
                    <div @click="likeit">
                      <i class="bi bi-heart-fill" style="font-size: 25px; color: deeppink" v-if="isLiked"></i>
                      <i class="bi bi-heart" style="font-size: 25px" v-else></i>
                    </div>
                  </el-badge>
                  <el-badge :value="item.collected" class="community-item-icon pointer">
                    <div @click="collectit">
                      <i class="bi bi-star-fill" style="font-size: 25px; color: yellow" v-if="isCollected"></i>
                      <i class="bi bi-star" style="font-size: 25px" v-else></i>
                    </div>
                  </el-badge>
                </div>
<!--                投稿的功能放在全局，修改的功能放在个人空间-->
<!--                <div class="basis-1/2 flex justify-end" v-if="isAdministrator">-->
<!--                  <ats-button type="primary" :disabled="!isAdministrator" @click="gotoAIGC">-->
<!--                    <i class="bi bi-arrow-bar-up" style="font-size: 15px">我要投稿</i>-->
<!--                  </ats-button>-->
<!--                  <ats-button type="pink" disabled @click="modifyAIGC">-->
<!--                    <i class="bi bi-pencil" style="font-size: 15px">我要修改</i>-->
<!--                  </ats-button>-->
<!--                </div>-->
              </div>
            </section>
            <section class="" style="margin-top: 30px">
              <el-tabs v-model="activeName" type="card" :stretch="true" @tab-click="changeTab">
                <el-tab-pane name="reviews" :lazy="true">
                  <span slot="label" style="font-size: 15px">
                    <i class="bi bi-chat-left-dots" style="font-size: 20px"></i> 评论({{item.reviewed}})
                  </span>
                  <div class="type-area flex">
                    <el-avatar src="https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png" :size="50" />
                    <el-input
                      class="review-input-box"
                      type="textarea"
                      resize="none"
                      v-model="input"
                      :placeholder="placeholder"
                      rows="2"
                    >
                    </el-input>
                    <el-button type="primary" plain @click="sendReview" :disabled="!isLogin">
                      <i class="bi bi-send" style="font-size: 15px"></i>
                      <span style="font-size: 15px">发送</span>
                    </el-button>
                  </div>
                  <div v-loading="loadingReviews">
                    <div class="review-area" v-if="item.reviewed !== 0">
                      <div
                        v-for="(review, index) in reviews"
                        class="flex-column"
                      >
                        <div class="community-item-review flex">
                          <el-avatar :src="review.userAvatar" :size="30" style="margin-right: 10px"/>
                          <div class="flex-column">
                            <div class="flex justify-start">
                              <div class="review-user">
                                {{review.userName}}
                              </div>
                            </div>
                            <div class="flex justify-start">
                              <div class="review-content">
                                {{review.body}}
                              </div>
                            </div>
                            <div class="flex justify-start">
                              <div class="review-time">
                                {{review.replyTime}}
                              </div>
                              <div class="review-reply" @click="openReply(review)">
                                回复
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="type-area-reply flex" v-if="review.beingReplied">
                          <el-avatar src="https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png" :size="30" />
                          <el-input
                            class="reply-input-box"
                            type="textarea"
                            resize="none"
                            v-model="inputReply"
                            :placeholder="placeholderReply"
                            rows="2"
                          >
                          </el-input>
                          <el-button type="primary" plain @click="sendReply(review)" :disabled="!isLogin">
                            <i class="bi bi-send" style="font-size: 15px"></i>
                            <span style="font-size: 15px">发送</span>
                          </el-button>
                        </div>
                        <div
                          style="margin-left: 40px"
                          v-if="replies[index].length"
                        >
                          <div
                            v-for="(reply, subIndex) in replies[index]"
                            class="flex-column"
                          >
                            <div  class="community-item-review flex">
                              <el-avatar :src="reply.userAvatar" :size="30" style="margin-right: 10px"/>
                              <div class="flex-column">
                                <div class="flex justify-start">
                                  <div class="review-user">
                                    {{reply.userName}}
                                  </div>
                                </div>
                                <div class="flex justify-start">
                                  <div class="review-content">
                                    回复 {{reply.toUser}}: {{reply.body}}
                                  </div>
                                </div>
                                <div class="flex justify-start">
                                  <div class="review-time">
                                    {{reply.replyTime}}
                                  </div>
                                  <div class="review-reply" @click="openReply(reply)">
                                    回复
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="type-area flex" v-if="reply.beingReplied">
                              <el-avatar src="https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png" :size="30" />
                              <el-input
                                class="reply-input-box"
                                type="textarea"
                                resize="none"
                                v-model="inputReply"
                                :placeholder="placeholderReply"
                                rows="2"
                              >
                              </el-input>
                              <el-button type="primary" plain @click="sendReply(reply)" :disabled="!isLogin">
                                <i class="bi bi-send" style="font-size: 15px"></i>
                                <span style="font-size: 15px">发送</span>
                              </el-button>
                            </div>
                          </div>
                        </div>
                        <div class="community-item-review-bottom"></div>
                      </div>
                    </div>
                    <div class="empty-area" v-else>
                      <el-image src="/static/img/empty_area.png" class="empty-image"></el-image>
                    </div>
                  </div>

                </el-tab-pane>
                <el-tab-pane name="proposals" :lazy="true">
                  <span slot="label" style="font-size: 15px">
                    <i class="bi bi-stars" style="font-size: 20px"></i> 设计款({{item.designed}})
                  </span>
                  <div v-loading="loadingProposals">
                    <div class="proposal-area" v-if="item.designed !== 0">
                      <div v-for="(proposal, index) in proposals" class="flex-column">
                        <div class="community-proposal-card flex" @click="gotoProposalDetail(index)">
                          <div>
                            <el-image class="community-proposal-cover" :src="proposal.proposalCover"></el-image>
                          </div>
                          <div class="community-proposal-box flex-column">
                            <div class="flex justify-start">
                              <div class="community-proposal-caption">"{{proposal.caption}}"</div>
                            </div>
                            <div class="flex justify-end community-proposal-designer">
                              <div class="community-proposal-designer-name">——Designed by</div>
                              <el-avatar :src="proposal.designerAvatar" :size="30" />
                              <div class="community-proposal-designer-name">{{proposal.designerName}}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="empty-area" v-else>
                      <el-image src="/static/img/empty_area.png" class="empty-image"></el-image>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </section>
          </section>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
import NavText from "../collaborate/nav/navText";
import AtsButton from "../common/AtsButton";
import ElImageViewer from "element-ui/packages/image/src/image-viewer"
import {
  collectIt,
  discollectIt,
  dislikeIt,
  getComments,
  getOneItem,
  getSonImages,
  likeIt,
  publishOneComment
} from "../../api/communityAPI";

export default {
  name: "communityItemDetail",
  components: {AtsButton, NavText, ElImageViewer},
  data: function (){
    return{
      itemId: null,
      isLogin: false,
      userId: null,
      userAuth: null,
      isAdministrator: false,
      isPublisher: false,
      loading: false,
      loadingReviews: false,
      loadingProposals: false,
      item: {
        id: 0,
        name: '',
        description: '',

        publisher: 0,
        publisherAvatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png',
        publishTime: '',
        state: 0,

        prompt: '',
        browsed: 0,
        liked: 0,
        collected: 0,

        coverId: 0,
        images: [],
        subImages: [
          [], [], [], []
        ],
      },

      comments: [],
      reviews: [],
      replies: [],

      // 测试数据
      proposals: [
        {
          proposalId: 'proposal1',
          designerId: 'dId1',
          designerName: 'July',
          proposalCover: '/static/test/test00.jpg',
          designerAvatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png',
          caption: 'This is a proposal from July for content-X. We advice you to use pure cotton to make top shirt and dacron to make bottom skirt yyy abcd efgh ijk lmn.'
        },
        {
          proposalId: 'proposal2',
          designerId: 'dId2',
          designerName: 'Andy',
          proposalCover: '/static/test/test10.jpg',
          designerAvatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png',
          caption: 'This is a proposal from Andy for content-X. We advice you to use pure cotton to make top shirt and dacron to make bottom skirt.'
        },
        {
          proposalId: 'proposal3',
          designerId: 'dId3',
          designerName: 'Bob',
          proposalCover: '/static/test/test20.jpg',
          designerAvatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png',
          caption: 'This is a proposal from Bob for content-X. We advice you to use pure cotton to make top shirt and dacron to make bottom skirt.'
        },
        {
          proposalId: 'proposal4',
          designerId: 'dId4',
          designerName: 'Alex',
          proposalCover: '/static/test/test30.jpg',
          designerAvatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png',
          caption: 'This is a proposal from Alex for content-X. We advice you to use pure cotton to make top shirt and dacron to make bottom skirt.'
        },
        {
          proposalId: 'proposal5',
          designerId: 'dId5',
          designerName: 'David',
          proposalCover: '/static/test/test40.jpg',
          designerAvatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png',
          caption: 'This is a proposal from David for content-X. We advice you to use pure cotton to make top shirt and dacron to make bottom skirt.'
        },
        {
          proposalId: 'proposal6',
          designerId: 'dId6',
          designerName: 'Daniel',
          proposalCover: '/static/test/test00.jpg',
          designerAvatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png',
          caption: 'This is a proposal from Daniel for content-X. We advice you to use pure cotton to make top shirt and dacron to make bottom skirt.'
        },
        {
          proposalId: 'proposal7',
          designerId: 'dId7',
          designerName: 'George',
          proposalCover: '/static/test/test00.jpg',
          designerAvatar: 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png',
          caption: 'This is a proposal from George for content-X. We advice you to use pure cotton to make top shirt and dacron to make bottom skirt.'
        },
      ],

      imagesToShow: [],
      imagePreview: [],

      timer: null, //处理图片的单机双击事件
      zoomin: false,
      refinement: false,

      isLiked: false,
      isCollected: false,

      activeName: 'reviews',
      placeholder: '请发表你的评论: ',
      input: '',
      placeholderReply: '',
      inputReply: '',

      defaultTags :[
        {
          icon:'',
          text:'',
        }
      ],
    }
  },
  created:async function () {
    // if(this.userAuth === 0) this.isAdministrator = true
    await this.judgeAuth()
    await this.getItemInfo()
    await this.getCommentInfo()
  },
  mounted: function (){
    this.judgeAuth()
  },
  methods:{
    async judgeAuth(){
      // 0表示管理员，1表示设计师，2表示普通用户，null表示非登录状态
      // console.log('see roletype')
      // console.log(this.$store.state.accessToken)
      if(this.$store.state.roleType === null){
        this.isLogin = false
        this.userAuth = this.$store.state.roleType
      }
      else {
        this.isLogin = true
        this.userAuth = parseInt(this.$store.state.roleType)
      }
      // console.log(this.userAuth)
      if(this.isLogin){
        this.placeholder = '请发表你的评论: '
      }else{
        this.placeholder = '请先登录再发表评论~'
      }
      if(this.userAuth === 0) this.isAdministrator = true
      if(this.$store.state.userId !== null) this.userId = parseInt(this.$store.state.userId)
      else this.userId = -1
    },
    async getItemInfo(){
      this.itemId = this.$route.query.itemId
      if(this.$store.state.userId !== null) this.userId = parseInt(this.$store.state.userId)
      else this.userId = -1
      let _this = this
      // 获取内容基本信息
      await getOneItem({contentId: this.itemId, userId: this.userId}).then(res=>{
        console.log('check raw data')
        console.log(res.data.data)

        _this.item.id = res.data.data.id
        _this.item.name = res.data.data.name
        _this.item.description = res.data.data.description

        _this.item.publisher = res.data.data.publisher
        _this.item.publishTime = _this.getDateTime(res.data.data.publishTime)
        _this.item.state = res.data.data.state

        _this.item.prompt = res.data.data.prompt
        _this.item.browsed = res.data.data.browsed
        _this.item.liked = res.data.data.liked
        _this.item.collected = res.data.data.collected
        _this.item.reviewed = 0
        _this.item.designed = 7
        _this.isLiked = res.data.data.likedd
        _this.isCollected = res.data.data.collectedd

        _this.item.coverId = res.data.data.imageID
      })
      // 获取图片信息
      await getSonImages({imageId: this.item.coverId}).then(res=>{
        res.data.data.forEach((i)=>{
          _this.item.images.push({
            imageId: i.id,
            imageUrl: i.url,
            subjectTo: i.subjectTo
          })
        })
      })
      for(let i = 0; i < this.item.images.length; i++){
        await getSonImages({imageId: this.item.images[i].imageId}).then(async res => {
          if (res.data.data.length !== 0) {
            await getSonImages({imageId: res.data.data[0].id}).then(res2=>{
              res2.data.data.forEach((j)=>{
                _this.item.subImages[i].push({
                  imageId: j.id,
                  imageUrl: j.url,
                  subjectTo: i.subjectTo
                })
              })
            })
          }
        })
      }
      console.log(this.item)
      // 判断是否为作者
      if(this.userId === this.item.publisher && this.isAdministrator) this.isPublisher = true
      console.log(this.isAdministrator)
      console.log(this.isPublisher)
      this.imagesToShow = this.item.images
    },
    async getCommentInfo(){
      this.loadingReviews = true
      // 获取评论区信息
      this.itemId = this.$route.query.itemId
      let _this = this
      await getComments({id: this.itemId}).then(res=>{
        // console.log('comments:')
        // console.log(res.data.data)
        _this.parseCommentTree(res.data.data)
      })
      this.loadingReviews = false
    },
    parseCommentTree: function (data){
      this.comments.length = 0
      this.reviews.length = 0
      this.replies.length = 0
      data.forEach((i)=>{
        this.parseCommentNode(i)
      })
      // console.log('before division')
      // console.log(this.comments)
      this.divideComments()
    },
    parseCommentNode: function (comment){
      if(comment.author.avatar === '') {
        comment.author.avatar = 'https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221004195618.png'
      }
      let basicInfo = {
        id: comment.id,
        userId: comment.author.id,
        userName: comment.author.email,
        userAvatar: comment.author.avatar,
        body: comment.body,
        replyTime: this.getDateTime(comment.replyTime),
        level: comment.level,
        toComment: comment.parentId,
        beingReplied: false,
      }
      if(comment.toUser) basicInfo.toUser = comment.toUser.email
      if(comment.level > this.comments.length){
        this.comments.push([])
      }
      this.comments[comment.level-1].push(basicInfo)
      if(comment.childrens){
        comment.childrens.forEach((child)=>{
          this.parseCommentNode(child)
        })
      }
    },
    divideComments: function () {
      for(let i = 0; i < this.comments.length; i++){
        if(i === 0){
          for(let j = 0; j < this.comments[i].length; j++){
            this.comments[i][j].groupId = j
            this.reviews.push(this.comments[i][j])
            this.replies.push([])
          }
        }
        else{
          this.comments[i].forEach((j)=>{
            j.groupId = this.getParentComment(i, j.toComment)
          })
        }
      }
      this.comments.forEach((i)=>{
        i.forEach((j)=>{
          if(j.level>1){
            console.log(j)
            this.replies[j.groupId].push(j)
          }
        })
      })
      this.item.reviewed = this.reviews.length
      this.replies.forEach((i)=>{
        this.item.reviewed += i.length
      })
      // console.log('after division')
      // console.log(this.reviews)
      // console.log(this.replies)
    },
    getParentComment: function (level, parentId) {
      for(let i = 0; i < this.comments[level-1].length; i++){
        if(this.comments[level-1][i].id === parentId){
          return this.comments[level-1][i].groupId
        }
      }
      return -1
    },
    getDateTime: function (time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0]
    },
    zoominImage:function (image){
      clearTimeout(this.timer)
      let that = this
      this.timer=setTimeout(function(){
        console.log('zoom in')
        that.zoomin = true
        that.imagePreview = [image]
      }, 200)
    },
    zoomoutImage: function (){
      this.zoomin = false
    },
    refineImage:async function (imageIndex) {
      clearTimeout(this.timer) // 如果在200ms内完成双击，则单击事件的timer会被双击事件提前清理掉，因此不会触发单击事件
      if (this.item.subImages[imageIndex].length === 0) return
      if (!this.refinement) {
        console.log('refine')
        this.loading = true
        this.imagesToShow = this.item.subImages[imageIndex]
        await setTimeout(() => {
          this.refinement = true
          this.loading = false
        }, 1000)
      }
    },
    returnFromRefine: function (){
      if(this.refinement){
        this.imagesToShow = this.item.images
        this.refinement = false
      }
    },
    likeit:function(){
      if(!this.$store.state.loginName) {
        this.$router.push("/communitylogin");
      }
      else{
        let data = {
          userId: parseInt(this.$store.state.userId),
          contentId: this.itemId
        }
        if(this.isLiked){
          this.isLiked = false
          this.item.liked -= 1
          dislikeIt(data).then(res=>{
            console.log('cancel liked')
          }).catch(err=>{
            console.log('cancel liked failed:' + err)
          })
        }else{
          this.isLiked = true
          this.item.liked += 1
          likeIt(data).then(res=>{
            console.log('add liked')
          }).catch(err=>{
            console.log('add liked failed:' + err)
          })
        }
      }
    },
    collectit:function (){
      if(!this.$store.state.loginName) {
        this.$router.push("/communitylogin");
      }
      else {
        let data = {
          userId: parseInt(this.$store.state.userId),
          contentId: this.itemId
        }
        if(this.isCollected){
          this.isCollected = false
          this.item.collected -= 1
          discollectIt(data).then(res=>{
            console.log('cancel collected')
          }).catch(err=>{
            console.log('cancel collected failed:' + err)
          })
        }else{
          this.isCollected = true
          this.item.collected += 1
          collectIt(data).then(res=>{
            console.log('add collected')
          }).catch(err=>{
            console.log('add collected failed:' + err)
          })
        }
      }
    },
    async gotoAIGC(){
      let _this = this
      if(parseInt(this.$store.state.roleType) === 0){
        this.$router.push({
          name:'communityItemEdit',
          path: '/communityItemEdit',
          query:{
            mode: 'add',
            itemId: '',
          }
        }).catch(err=>err)
      }else{
        this.$message("请先登录管理员账号，才能进行内容编辑！")
        await setTimeout(function (){
          _this.$router.push("/communitylogin")
        }, 2000)
      }
    },
    modifyAIGC: function (){
      this.$router.push({
        name:'communityItemEdit',
        path: '/communityItemEdit',
        query:{
          mode: 'modify',
          itemId: this.item.id,
        }
      }).catch(err=>err)
    },

    // 评论区相关
    async sendReview(){
      if(!this.$store.state.loginName) {
        this.$router.push("/communitylogin")
      }
      let review = {
        contentID: this.itemId,
        userID: this.$store.state.userId,
        body: this.input,
        level: 1,
        toUid: null,
        parentId: null
      }
      await publishOneComment(review).then(res=>{
        this.input = ''
        this.getCommentInfo()
      }).catch(err=>{
        console.log('error'+err)
      })
    },
    closeAllReplies: function (){
      this.reviews.forEach((i)=>{
        i.beingReplied = false
      })
      this.replies.forEach((i)=>{
        i.forEach((j)=>{
          j.beingReplied = false
        })
      })
    },
    openReply: function(review){
      this.closeAllReplies()
      this.reviews.forEach((i)=>{
        i.beingReplied = review.id === i.id
        if(this.isLogin){
          if(i.beingReplied){
            this.placeholderReply = '回复 '+i.userName
          }
        }else{
          this.placeholderReply = '请先登录再发表评论~'
        }

      })
      this.replies.forEach((i)=>{
        i.forEach((j)=>{
          j.beingReplied = review.id === j.id
          if(this.isLogin){
            if(j.beingReplied){
              this.placeholderReply = '回复 '+j.userName
            }
          }else{
            this.placeholderReply = '请先登录再发表评论~'
          }
        })
      })
    },
    async sendReply(review){
      if(!this.$store.state.loginName) {
        this.$router.push("/communitylogin")
      }
      let reply = {
        contentID: this.itemId,
        userID: this.$store.state.userId,
        body: this.inputReply,
        level: review.level+1,
        toUid: review.userId,
        parentId: review.id
      }
      await publishOneComment(reply).then(res=>{
        console.log('publish review success'+res)
        this.inputReply = ''
        this.getCommentInfo()
      }).catch(err=>{
        console.log('error'+err)
      })
    },
    backToCommunity: function (){
      this.$router.go(-1);
    },
    changeTab:function (tab, event){
      if(this.isLogin){
        this.placeholder = '请发表你的评论: '
      }else{
        this.placeholder = '请先登录再发表评论~'
      }
      this.closeAllReplies()
    },
    gotoProposalDetail: function (index){
      this.$router.push("/communityProposalDetail")
    }
  }
}
</script>

<style scoped>
.btn-back{
  width: 80px;
  height: 80px;
  margin: 50px;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.6s cubic-bezier(0,0,0.2,1);
}
.btn-back:hover{
  width: 80px;
  height: 80px;
  margin: 50px;
  background-color: lightgrey;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.community-item-card{
  flex-direction: row;
  width: 76%;
  margin-top: 50px;
  margin-bottom: 50px;
  border-radius:  0.8rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.hint-text{
  font-size: 20px;
  color: grey;
}
.return-text{

}
.return-text:hover{
  cursor: pointer;
}
.north-west-image{
  margin: 10px;
  transition: all 0.6s cubic-bezier(0,0,0.2,1);
}
.north-west-image:hover{
  cursor: pointer;
  transform: translateX(-3%) translateY(-3%);
  border-color: var(--base-primary);
  box-shadow: 10px 20px 25px -5px var(--base-primary-shadow);
}
.north-east-image{
  margin: 10px;
  transition: all 0.6s cubic-bezier(0,0,0.2,1);
}
.north-east-image:hover{
  cursor: pointer;
  transform: translateX(3%) translateY(-3%);
  border-color: var(--base-primary);
  box-shadow: -10px 20px 25px -5px var(--base-primary-shadow);
}
.south-west-image{
  margin: 10px;
  transition: all 0.6s cubic-bezier(0,0,0.2,1);
}
.south-west-image:hover{
  cursor: pointer;
  transform: translateX(-3%) translateY(3%);
  border-color: var(--base-primary);
  box-shadow: 10px -20px 25px -5px var(--base-primary-shadow);
}
.south-east-image{
  margin: 10px;
  transition: all 0.6s cubic-bezier(0,0,0.2,1);
}
.south-east-image:hover{
  cursor: pointer;
  transform: translateX(3%) translateY(3%);
  border-color: var(--base-primary);
  box-shadow: -10px -20px 25px -5px var(--base-primary-shadow);
}
.community-item-name{
  font-weight: bold;
  font-size: 50px;
  color: black;
}
.community-item-description{
  font-size: 18px;
  color: grey;
}
.community-item-publishment{
  font-size: 15px;
  color: lightgrey;
  margin-right: 10px;
}
.community-item-tag{
  color: white;
  padding: 2px 10px;
  font-size: 15px;
  height: 25px;
  border-radius: 0.8rem;
  margin-right: 20px;
}
.community-item-prompt-card{
  width: 100%;
  height: 100px;
  overflow: hidden;
  background-color: rgba(135,206,250,0.2);
  transition: 0.8s;
}
.community-item-prompt-card:hover{
  height: auto;
}
.community-item-prompt-header{
  text-align: left;
  font-size: larger;
  font-weight: bolder;
}
.community-item-prompt-content{
  text-align: left;
  font-size: medium;
  overflow: hidden;
}
.community-item-icon{
  margin-right: 50px;
}
.community-item-icon.pointer:hover{
  cursor: pointer;
}
.type-area{
  width: 100%;
  justify-content: space-between;
}
.type-area-reply{
  width: 90%;
  margin-left: 10%;
  margin-top: 10px;
  justify-content: space-between;
}
.review-input-box{
  width: 70%;
}
.reply-input-box{
  width: 70%;
}
.review-area{
  height: 400px;
  margin-top: 10px;
  overflow: auto;
}
.empty-area{
  height: 300px;
  margin-top: 10px;
}
.empty-image{
  height: 300px;
  object-fit: contain;
}
.review-area::-webkit-scrollbar{
  width: 2px;
  height: 0;
  background-color: lightgrey;
}
.review-area::-webkit-scrollbar-thumb{
  border-radius: 0.5rem;
  background-color: darkgrey;
}
.community-item-review{
  width: 100%;
  margin-top: 10px;
}
.community-item-review-bottom{
  width: 100%;
  border-bottom-width: thin;
  border-bottom-style: solid;
  border-bottom-color: lightgrey;
}
.review-user{
  font-size: 20px;
  color: black;
  font-weight: bold;
}
.review-content{
  font-size: 15px;
  color: black;
}
.review-time{
  font-size: 15px;
  color: grey;
  margin-right: 20px;
}
.review-reply{
  font-size: 15px;
  color: grey;
  margin-right: 20px;
}
.review-reply:hover{
  cursor: pointer;
}
.proposal-area{
  height: 450px;
  margin-top: 10px;
  padding: 5px;
  overflow: auto;
}
.proposal-area::-webkit-scrollbar{
  width: 2px;
  height: 0;
  background-color: lightgrey;
}
.proposal-area::-webkit-scrollbar-thumb{
  border-radius: 0.5rem;
  background-color: darkgrey;
}
.community-proposal-card{
  width: 90%;
  margin-top: 20px;
  margin-left: 5%;
  justify-content: start;
  box-shadow: 2px 2px 0 0 rgb(0 0 0 / 0.1);
  transition: 0.6s;
}
.community-proposal-card:hover{
  cursor: pointer;
  transform: scale(1.1);
}
.community-proposal-cover{
  width: 120px;
  height: 120px;
  object-fit: contain;
}
.community-proposal-box{
  width: auto;
  margin-left: 5px;
}
.community-proposal-designer{

}
.community-proposal-caption{
  height: 70px;
  margin: 10px;
  overflow: hidden;
  text-align: left;
  font-size: 15px;
  font-style: italic;
}
.community-proposal-designer-name{
  margin: 5px;
}
</style>
