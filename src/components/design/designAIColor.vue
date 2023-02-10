<template>
  <div>
    <div class="flex divide-x">
      <section class="basis-9/12 px-8 py-4">
        <!--        <h4>服装式样</h4>-->
        <el-tabs v-model="activeName" style="width: 100%">
          <template v-for="(item,index) in tabList">
            <el-tab-pane :key="index" :label="item.label" :name="item.name">
              <image-show
                v-bind:name="item.name"
                v-bind:module="moduleType"
                v-bind:urls="landscapeUrls"
                v-bind:index="index"
                v-if="aicolorReady"
                @selectCloth="selectCloth(arguments)">
              </image-show>
            </el-tab-pane>
          </template>
        </el-tabs>
      </section>

      <section class="basis-3/12 p-4 flex flex-col items-stretch" >
<!--        <div class="text-left font-bold text-black">颜色抽取</div>-->
        <div class="my-4">
          <div class="upload-div w-full">
            <el-upload
              class="avatar-uploader w-full h-auto"
              ref="upload"
              action="http://upload-z2.qiniup.com"
              accept="image"
              :data="uploadData"
              :auto-upload = "false"
              :multiple="false"
              :on-change = "handleChange"
              :on-remove = "handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :on-Error="handleError"
              :file-list="fileList"
              :limit = "1"
              :on-exceed="handleExceed"
            >
              <el-image v-if="imageUrl" :src="imageUrl" class="avatar" fit="contain">
              </el-image>
              <div v-else
                   class="uploader-tips mx-auto flex flex-col items-center justify-center text-center"
              >
                <i class="uploader-tips-txt bi bi-plus-circle "></i>
                <p class="uploader-tips-txt">抽取图片颜色合成衣服</p>
              </div>


            </el-upload>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="flex">
          <section class="basis-1/2">
            <div class="text-left font-bold text-black">世界风景图</div>
          </section>
          <section class="basis-1/2 flex justify-end">
            <el-link style="color:blue" @click="moreLandscapeImages">更多>></el-link>
          </section>
        </div>

<!--        todo 推荐小图，4张-->
        <div>
        </div>

        <div>
          <AtsButton expand type="primary" @click="handleUpload">颜色抽取</AtsButton>
        </div>

      </section>
    </div>

    <div>
      <my-collect-dialog title="AI着色结果" :visible.sync ="dialogVisible" :collect-info="collect">
        <aicolor-result v-bind:sketch="resultSketch" v-bind:color="resultColor" v-bind:result="aicolorResult"
                       v-loading="resultLoading"  v-bind:uploadToken="uploadData.token" v-bind:dialogVisible="dialogVisible" ref="aicolorResult"></aicolor-result>
      </my-collect-dialog>
      <!--      <el-dialog title="渲染生成结果" :visible.sync="dialogVisible" width="70%" style="min-width: 840px">-->
      <!--        <render-result v-bind:sketch="resultSketch" v-bind:color="resultColor" v-bind:result="renderResult"-->
      <!--        v-loading="resultLoading"  v-bind:uploadToken="uploadData.token"></render-result>-->
      <!--      </el-dialog>-->
    </div>
    <div>
      <el-dialog :visible.sync="landscapeVisible" width="55%"
                 style="min-width: 840px;">
        <template #title>
          <div class="text-left font-bold text-2xl px-5 py-2">世界风景图</div>
        </template>
        <slot></slot>
        <template>
          <div class="flex divide-x px-6">
            <section class="basis-1/3">
              <el-collapse
                v-model="activeRegion"
                v-for="(ritem, rindex) in regioncityList"
                :key="rindex"
              >
                <el-collapse-item :title="ritem.region" :name="ritem.region">
                  <el-radio-group
                    v-model="activeCity"
                    style="display: flex; flex-flow: column; align-items: flex-start;"
                    size="mini"
                    v-for="(citem, cindex) in ritem.cities"
                    :key="cindex"
                    text-color="#1A9CFD"
                    fill="#E6F7FF"
                    @change="selectLandscapeImages(ritem.region,citem)"
                  >
                    <el-radio-button :label="citem">
                    </el-radio-button>
                  </el-radio-group>
                </el-collapse-item>
              </el-collapse>
            </section>
            <section class="basis-2/3">
              <div style="width: 50%">
                <el-input
                  placeholder="请输入你想选择的风景地名称"
                  v-model="searchLandscape">
                  <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </div>
