import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    navSelect: '/',
    selectType: null,
    // recommendation
    upper: [],
    bottom: [],
    bag: [],
    shoe: [],
    materialIds: [],
    materialUrls: [],
    price: 0,

    modify: false,
    collaborateInfo: {
      uid: -1, //用户id
      pid: -1, //项目id
      vid: -1, //版本id
      version: null, //版本具体内容
    },

    //below message is about user
    accessToken: null,
    roleType: null,
    phone: localStorage.getItem("phone"),
    userName: localStorage.getItem("userName"),
    adminPhone: null,
    adminUserName: null,

    // 社区登录的全局变量
    loginName: localStorage.getItem("loginName"),
    nickname: localStorage.getItem("nickname"),
    userId: localStorage.getItem("userId"),

    // about personal and share
    shareInnerId: -1, //share内页的id
    spaceUid: 0,  //进入他人个人空间的uid
    spaceName: null,

    //七牛云域名
    domain: "http://resource.voguexplorer.com/"
  },
  mutations: {
    increment(state, index) {
      console.log(index);
      state.navSelect = index.index
      state.count++
      console.log("stoke", state.count)
    },
    changeType(state, type) {
      console.log(type);
      state.selectType = type.type;
    },
    // recommendation
    changeSuitInfo(state, materialIds, price) {
      state.materialIds = materialIds;
      state.price = price;
      console.log("materialIds:", state.materialIds, "price:", state.price);
    },
    /**更新推荐选择框内容以及套装素材列表和价格 */
    changeRecInput(state, objects) {
      state.upper.length = 0;
      state.bottom.length = 0;
      state.bag.length = 0;
      state.shoe.length = 0;
      state.materialIds = [];
      state.materialUrls = [];
      state.price = 0;
      let idMap = new Map();
      for (let obj of objects) {
        state.materialIds.push(obj.id);
        state.materialUrls.push(obj.imgUrl);
        state.price += Number(obj.price);
        console.log("obj", obj);
        if (obj.recCategory == null) {
          console.log("obj does not have attribute 'recCategory'");
          continue;
        }
        if (obj.recCategory == 'invalid') {
          console.log("category Id: ", obj.categoryId);
          console.log("Category excluded in recCategories.");
          continue;
        }
        if (!idMap.has(obj.id)) {
          let inputCategory = obj.recCategory;
          let item = {
            category: inputCategory,
            id: obj.id,
            imgUrl: obj.imgUrl,
          };
          idMap.set(obj.id, true);
          state[inputCategory].push(item);
        }
      }
      console.log("upper: ", state.upper);
      console.log("bottom: ", state.bottom);
      console.log("bag: ", state.bag);
      console.log("shoe: ", state.shoe);
      console.log("materialIds:", state.materialIds);
      console.log("price:", state.price);

    },
    submitModify(state) {
      //假如某个obj属性进行了修改，那么修改该函数，editMain模块接受，并对相应的值进行修改后，将modify状态改为false
      console.log("modify")
      state.modify = !this.state.modify;
    },
    changeCollaborateInfo(state, payload) {
      if (payload.uid != null)
        state.collaborateInfo.uid = payload.uid;
      if (payload.pid != null)
        state.collaborateInfo.pid = payload.pid;
      if (payload.vid != null)
        state.collaborateInfo.vid = payload.vid;
      if (payload.version != null)
        state.collaborateInfo.version = payload.version;
      console.log("collaborateInfo change", state.collaborateInfo);
    },
    changeLogin(state, payload) {
      console.log(payload);
      state.phone = payload.phone;
      state.userName = payload.userName;
      if (state.phone != null) {
        localStorage.setItem("phone", state.phone);
        localStorage.setItem("userName", state.userName);
      } else {
        localStorage.removeItem("phone");
        localStorage.removeItem("userName ");
      }
      console.log("login", state.phone, state.userName)
    },
    changeCommunityLogin(state, payload) {
      state.loginName = payload.loginName
      state.nickname = payload.nickname
      state.userId = payload.userId
      state.roleType = payload.roleType
      if (state.loginName != null) {
        localStorage.setItem("loginName", state.loginName)
        localStorage.setItem("nickname", state.nickname)
        localStorage.setItem("userId", state.userId)
      }else {
        localStorage.removeItem("loginName")
        localStorage.removeItem("nickname")
        localStorage.removeItem("userId")
      }
    },
    changeAdminLogin(state, adminInfo) {
      console.log(adminInfo);
      state.adminPhone = adminInfo.adminPhone;
      state.adminUserName = adminInfo.adminUserName;
      console.log("login",state.phone,state.userName)
    },
    changeShareInnerId(state,playload){
      state.shareInnerId = playload
      console.log("changeShareInner",state.shareInnerId)
    },
    changePersonalSpace(state,payload){
      state.spaceUid = payload.phone;
      state.spaceName = payload.userName
      console.log("changeShareUid",state.spaceUid)
    }
  }
})

export default store
