<template>
    <div>
        <el-row type="flex">
            <el-col :span="20">
                <h2 style="text-align: left">评论区</h2>
            </el-col>
            <el-col :span="4" style="display: flex;">
                <el-link type="pimary" >更多</el-link>
            </el-col>
        </el-row>
        
        <template v-for="(item,index) in infoArr">
            <div :key=index class="comment-div">
                <el-row type="flex">
                    <el-col :span="4">
                        <el-image :src="item.head" fit="fill"></el-image>
                    </el-col>

                    <el-col :span="12" >
                        <p class="username">
                            {{item.username}}
                        </p>
                    </el-col>

                    <el-col :span="8">
                        <p class="time">
                            {{item.time}}
                        </p>
                    </el-col>

                </el-row>

                <div>
                    <p>
                        {{item.text}}
                    </p>

                    <template v-if="item.judge == 1 " >
                        <div>
                            <p class="time" >
                            该用户觉得很赞
                        </p>
                        </div>
                        
                    </template>
                        
                    <template v-if="item.judge == 0 ">
                        <p  class="time">
                            该用户不喜欢
                        </p>
                    </template>
                </div>

                <el-divider></el-divider>
                
                     
               

            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: "comment",
    data: function(){
        return {
            infoArr: [
                {
                    head: '/static/pic/head.png',
                    username: "Jack",
                    time:"2021/12/31",
                    text: "设计的不错",
                    judge: 1
                },
                {
                    head: '/static/pic/head.png',
                    username: "Mary",
                    time:"2021/12/31",
                    text: "我不喜欢这个设计",
                    judge: 0
                },
            ]
        }
    },
    methods:{
        
    }
}
</script>

<style>
    .comment-div{
        text-align: left;
    }
    .time{
        font-size: 10px;
        margin: 5px;
    }
    .username{
        margin: 5px;
    }
    
</style>