<!--             todo：参考imageshow组件 显示风景图-->
              <div>
                <template v-for="(item,index) in selectedImages">
                  <div :key="index">
                    <landscape-image-show
                      v-bind:name="item.name"
                      v-bind:module="moduleType"
                      v-bind:urls="landscapeUrls"
                      v-bind:index="index"
                      v-if="landscapeReady"
                      @selectCloth="selectLandscapeImage(arguments)">
                    </landscape-image-show>
                  </div>
                </template>
              </div>
            </section>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ImageShow from "./ImageShow";
import landscpaeImageShow from "./landscapeImageShow.vue";
import AIColorResult from "./aicolorResult.vue";
import {AIColor} from "../../api/design";
import * as qiniu from "qiniu-js";
import {getUploadToken} from "../../api/design";
import {initAIColor} from "../../api/design";
import {showError} from "./alert";
import MyCollectDialog from "../my-collect-dialog";
import {getCoverImg, getImg} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";
import AicolorResult from "./aicolorResult.vue";
import NavTemplate from "../collaborate/nav/navTemplate.vue";
import LandscapeImageShow from "./landscapeImageShow.vue";
export default {
  name: "designAIColor",
  components: {LandscapeImageShow, NavTemplate, AicolorResult, MyCollectDialog, AIColorResult, ImageShow, AtsButton},
  data() {
    return {
      moduleType:"aicolor",
      isCollapse: true,
      hasSubmit: false,
      activeName: "Tops",

      tabList: [
        {
          label: "上衣",
          name: "Tops"
        },
        {
          label: "下装",
          name: "Bottoms"
        },
        {
          label: "全身",
          name: "Wholes"
        },
      ],
      fileNames:[],
      urls:[
        [],[],[]
      ],
      aicolorReady:false,  //记录图片是否加载完成

      fileList:[],
      imageUrl :null, //图片在七牛云上的url，通过这个url可以直接访问到图片
      imageKey:null,  //图片上传到七牛云上，返回的key
      uploadData: {
        token:"",
        key:""
      },

      //图像相关

      dialogVisible: false,
      resultLoading: false,
      resultSketch: null,
      resultColor:null,
      aicolorResult: null,


      //世界风景图相关
      landscapeVisible:false,
      regioncityList:[
        {
          region:'热门图片',
          icon:'house-heart',
          cities:['米兰大教堂','故宫博物馆','梵蒂冈博物馆'],
        },
        {
          region:'北美洲',
          icon:'globe-americas',
          cities:['Hartsville','Kapalua West Maui Airport','丹佛','亚特兰大','克利夫兰','凤凰城','劳德代尔堡','华盛顿','卡波圣卢卡斯','卡胡库','图卢姆','图萨扬','圣何塞德尔卡沃','圣克鲁斯华特库','圣地亚哥','圣奥古斯丁','圣安东尼奥','圣巴巴拉','圣米格尔-德阿连德','坎昆','坦帕','埃斯孔迪多港','基西米','基韦斯特','塞多纳','墨西哥城','夏洛特','多伦多','奥兰多','安克雷奇','尼亚加拉瀑布','巴亚尔塔港','巴尔的摩','布兰森','弗拉格斯塔夫','彭萨科拉','惠斯勒','拉斯维加斯','斯科茨','新奥尔良','旧金山','普拉亚卡门','杰克逊','梅里达','檀香山','波士顿','波特兰','洛杉矶','渥太华','温哥华','瓜达拉哈拉','瓦哈卡市','科苏梅尔','索诺玛','纳什维尔','纽约','维多利亚','芝加哥','萨凡纳','萨拉索塔','蒙特利尔','西沃德','西雅图','费城','费尔班克斯','路易斯威尔','辛辛那提','达拉斯','迈阿密','那不勒斯','里士满','锡瓦塔塔内霍','阿卡普尔科','韦拉克鲁斯','马萨特兰','魁北克市'],
        },
        {
          region:'大洋洲',
          icon:'globe-asia-australia',
          cities:['Emu Plains','Hope Valley','Island Beach','Weeaproinah','凯恩斯','努萨角','埃尔利海滩','墨尔本','奥克兰','巴瑟尔顿','布里斯班','布鲁姆','弗里曼特','悉尼','惠灵顿','拜伦湾','朗塞斯顿','玛格丽特河','珀斯','皇后镇','纽卡斯尔','艾尔斯岩','达尔文','道格拉斯港','阿卡罗阿','阿德莱德','霍巴特','黄金海岸'],
        },
        {
          region:'非洲',
          icon:'globe-europe-africa',
          cities:['Bird Island','Marsa Alam','Midlands','丹吉尔','亚历山大','内罗毕','卡萨布兰卡','卢克索','开普敦','开罗','德班','托舵道斯','拉巴特','桑给巴尔','梅尔祖卡','沙姆沙伊赫','索维拉','约翰内斯堡','舍夫沙万','莫希','蒙巴萨','赫尔格达','达哈布','达累斯萨拉姆','迪亚尼海滩','阿克拉','阿加迪尔','阿斯旺','阿鲁沙','非斯','马拉喀什'],
        },
        {
          region:'加勒比',
          icon:'tsunami',
          cities:['Boca Pen','Stepney','尼格瑞尔','拉纳韦贝','拿骚','欧丘里欧','蒙特哥贝','蓬塔卡纳','金斯敦'],
        },
        {
          region:'南美洲',
          icon:'globe-americas',
          cities:['利马','卡塔赫纳','圣保罗','圣地亚哥','库斯科','波哥大','蒙得维的亚','里约热内卢','麦德林'],
        },
        {
          region:'欧洲',
          icon:'globe-europe-africa',
          cities:['Albufeira','Ballinaboy','Chania International Airport','Episkopi (Heraklion)','Feteira','Girona','Sol de Mallorca','丰沙尔','乌得勒支','于韦斯屈莱','伊斯坦布尔','伊维萨镇','伦敦','伦敦德里','伯尔尼','伯明翰','佛罗伦萨','佩鲁贾','克卢日-纳波卡','克拉科夫','克莱佩达','兰斯','兰迪德诺','利兹','利沃夫','利物浦','剑桥','加尔达','加的斯','华沙','卑尔根','南安普敦','南特','博尔扎诺','博德鲁姆','博洛尼亚','博维茨','卡利亚里','卡塔尼亚','卡拉马塔','卡斯卡伊斯','卡普里','卡迪夫','卢加诺','卢卡','卢塞恩','卢布尔雅那','卢森堡','吕贝克','哥德堡','哥本哈根','因弗内斯','因斯布鲁克','因特拉肯','图卢兹','图尔','圣克鲁斯-德拉帕尔马','圣吉米纳诺','圣地亚哥－德孔波斯特拉','圣塞瓦斯蒂安','圣罗克','坦佩雷','埃文河畔斯特拉特福','基希讷乌','基拉尼','塔拉戈纳','塔林','塞维利亚','塞萨洛尼基','墨西拿','大加那利岛拉斯帕尔马斯','奥斯图尼','奥斯陆','奥维多','奥胡斯','奥赫里德','威尼斯','安坡里奥圣托里尼','安塔利亚','安特卫普','安道尔城','尼斯','巴勒莫','巴塞尔','巴塞罗那','巴斯','巴里','巴黎','布加勒斯特','布拉加','布拉格','布拉索夫','布拉迪斯拉发','布莱德','布莱顿霍夫','布达佩斯','布里斯托','布鲁塞尔','布鲁日','帕尔马','帕福斯','库萨达斯','庞贝','康斯坦察','弗罗茨瓦夫','弗莱堡','德累斯顿','慕尼黑','戈尔韦','戛纳','扎达尔','托伦','托莱多','拉戈斯','拉文纳','拉罗谢尔','摩德纳','敖德萨','斯图加特','斯培西亚','斯塔万格','斯德哥尔摩','斯普利特','斯特拉斯堡','斯特雷萨','斯科普里','施韦青根','日内瓦','普拉','普罗塔拉斯','普罗夫迪夫','普罗旺斯艾克斯','曼彻斯特','杜塞尔多夫','杜布罗夫尼克','柏林','根特','格但斯克','格拉斯哥','格拉纳达','格拉茨','格雷梅','桑坦德','梅利哈','比萨','毕尔巴鄂','汉堡','汉诺威','法鲁','波兹南','波尔图','波尔多','波尔托罗','波尔蒂芒','波德戈里察','波恩','波茨坦','波里斯-德阿沃纳','波雷奇','泰恩河畔纽卡斯尔','洛桑','海德堡','海牙','温德米尔','潘普洛纳','热那亚','爱丁堡','牛津','特罗姆瑟','瓦伦西亚','瓦尔纳','的里雅斯特','科佩尔','科克','科孚镇','科尔丘拉','科尔多瓦','科尔马','科托尔','科英布拉','科莫','科隆','第比利斯','米克诺斯城','米兰','索伦托','索非亚','约克','纳萨雷特','纽伦堡','维也纳','维克','维尔纽斯','维罗纳','罗希姆诺','罗德镇','罗斯托克','罗瓦涅米','罗维尼','罗马','美因河畔法兰克福','苏黎世','莫斯塔尔','莱切','莱比锡','莱科','萨尔茨堡','萨拉戈萨','萨拉热窝','萨格勒布','萨莱诺','蒂米什瓦拉','蒙彼利埃','蒙特卡罗','蒙特普齐亚诺','蒙特罗索阿尔马雷','蓬塔德尔加达','诺维格勒伊斯特拉','贝加莫','贝坦库里亚','贝尔法斯特','贝尼多姆','费特希耶','赫尔辛基','赫瓦尔','赫罗纳','辛特拉','那不勒斯','都柏林','都灵','里加','里斯本','里昂','锡德','锡拉库扎','锡比乌','锡耶纳','阿伯丁','阿依纳帕','阿克雷里','阿利坎特','阿姆斯特丹','阿威罗','阿拉尼亚','阿玛考德佩拉','阿维尼翁','阿西西','阿雷佐','陶尔米纳','雅典','雷克雅未克','马尔马里斯','马尔默','马德里','马拉加','马泰拉','马贝拉','马赛','鹿特丹'],
        },
        {
          region:'亚洲',
          icon:'globe-asia-australia',
          cities:['Balian','Cala an','Penaga','万隆','东京','乌布','京都','会安','公主港','兰卡威','加尔各答','努沃勒埃利耶','努沙杜瓦','北京','古晋','吉隆坡','名古屋','哥打京那巴鲁','塞米亚克','大阪','宿务','尼甘布','岘港','库塔','康提','新加坡','新山','日惹','普吉镇','暹粒','曼谷','本托塔','果阿旧城','河内','清迈','琅勃拉邦','瑶亚岛','瓦拉纳西','甲米镇','科伦坡','科隆','胡志明市','芭堤雅市中心','芽庄','苏梅岛','萨萨克','金巴兰','金边','釜山','锡吉里亚','阿努拉德普勒','阿拉木图','阿格拉','雅加达','雅拉','顺化','首尔','香港','马六甲','马尼拉','马德望','高尔'],
        },
        {
          region:'中东',
          icon:'globe-central-south-asia',
          cities:['亚喀巴','利雅德','埃拉特','塞拉莱','多哈','安曼','拉斯阿尔卡麦','特拉维夫','耶路撒冷','贝鲁特','迪拜','阿布扎比','马斯喀特'],
        },
        {
          region:'中美洲',
          icon:'globe-americas',
          cities:['巴拿马城'],
        },
      ],
      categoryList:[
        {
          label:'活动',
          name:'activities',
        },
        {
          label:'旅游胜地',
          name:'attractions',
        },
        {
          label:'地标建筑',
          name:'landmarks',
        },
        {
          label:'博物馆',
          name:'museums',
        },
        {
          label:'旅途风光',
          name:'tours',
        },
        {
          label:'其他',//此处命名为“其他”实属无奈，该类别数据不知道该如何定义
          name:'transfers-services',
        },
      ],
      // 数据包含三级目录：地区/城市/类别，外加图片的url和名字
      // 不过目前先展示地区-城市两级目录
      // 折叠面板组件不支持插入icon
      landscapeImages:[
        {
          region:'热门图片',
          city:'故宫博物馆',
          category:'activities',
          name:'测试图片',
          url:'http://euphonium.cn/develop_team/zcx.png',
        },
        {
          region:'热门图片',
          city:'故宫博物馆',
          category:'activities',
          name:'测试图片',
          url:'http://euphonium.cn/develop_team/dml.jpg',
        },
        {
          region:'热门图片',
          city:'米兰大教堂',
          category:'activities',
          name:'测试图片',
          url:'http://euphonium.cn/develop_team/dml.jpg',
        },
      ],
      selectedImages:[],
      //导航折叠面板
      activeRegion:['热门图片'],
      activeCity:'',
      searchLandscape:'',
      // 为了匹配imageshow组件，需要将url单独抽出来
      landscapeUrls:[],
      landscapeReady:false,

    };
  },
  mounted:function() {
    //生成七牛云上传凭证
    let _this=this;
    getUploadToken({
      forever: false
    }).then(res=>{
      console.log("getUploadToken:",res.data);
      _this.uploadData.token = res.data;
    })
    this.getFiles();
  },

  methods: {
    //获取数据库中图像数据
    getFiles: function(){
      let _this = this;
      this.urls = [];
      this.fileNames = [];
      var nameList=["topList","bottomList","wholeList"];
      initAIColor().then(res => {
        console.log("init aicolor",res.data);
        var files = res.data.data;
        for(var i=0;i<nameList.length;i++){
          var list = files[nameList[i]];
          var arr = [];
          for(var j=0;j<list.length;j++){
            var name = this.$store.state.domain  + list[j];
            arr.push(name);
          }
          _this.urls.push(arr);
          _this.fileNames.push(list);
        }
        console.log(_this.urls,_this.fileNames);

        //todo 接收世界风景图数据

        _this.aicolorReady = true;
      });


    },
    //某个tab中某张图片被选中，触发该函数，需要修改元素的className和保存id
    selectCloth: function(msg){
      var dom = msg[0];
      var index = msg[1];
      var type = msg[2];
      console.log("select aicolor",msg);


      var typeIndex = this.getType(type);
      this.selectClothId = this.urls[typeIndex][index];
      this.selectClothType = type;

    },

    getType:function(name){
      var list = this.tabList;
      for(var i=0;i<list.length;i++){
        if(name == list[i].name)
          return i;
      }
      return -1;
    },

    handleChange: function (file,fileList){
      console.log("change",file,fileList);
      if(!this.beforeUpload(file.raw))
        return ;

      var This = this;
      //this.imageUrl = URL.createObjectURL(file.raw);
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e){
        // this.result // 这个就是base64编码了
        This.imageUrl = this.result;
      }
    },

    handleRemove:function (file){
      console.log('remove',file);
      this.imageUrl = '';
      this.imageKey = null;
    },

    handleExceed: function (files,fileList){
      console.log("exceed");
      this.$message.warning('只能上传一张图片！如需要更换，请先删除原图片');
    },

    beforeUpload: function (file){
      const isJPG = (file.type === "image/jpeg") || (file.type === "image/png");
      console.log("beforeUpload",isJPG)
      if(!isJPG){
        this.$message.error('上传图片只能为JPG或PNG格式');
        this.fileList = [];
        return false;
      }

      this.uploadData.key=this.getName(file.name);
      return true;
    },
    //设置上传文件的文件名
    getName: function (name){
      var timestamp = Date.parse(new Date());
      var newName = "aicolor_" + timestamp + name;
      console.log("newName",newName);
      return newName;
    },

    handleSuccess(res,file) {
      console.log("success:",res,file)
      this.imageUrl =this.$store.state.domain  + res.key;
      this.imageKey = res.key;
      //2. 将信息传提给后端
      this.submit();
    },
    handleError(res){
      console.log("Error:",res );
    },

    handleUpload:function (){
      // 为了测试
      this.selectClothId = 'http://resource.voguexplorer.com/20211018_1634548580000_MDA4NTE2NTcwMF8zXzFfMS5wbmc%3D.png';
      this.imageUrl = 'http://resource.voguexplorer.com/20211018_1634548580000_MDA4NTE2NTcwMF8zXzFfMS5wbmc%3D.png';
      this.imageKey = '20211018_1634548580000_MDA4NTE2NTcwMF8zXzFfMS5wbmc%3D.png';

      var cloth = this.selectClothId;


      var color = this.imageUrl;

      if(cloth == null){
        this.$message.error("请选择你想要的服装！");
        return;
      }
      if(color == ''){
        this.$message.error("请上传颜色抽取图像！");
        return;
      }

      //1. 将图片上传到七牛云
      if(this.imageKey==null)
        this.$refs.upload.submit();
      else
        this.submit();
    },

    submit: function (){
      //上传两张图片并返回结果
      var sketch = this.selectClothId.slice(33);
      var color= this.imageKey;
      let _this=this;
      _this.resultSketch = _this.selectClothId;
      _this.resultColor = _this.imageUrl
      _this.aicolorResult = null

      this.resultLoading = true;
      this.dialogVisible = true;

      AIColor({
        originFileName: sketch,
        colorFileName: color,
        // colorPosition:着色部位, colorType:抽取颜色/纹理，目前支持颜色
        colorPosition: 0,
        colorType: 0,
      }).then(res=>{
        console.log('AI着色成功!');
        console.log(res.data);


        _this.aicolorResult = res.data.data.fileUrl

        _this.resultLoading = false;
        // this.$refs.renderResult.getData(sketch,color,res.data.data);

        // console.log(color);
      }).catch(res=>{
        console.log("error",res);
        _this.dialogVisible=false;
        showError(_this,res);

      })

    },

    collect:async function (){
      var res =await this.$refs.aicolorResult.collect()
      console.log("design AIColor",res)
      return res
    },



    //上传后端待处理

    //按钮行为

    sure() {
      this.hasSubmit = false;
    },

    //更多风景图
    moreLandscapeImages: function(){
      console.log('test');
      this.activeRegion.length = 0;
      this.activeRegion.push('热门图片');
      this.landscapeVisible = true;
    },
    selectLandscapeImages: function (region, city){
      // console.log(region);
      // console.log(city);
      // console.log(this.activeRegion);
      // console.log(this.activeCity);
      console.log(this.aicolorReady);
      this.landscapeReady = true;
      this.selectedImages.length = 0;
      this.landscapeUrls.length = 0;
      this.landscapeImages.forEach((i)=>{
        if(i.city === city && i.region === region){
          this.selectedImages.push(i);
          this.landscapeUrls.push(i.url);
        }
      })
    },
    selectLandscapeImage: function (msg){
      console.log('msg0:'+msg[0]); // dom节点 没啥用
      console.log('msg1:'+msg[1]); // 图片id
      console.log('msg2:'+msg[2]); // 图片名字
      this.imageUrl = this.landscapeUrls[msg[1]];
      this.landscapeVisible = false;
    }

  },

}
</script>

<style>
.show-card {
  margin-right: 1.5rem; /* 24px */
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-width: 1px;
  border-radius:  0.5rem; /* 8px */;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all .2s ease-out;
}
.show-card:hover {
  cursor: pointer;
  border-width: 2px;
  border-color: var(--base-primary);
  border-radius:  0.5rem; /* 8px */;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.show-card.img-div-selected {
  border-width: 2px;
  border-color: var(--base-primary);
  border-radius:  0.5rem; /* 8px */;
  background-color: var(--base-primary-opac);
  box-shadow: 0 20px 25px -5px var(--base-primary-shadow), 0 8px 10px -6px var(--base-primary-shadow);
}
</style>
