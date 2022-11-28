``` js
素材图片表
id int
img_url varchar(255)
status int 
//0删除，1正常
description varchar(255)
category varchar(255)
项目表
id int
name varchar(255)
description varchar(255)
principle_id int/long 
//负责人id
项目成员表
//也包括负责人
id int
pid int //项目表id
member_id int //成员的uid
项目版本表 //就那个树状结构的每一个节点
id int
pid int //项目的id
canvas //画布保存信息的一系列字段
parent_version int//树状节点的每一个父节点，用于构造版本树
create_time TimeStamp
update_time TimeStamp
评论表
//评论和d
id int
vid int//项目版本id对某个项目版本的评论
content varchar(255)
status //0删除，1 点赞 2 踩 3 无
create_time timeStamp
uid int  //评论的用户的id
邀请表
id int
pid int
member_id int //被邀请人的uid
status //通过，拒绝，未审阅
create_time timeStamp
update_time timeStamp
```