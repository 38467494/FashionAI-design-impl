<template>
  <div class="flex flex-col gap-y-4">
    <div class="font-bold text-lg">添加文字</div>
    <div>
      <el-input
        v-model="text"
        placeholder="请输入需要添加的文字"
        type="textarea"
        maxlength="100"
        rows="5"
      ></el-input>
    </div>
    <div>
      <AtsButton @click="addText" expand type="primary">添加</AtsButton>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { addObj } from "./objFunction";
import AtsButton from "../../common/AtsButton.vue";

export default {
    name: "navText",
    props: {
        canvas: {
            type: fabric.Canvas,
            default: null
        }
    },
    data: function () {
        return {
            text: ""
        };
    },
    methods: {
        // 还需要动态控制修改框的显示与否，需要使用全局变量
        addText: function () {
            var input = this.text;
            // var text = new fabric.Text(input,{
            //     fontsize:30,
            // });
            // this.canvas.add(text);
            var textBox = new fabric.Textbox(input, {
                left: 120,
                top: 50,
                width: 150,
                fontSize: 20,
                textAlign: "center"
                // hasControls: false
            });
            addObj(textBox, this.canvas);
            // textBox.set({
            //
            // })
            this.text = "";
        }
    },
    components: { AtsButton }
};
</script>
