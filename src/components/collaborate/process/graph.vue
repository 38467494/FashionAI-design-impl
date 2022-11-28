<template>

  <div style="margin: 20px;">

        <h2 class="font-bold text-2xl border-b pb-2">
          设计版本分支图
        </h2>

      <div id="process-graph" style="height: 300px;" class="processGraph">
      </div>



  </div>

</template>

<script>
import * as echarts from 'echarts';
import {getVersion} from '../../../api/collaborateAPI';
export default {
    name:"graph",
    mounted: function(){
        // this.showGraph();
    },
    data: function(){
        return {
            rowData: [],
            root: {

            },
          newestId: -1,   //最新版本的id
          mychart: null,
        }
    },
    methods:{
        showGraph: function(pid){
          console.log("showGraph");
            // var pid = this.pid;
            var _this =this;
            console.log("graph pid",pid);
            getVersion({
                pid:pid
            }).then(res =>{
                console.log(res.data);
                _this.dataProcess(res.data);
                _this.getChart();
                _this.showNewestVersion();
            })
            // this.getChart();
        },
        dfs: function(root){
          // console.log("dfs")
            var res = {};
            var rowData=this.rowData;
            res["id"] = rowData[root].id;
            res["create_time"] = rowData[root].create_time;
            res["children"] = []
            var children = rowData[root].childrenIndex;
            if(children == null)  return res;
            for(var i =0;i<children.length;i++){
                var child = this.dfs(children[i]);
                res["children"].push(child)
            }
            return res;
        },
        dataProcess: function(data){
            this.rowData = data;

            this.root = this.dfs(0);

        },
      compareData:function (v1,v2){
          //比较规则：比较日期，若日期相同，id大的认为新
          //若v1比v2新，返回true
        var d1 = v1.create_time;
        var d2 = v2.create_time;
        if(d1 == d2)
          return v1.id > v2.id;
        return d1> d2

      },
      showNewestVersion:function (){
          var data =this.rowData
          var index = -1;
          console.log("showNewestVersion",data.length)
          for(var i=0;i<data.length;i++){
            if(index ==-1) {
              index = i;
              continue;
            }
            if(this.compareData(data[i],data[index]))
              index = i;

          }

        this.newestId = data[index].id;

          // this.mychart.dispatchAction({
          //   type: 'select',
          //   seriesId: data[index].id
          // })


        var version=data[index]
        this.$emit('getComment',version);
      },
      getVersion:function (vid){
          vid= Number(vid);
          // console.log(vid);
          // console.log(this.rowData);
        for(var v of this.rowData){
          if(v.id==vid)
            return v;
        }
        return null;
      },
        getChart: function(){
            var myChart=echarts.init(document.getElementById('process-graph'));
            this.mychart = myChart
            var data=this.root;
            var _this=this;
            myChart.setOption({
                tooltip: {
                    trigger: 'none',

                },
                series: [
                    {
                    type: 'tree',
                    data: [data],

                    top: '5%',
                    left: '10%',
                    bottom: '5%',
                    right: '10%',
                    symbolSize: 20,
                    //   edgeShape: 'polyline',
                    label: {
                        position: 'top',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 9,
                        formatter: function(params){
                            // console.log(params);
                            return params.data["create_time"];
                        }
                    },
                      selectedMode:'single',
                      select:{
                      itemStyle:{
                        borderColor:'red'
                      }

                      },
                    leaves: {
                        label: {
                        position: 'top',
                        verticalAlign: 'middle',
                        align: 'left'
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: false,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                    }
                ]
            });
            myChart.on('click', function(params){
                console.log("mychart click",params.data)
              if(params.data.id == null){
                console.log("vid,null");
                _this.$store.commit("changeCollaborateInfo",{
                  pid: _this.pid,
                  vid: -1,
                  version: {
                    id: -1,
                    canvas: null,
                    image: null,
                  }
                })
                _this.$router.push({
                  name: 'collaborate-design',

                })
              }
                var vid = encodeURIComponent(params.data.id);

                var version=_this.getVersion(vid);
                // console.log(version);


                _this.$emit('getComment',version);
            })

        },
      updateSaved: function (id, val){
        for(var i=0;i<this.rowData.length;i++){
          var v = this.rowData[i];
          if(v.id==id)
            this.rowData[i].saved = val;
        }
      }
    }
}
</script>

<style scoped>
.processGraph:hover{
  /*background: #409EFF;*/
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
  }
</style>
