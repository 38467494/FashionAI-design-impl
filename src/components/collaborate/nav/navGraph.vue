<template>
  <div class="flex flex-col gap-y-4">
    <div class="font-bold text-lg text-left">点击添加简单的几何图案</div>
    <section class="flex flex-nowrap">
      <template v-for="(item, index) in shapeArr">
        <AtsButton 
        @click="addShape(item.name)" 
        >
            <i class="text-xl" :class="item.icon"></i>
            <!-- <el-image
              :src="getSrc(item.name)"
              class="pic"
              fit="contain"
            ></el-image> -->
            <!-- <el-divider class="divider"></el-divider> -->
            <!-- <p class="graph-text">
              {{ item.title }}
            </p> -->
        </AtsButton>

        <!-- <el-row :key="index" type="flex" v-if="index % 2 === 0">
          <el-col :span="12">
            <div style="text-align: center;">
              <AtsButton
                :key="index"
                @click="addShape(item.name)"
                class="pic-button"
              >
                <div>
                  <el-image
                    :src="getSrc(item.name)"
                    class="pic"
                    fit="contain"
                  ></el-image>
                  <el-divider class="divider"></el-divider>
                  <p class="graph-text">
                    {{ item.title }}
                  </p>
                </div>
              </AtsButton>
            </div>
          </el-col>
          <el-col :span="12" v-if="index + 1 < shapeArr.length">
            <div style="text-align: center;">
              <AtsButton
                :key="index"
                @click="addShape(shapeArr[index + 1].name)"
                class="pic-button"
              >
                <div>
                  <el-image
                    :src="getSrc(shapeArr[index + 1].name)"
                    class="pic"
                    fit="contain"
                  ></el-image>
                  <el-divider class="divider"></el-divider>
                  <p class="graph-text">
                    {{ shapeArr[index + 1].title }}
                  </p>
                </div>
              </AtsButton>
            </div>
          </el-col>
        </el-row>
 -->
        <!-- <br :key="index" v-if="index %2===0"> -->
      </template>
    </section>
  </div>
</template>

<script>
import { fabric } from "fabric";
import editDraw from "./editDraw.vue";
import editGeneral from "./editGeneral.vue";
import { addObj } from "./objFunction";
import AtsButton from "../../common/AtsButton.vue";
export default {
  components: { editDraw, editGeneral, AtsButton },

  name: "navGraph",
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  data: function() {
    return {
      editVisible: true,
      shapeArr: [
        {
          name: "circle",
          title: "圆形",
          icon: 'bi bi-circle',
        },
        {
          name: "triangle",
          title: "三角形",
          icon: 'bi bi-triangle',
        },
        {
          name: "rect",
          title: "矩形",
          icon: 'bi bi-square',
        },
        {
          name: "line",
          title: "直线",
          icon: 'bi bi-dash-lg',
        }
      ],
      shapeWidth: 50, //设置形状放入时的初始化宽度
      fillColor: "#409EFF",
      borderColor: null,
      borderWidth: 0
    };
  },
  methods: {
    getSrc: function(name) {
      return "../../../static/pic/navGraph/" + name + ".png";
    },
    addShape: function(shape) {
      if (shape == "circle") this.addCircle();
      else if (shape == "triangle") this.addTriangle();
      else if (shape == "rect") this.addRect();
      else if (shape == "line") this.addLine();
    },
    addCircle: function() {
      var shapeWidth = this.shapeWidth;
      var circle = new fabric.Circle({
        left: 100, //距离画布左侧的距离，单位是像素
        top: 100, //距离画布上边的距离
        fill: "#409EFF", //填充的颜色
        radius: shapeWidth
      });
      addObj(circle, this.canvas);
    },
    addTriangle: function() {
      var shapeWidth = this.shapeWidth;
      var triangle = new fabric.Triangle({
        left: 100, //距离画布左侧的距离，单位是像素
        top: 100, //距离画布上边的距离
        fill: "#409EFF", //填充的颜色
        width: shapeWidth,
        height: shapeWidth
      });
      addObj(triangle, this.canvas);
    },
    addRect: function() {
      var shapeWidth = this.shapeWidth;
      var rect = new fabric.Rect({
        left: 100, //距离画布左侧的距离，单位是像素
        top: 100, //距离画布上边的距离
        fill: "#409EFF", //填充的颜色
        width: shapeWidth, //方形的宽度
        height: shapeWidth //方形的高度
      });
      addObj(rect, this.canvas);
    },
    addLine: function() {
      var shapeWidth = this.shapeWidth;
      var x = 100 + shapeWidth;
      var line = new fabric.Line([100, 100, x, 100], {
        stroke: "#409EFF",
        strokeWidth: 3
      });
      addObj(line, this.canvas);
    }
  }
};
</script>

<style>
.pic {
  width: 50px;
  height: 50px;
  margin: 2px 0px;
}
/* .pic-button {
  padding: 0px 8px;
  width: 90%;
  margin: 5px 0px;
} */
.divider {
  margin: 2px;
}
.graph-text {
  margin: 5px;
  font-size: 15px;
}
.edit-div {
  text-align: center;
  margin: 0 auto;
  padding: 0;
}
.edit-text {
  margin: 0 auto;
}
.input-number {
  width: 80%;
}
.edit-row {
  padding: 2px 0;
}
</style>
