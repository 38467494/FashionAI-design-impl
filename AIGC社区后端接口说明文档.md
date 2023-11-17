## API返回统一模板格式：

{

  "resultCode": 200, 

  "message": "SUCCESS",

  "data": " xxx"

}

## 1 登录注册模块

| 接口路由 | 参数   | 结果 | 测试   |
| -------- | ------ | ---- | ------ |
|          | 单元格 |      | 单元格 |
|          | 单元格 |      | 单元格 |

路由：/user/login

功能：登录

方式：post

参数说明：{

 "loginName": "15220270605",

 "password": "e10adc3949ba59abbe56e057f20f883e" //mk5加密的

}

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": "25cea441e0b58dfa9de96f2578aa4835" //状态token

}



路由： /user/logout

功能：退出

方式：post

参数说明：{

  "id":1

}

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": **null**

}



路由： /user/register

功能：注册

方式：post

参数说明：{

 "loginName": "13111907200",

 "password": "123456"

}

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": **null**

}



路由： /qiniuyun/uploadToken

功能： 获取七牛云上传token

方式：get

参数说明：无

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": "68zEPGCEm6A55m0HCMjcKJJdUV-blLM6lkJ3Pqgm:AxaZQICBM9uOpLNqrw7PoqUKquI=:eyJkZWxldGVBZnRlckRheXMiOjEsInNjb3BlIjoiYXRzLWltYWdlIiwiZGVhZGxpbmUiOjE2OTYzMjY2ODV9" 

}



## 2 内容作品模块

### 2.1 作品上传与获取

路由: /content/upload

功能：内容上传

方式： post

参数说明：{

  "imageUrl1":"http://resource.voguexplorer.com/community/test00.jpg",

  "imageUrl2":"http://resource.voguexplorer.com/community/test10.jpg",

  "prompt":"hahah",

  "publisherId":1

}

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": "success"

}



路由： /content/getAll

功能：查询所有作品

方式： get

参数说明：无

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": [

​    {

​      "id": 11,

​      "publisher": 1,

​      "imageID": 92,

​      "publishTime": "2023-10-02T16:00:00.000+00:00",

​      "state": 0,

​      "prompt": "hahah",

​      "description": "",

​      "browsed": 0,

​      "liked": 0,

​      "collected": 0

​    },

​    {

​      "id": 12,

​      "publisher": 1,

​      "imageID": 102,

​      "publishTime": "2023-10-02T16:00:00.000+00:00",

​      "state": 0,

​      "prompt": "hahah",

​      "description": "",

​      "browsed": 0,

​      "liked": 0,

​      "collected": 0

​    }

  ]

}



路由：/content/getDetail

功能：获取单个内容信息

方式：post

参数说明：{

  "contentId":12

}

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": {

​    "id": 12,

​    "publisher": 1,

​    "imageID": 102,

​    "publishTime": "2023-10-02T16:00:00.000+00:00",

​    "state": 0,

​    "prompt": "hahah",

​    "description": "",

​    "browsed": 0,

​    "liked": 0,

​    "collected": 0

  }

}



### 2.2 图片有关接口

路由：/image/getOne?imageId=64

功能：得到某个图片信息

方式：get

参数说明：无

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": {

​    "id": 64,

​    "type": 1,

​    "url": "http://resource.voguexplorer.com/community/test10.jpg",

​    "subjectTo": 63

  }

}



路由：/image/getSon?imageId=94

功能：得到某个图片的子节点图片

方式：get

参数说明：无

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": [

​    {

​      "id": 95,

​      "type": 1,

​      "url": "http://resource.voguexplorer.com/059326ae-526a-4b3f-88dc-3828c7510efa",

​      "subjectTo": 94

​    },

​    {

​      "id": 96,

​      "type": 1,

​      "url": "http://resource.voguexplorer.com/ed1c3b86-70d8-485c-8204-c233b4fd0734",

​      "subjectTo": 94

​    },

​    {

​      "id": 97,

​      "type": 1,

​      "url": "http://resource.voguexplorer.com/7330e648-864f-4475-b783-f93132bb00f4",

​      "subjectTo": 94

​    },

​    {

​      "id": 98,

​      "type": 1,

​      "url": "http://resource.voguexplorer.com/52a78be3-746a-41d6-b39e-05c9b0f1a0ce",

​      "subjectTo": 94

​    }

  ]

}



### 2.3 评论有关接口

路由：/comment/publish

功能:发布评论

方式：post

参数说明：{

  "contentID":8,

  "userID":3,

  "body":"用户3对用户2评论的回复",

  "level":3,

  "toUid":2,

  "parentId":11

}

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": **null**

}



路由：/comment/getByContent?id=8

功能：获取某个内容的所有评论

方式：get

参数说明：无

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": [

​    {

​      "id": 10,

​      "author": {

​        "username": "15220270605",

​        "avatar": ""

​      },

​      "body": "用户1对于内容8的第一层评论",

​      "childrens": [

​      递归结构

​      ],

​      "replyTime": **null**,

​      "level": 1,

​      "toUser": **null**,

​      "parentId": 0

​    }

  ]

}



### 2.4 点赞收藏

路由：/content/liked?userId=1&contentId=12

功能：点赞

方式：get

参数说明:无

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": **null**

}



路由：/content/collected?userId=1&contentId=12

功能：收藏

方式：get

参数说明:无

返回结果：{

  "resultCode": 200,

  "message": "SUCCESS",

  "data": **null**

}





