# fashion-ai

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 页面

`recommendation.vue` -- 搭配推荐

`design.vue` -- 设计生成

`collaborate.vue` -- 协同设计

`virtualTryon.vue` -- 虚拟换装



```html
<template>
    <div id="recommendation">
        <!--以搭配推荐为例，在这个div中写自己的部分就可以了-->
        <p>recommendation</p>
    </div>
</template>
```



## 分支管理

* 在不同的分支中进行开发（以下分支已经创建完成）

  * recommendation
  * design
  * collaborate
  * virtualTryon

* 相关指令

  * 初始化

    ```
    git clone git@github.com:sunhySun/FashionAI.git
    ```



  * 将远程git仓库的指定分支拉取到本地

    ```
    git fetch
    git checkout -b <本地分支名> <主机名>/<远程分支名>
    ```

    或者可以直接pull(相当于fetch+merge)

    ```
    git pull <远程主机名> <远程分支名>:<本地分支名>
    ```



  * 将分支提交到仓库

    `git branch`: 查看当前所在分支

    `git checkout <分支名>` : 切换分支

    `git add . ` : 添加文件

    `git commit -m 'commit xxx'`： 提交信息

    `git push <远程主机名> <分支名>`: 将代码提交到指定分支上（本地分支名与远程分支名相同时）

  > https://www.runoob.com/git/git-branch.html

* 请不要在master和develop分支中提交代码

### 12.31更新

* 对axios进行了封装
    `src/api/http.js`: 实现对axios的封装
    `src/api/api.js`: 存放需要使用的接口
    * 示例-get请求

      ```js
      //api.js
      const address = 'http://localhost:8888/test'
      export const api = p => axios.get(address + "/hello",p)

      //需要使用axios的页面
      import {api} from '@/api/api'  //注意路径

      api({
        //可以以对象数组的形式填写需要的参数
      }).then(res => {
        //请求成功后需要执行的操作
      })
      ```

    * 示例-post请求

      注意：post请求的数据均为表单形式

       ```js
      //api.js
      const address = 'http://localhost:8888/test'
      export const api = p => axios.post(address + "/postName",p)

      //需要使用axios的页面
      import {api} from '@/api/api'  //注意路径

      var data= new FormData();
      data.append('pwd','hello'); //可以自己定义表单数据
      api(data).then(res =>{
        console.log(res);
      })
      ```
### nginx配置
* 配置文件位置

  `/usr/local/nginx/conf/nginx.conf`

* nginx 相关操作

  目录 `/usr/local/nginx/sbin`

  启动 `./nginx`

  关闭 `kill -9 进程号`

  停止 `./nginx -s stop`

  重启 `./nginx -s reload`

### 修改element源码

* 为了解决<el-menu>不随着router跳转的问题，使用了element仓库中最新的代码

  <el-menu> 添加了follow-router，手动开启路由跟随

  代码示例 `src/components/tab.vue`

  ```vue
  <el-menu :default-active="navselected"
               mode = "horizontal"
               router
              follow-router
      text-color="#969292"
      active-text-color="#409EFF">
  </el-menu>
  ```

  > element 仓库 https://github.com/ElemeFE/element
  >
  > pull request https://github.com/ElemeFE/element/pull/21770

  * 将修改的element源码加入项目
    * 创建一个新项目

    git clone https://github.com/ElemeFE/element.git
    * 编译，将编译得到的lib文件夹，更换项目中`node_modules/element-ui/lib`
    ```javascript
      //若npm版本过高，使用npm6进行编译
      //eg. npx -p npm@6 npm run dist --legacy-peer-deps
      npm run dev
      npm run dist
    ```

* 组件说明
  * <my-collect-dialog>
    显示设计结果和收藏设计的dialog

    示例

    ```vue
      <my-collect-dialog title = "生成结果" :visible.sync="resultVisible"  :collect-info="collect">
        <match-result v-loading="resultLoading"
              v-bind:tag-list = "result.labels" v-bind:name="result.matchType.name" v-bind:label="result.matchType.label"
              v-bind:url = "result.image" v-bind:result="result.result" v-if="result"></match-result>
      </my-collect-dialog>
    ```

    * title: dialog  的标题
    * visible： dialog是否可见
    * collect-info： 绑定一个方法，返回该生成结果收藏时的需要的信息（类型：对象）
      注意这里绑定方法使用“：”，因为这个方法直接传入子组件，在子组件内将信息传递给后端

    * workDescription 说明
      * MMC
      ```js
      {
        "category": "MMC",
        "workDescription": {
         //服装样式
         "image": "http://shoplook.voguexplorer.com/fashion/mmc-gan/jacket/9d4a6e9780184cbce7620e3d7c90bf64.jpg",
         //   生成单品类别
          "matchType": {
            "name": "Clothing Jeans",
            "label": "牛仔裤"
            },
      //生成单品属性
        "labels": [
         "白色",
         "Topshop"
      ],
      // 生成结果
        "result": "http://shoplook.voguexplorer.com/mmc_gan_1652963215038.png"
      }
      ```


