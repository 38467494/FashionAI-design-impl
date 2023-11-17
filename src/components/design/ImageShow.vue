<template>
    <div class="min-h-screen relative my-2">
<!--      <el-scrollbar :style="height" wrap-style="overflow-x:hidden;">-->
        <template v-for="(item,index) in pageItem">
          <el-row type="flex" :key="index">
            <template v-for="(subitem,subindex) in item">
              <el-col :span="width" :key="subindex">
                <div class="show-card"  @click="select($event,subitem, index*4+subindex)" :class="getClass(index*4+subindex)"
                     v-if="module==='vton'">
                  <el-image :src="subitem.url" v-if="subitem" fit="fill"></el-image>
                  <div class="text-left py-2 px-4">
                    <div class="mb-2 text-black font-bold" v-if="isDescriptionVisible">{{subitem.description}}</div>
                    <div v-if="isPriceVisible">
                      <i class="bi bi-currency-yen"></i>
                      {{subitem.price}}元
                    </div>
                  </div>
                </div>

                <div class="show-card" style="padding: 10px;" @click="select($event,subitem,index*4+subindex)" :class="getClass(index*4+subindex)" v-else>
                  <el-image :src="subitem" v-if="subitem" fit="fill"></el-image>
                </div>

              </el-col>
            </template>
          </el-row>
        </template>
<!--      </el-scrollbar>-->

      <!-- 分页组件使用position:absolute相对于父组件进行绝对定位，使用transform保证位置居中 -->
      <el-pagination
        layout="prev, pager, next"
        :total="total" :page-size = "pageSize" @current-change="changePage" v-if="total>0">
      </el-pagination>
      <p style="color: #8c939d" v-else>暂无数据</p>
    </div>
</template>

<script>
export default {
    name:"ImageShow",
    props:{
        name:{
            type: String,
            default: null
        },
        module:{
          type: String,
          default: null,
        },
      urls:{
          type: Array,
        default:[]
      },
      index:{
          type:Number,
        default:-1,
      },
      height:{
          type:String,
        default:"height: 500px;"
      },
      isDescriptionVisible: {
        type: Boolean,
        default: false,
      },
      isPriceVisible: {
        type: Boolean,
        default: false,
      },
      // description:{
      //   type: Array,
      //   default:[]
      // },
      // price:{
      //   type: Array,
      //   default:[]
      // },
    },
    mounted: function(){
      // this.getFiles();
        //接收从前端传递来的name（衣服种类）,module:调用的模块（对应与哪个模型）
        console.log(this.name);
        console.log(this.module);

        console.log(this.urls)
        //这里需要添加一个接口，向后端请求对应衣服种类的图片
        //获取后可以使用divide函数将数组划分并显示

      console.log(this.height);

      this.width = 24 / this.cols

      this.total = this.urls.length
      this.pageSize = this.rows * this.cols


      this.divide(this.urls,this.rows,this.cols);

      this.changePage(1)

    },
    data: function(){
        return {
            // urls: [],
            divided_URLs:[],

            width: 6,
            selected: null,  //存放被选中的dom元素，用于样式的修改
            fileNames: [],
            rows:3,
            cols:4,
            pageItem:[],
            total:0,
            pageSize:0,
            page: 1,
            isActive:"img-div-selected",

        }
    },
    // watch:{
    //   urls:{
    //     handler(newValue,oldValue){
    //
    //       this.load();
    //     },
    //     deep:true,
    //     immediate:false,
    //   }
    // },
    watch:{
      urls:{
        handler(newValue,oldValue){
          this.load();
        },
        deep:true,
        immediate:false,
      }
    },
    methods:{

        load: function (){
          // this.getFiles();
          //接收从前端传递来的name（衣服种类）,module:调用的模块（对应与哪个模型）
          console.log(this.name);
          console.log(this.module);

          console.log(this.urls)
          //这里需要添加一个接口，向后端请求对应衣服种类的图片
          //获取后可以使用divide函数将数组划分并显示

          console.log(this.height);

          this.width = 24 / this.cols

          this.total = this.urls.length
          this.pageSize = this.rows * this.cols


          this.divide(this.urls,this.rows,this.cols);

          this.changePage(1)
        },

        select:function (e,url,index){
          if(url == '/static/transparent.png')
            return;

          index = (this.page -1 )*this.pageSize + index
          this.selected = index;

          // console.log("select",index)

            //match
          if(this.module == "match")
            this.$emit('selectCloth',e.currentTarget,this.index,index,this.name);
          else if(this.module == "recommendation"){
            console.log("recommendation",this.name)
            this.$emit('selectCloth',e.currentTarget,index,this.name,);
          }
          else if(this.module == "render"){
            this.$emit("selectCloth",e.currentTarget,index,this.name);
          }
          else if(this.module == "vton"){
            this.$emit("selectCloth",e.currentTarget,index,this.name);
          }
          else if(this.module == "aicolor"){
            this.$emit("selectCloth",e.currentTarget,index,this.name);
          }
          else if(this.module == "inspire"){
            this.$emit("selectCloth",e.currentTarget,index,this.name);
          }


        },

        //根据给定的列数col将数组进行划分，用于显示
        divide:function(arr,row,col){
            var divideArr = [];
             for(var i=0;i<arr.length;i+=row*col){
                 //分页
                var page=[]
                for(var j=0;j<row*col && i+j<arr.length;j+=col){
                  var rowArr=[]
                  for(var k=0; k <col && i+j+ k< arr.length;k++){
                    rowArr.push(arr[i+j+k]);
                  }
                  page.push(rowArr)
                }
                divideArr.push(page)
             }
             //多页时，保证显示部分高度相同
             if(divideArr.length > 1){
               var last = divideArr.length-1;
               var page = divideArr[last];
               var img = '/static/transparent.png';
               //将上一行补齐
               if(page[page.length-1].length < col){
                 for(var i=page[page.length-1].length;i<col;i++){
                   page[page.length-1].push(img);
                 }
               }
               var rowArr=[]
               for(var i=0;i<col;i++)
                 rowArr.push(img);
               for(var i=page.length;i<row;i++){
                 page.push(rowArr)
               }
               divideArr[last]=page;
             }

             this.divided_URLs = divideArr;

             console.log("divideurl",this.divided_URLs)
        },
      changePage:function (page){
          // console.log("change page",page,this.page)
          this.page = page
          this.pageItem = this.divided_URLs[page-1];
        // console.log("change page",page,this.page)
      },
      getClass: function (index){
        console.log("getClass",index, this.selected)
        index = (this.page -1 )*this.pageSize + index
        if(index == this.selected)
          return "img-div-selected";
        else
          return "img-div";
      }


    }
}
</script>

<style scoped>
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
