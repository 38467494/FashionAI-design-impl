<template>
  <div class="flex flex-col gap-y-3">
    <div class="flex gap-x-2">
      <el-select
        v-model="colorValue" clearable placeholder="颜色">
        <el-option
          v-for="item in colorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        v-model="brandValue"
        :disabled="radio == ''"
        clearable
        placeholder="品牌">
        <el-option
          v-for="item in brandOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        v-show="radio == 'Jackets' || radio == 'Sweatshirts Hoodies' || radio == 'Outerwear' || radio=='Tops' "
        v-model="sleeveValue"
        clearable
        placeholder="衣袖"
      >
        <el-option
          v-for="item in sleeveOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-show="radio == 'Tops'"
        v-model="shoulderValue"
        clearable
        placeholder="衣肩"
      >
        <el-option
          v-for="item in shoulderOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-show="
          radio == 'Clothing Jeans' ||
          radio == 'Clothing Pants' ||
          radio == 'Clothing Shorts'
        "
        v-model="legValue"
        clearable
        placeholder="裤腿"
      >
        <el-option
          v-for="item in legOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-show="radio == 'Tops' || radio == 'Sweatshirts Hoodies'"
        v-model="neckValue"
        clearable
        placeholder="领口"
      >
        <el-option
          v-for="item in neckOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div class="flex gap-x-2">
      <el-select
        v-model="styleValue"
        clearable
        placeholder="样式"
      >
        <el-option
          v-for="item in styleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          v-show="getDisable(item.show)"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="otherValue"
        :disabled="radio == ''"
        clearable
        multiple
        filterable
        placeholder="其他标签"
        :multiple-limit="5"
        collapse-tags
        @change="checkFull"
      >
        <el-option
          v-for="item in otherOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          v-show="getDisable(item.show,item.disabled)"
        >
        </el-option>
      </el-select>
    </div>

  </div>
</template>

<script>
export default {
  name: "matchText",
  props: {
    radio: {
      type: String,
      default: null,
    },
    upperCategory: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      //value内部文本描述，label展示文本
      colorOptions: [
        {
        value: 'Black',
        label: '黑色'
      }, {
        value: 'White',
        label: '白色'
      }, {
        value: 'Blue',
        label: '蓝色'
      }, {
        value: 'Red',
        label: '红色'
      }, {
        value: 'Pink',
        label: '粉色'
      }],
      colorValue: '',

      brandOptions: [{
        value: 'Topshop',
        label: 'Topshop'
      }, {
        value: 'River Island',
        label: 'River Island'
      }, {
        value: 'Alexander McQueen',
        label: 'Alexander McQueen'
      }, {
        value: 'Alexander Wang',
        label: 'Alexander Wang'
      }, {
        value: 'Boohoo',
        label: 'Boohoo'
      }, {
        value: 'Gucci',
        label: 'Gucci'
      }, {
        value: 'MANGO',
        label: 'MANGO'
      }, {
        value: 'Valentino',
        label: 'Valentino'
      }, {
        value: 'Miss Selfridge',
        label: 'Miss Selfridge'
      }, {
        value: 'Hollister Co',
        label: 'Hollister Co'
      }, {
        value: 'Yves Saint Laurent',
        label: 'Yves Saint Laurent'
      }, {
        value: 'Frame',
        label: 'Frame'
      }, {
        value: 'Chicwish',
        label: 'Chicwish'
      }, {
        value: 'Zimmermann',
        label: 'Zimmermann'
      }, {
        value: 'Alice  Olivia',
        label: 'Alice+Olivia'
      }, {
        value: 'Stella McCartney',
        label: 'Stella McCartney'
      }, {
        value: 'Balmain',
        label: 'Balmain'
      }, {
        value: 'Chlo',
        label: 'Chloé'
      }, {
        value: 'Miu Miu',
        label: 'Miu Miu'
      }, {
        value: 'Rag  bone',
        label: 'Rag & Bone'
      }, {
        value: 'TIBI',
        label: 'TIBI'
      }, {
        value: 'SheInsheinside',
        label: 'SheIn (Sheinside)'
      }, {
        value: 'Yoins',
        label: 'Yoins'
      }, {
        value: 'Levis',
        label: 'Levi\'s'
      }, {
        value: 'Moschino',
        label: 'Moschino'
      }, {
        value: 'JCrew',
        label: 'J.Crew'
      }],
      brandValue: '',
      sleeveOptions: [{
        value: 'Short Sleeve',
        label: '短袖'
      }, {
        value: 'Long Sleeve',
        label: '长袖'
      }, {
        value: 'Sleeveless',
        label: '无袖'
      }],
      sleeveValue: '',
      shoulderOptions: [{
        value: 'OneShoulder',
        label: '单肩'
      }, {
        value: 'offtheshoulder',
        label: '露肩'
      }],
      shoulderValue: '',
      legOptions: [{
        value: 'Wide Leg',
        label: '阔腿'
      }, {
        value: 'Straight Leg',
        label: '直筒'
      }],
      legValue: '',
      neckOptions: [{
        value: 'Vneck',
        label: 'V领'
      }, {
        value: 'Round Neck',
        label: '圆领'
      }, {
        value: 'High Neck',
        label: '高领'
      }],
      neckValue: '',
      styleOptions: [
        {
          value: 'Blouses',
          label: '衬衫',
          show:  'Tops'
        },

        {
          value: 'TShirts',
          label: 'T恤衫',
          show:  'Tops'
        },
        {
          value: 'Mini Skirts',
          label: '迷你裙',
          show:  'Skirts'
        },
        {
          value: 'Skinny Jeans',
          label: '紧身牛仔裤',
          show:  'Clothing Jeans'
        },
        {
          value: 'Knee Length Skirts',
          label: '及膝裙',
          show:  'Skirts'
        },
        {
          value: 'Tank',
          label: '背心',
          show:  'Tops'
        },
        {
          value: 'Sweaters',
          label: '毛衣',
          show:  'Tops'
        },
        {
          value: 'Cardigans',
          label: '羊毛衫',
          show:  'Tops'
        },
        {
          value: 'Coats',
          label: '大衣',
          show:  'Outerwear'
        },
        {
          value: 'Long Skirts',
          label: '长裙',
          show:  'Skirts'
        },
        {
          value: 'Leggings',
          label: '紧身裤',
          show:  'Clothing Pants'
        },
        {
          value: 'Blazers',
          label: '运动夹克',
          show:  'Jackets'
        },
        {
          value: 'midi skirt',
          label: '中长裙',
          show:  'Skirts'
        },
        {
          value: 'Pencil Skirt',
          label: '铅笔裙',
          show:  'Skirts'
        },
        {
          value: 'cami',
          label: '吊带背心',
          show:  'Tops'
        }],
      styleValue: '',
      otherOptions: [{
        value: 'Denim',
        label: '牛仔布料'
      }, {
        value: 'Crop',
        label: '露脐',
        disabled: !this.upperCategory
      }, {
        value: 'Cropped',
        label: '短款'
      }, {
        value: 'Boyfriend',
        label: '男友风'
      }, {
        value: 'Print',
        label: '印花'
      }, {
        value: 'High Waist',
        label: '高腰',
        disabled: this.upperCategory
      }, {
        value: 'Embroidered',
        label: '刺绣'
      }, {
        value: 'Striped',
        label: '条纹'
      }, {
        value: 'Floral',
        label: '花饰'
      }, {
        value: 'Lace',
        label: '蕾丝'
      }, {
        value: 'cotton',
        label: '棉纺'
      }, {
        value: 'Silk',
        label: '丝织'
      }, {
        value: 'Ripped',
        label: '破洞'
      }, {
        value: 'distressed',
        label: '做旧'
      }, {
        value: 'leather',
        label: '皮革'
      }, {
        value: 'Ruffle',
        label: '褶裥'
      }, {
        value: 'Tie Front',
        label: '前部打结',
        show: 'Tops'
      }, {
        value: 'Hem',
        label: '褶边'
      }, {
        value: 'Vintage',
        label: '古着'
      }, {
        value: 'Wool',
        label: '羊毛'
      }, {
        value: 'Crepe',
        label: '绉布'
      }, {
        value: 'Moto',
        label: '骑行'
      }, {
        value: 'Wrap',
        label: '裹身'
      }, {
        value: 'Knit',
        label: '针织'
      }, {
        value: 'Flared',
        label: '喇叭口'
      }, {
        value: 'Patchwork',
        label: '拼布'
      }, {
        value: 'Embellished',
        label: '镶钉'
      }],
      otherValue: [],
    };
  },
  watch:{
    //当选择的radio发生改变，将标签信息清空
    radio:function (){
      this.colorValue = [];
        this.brandValue = [];
        this.sleeveValue = [];
        this.shoulderValue = [];
        this.legValue = [];
        this.neckValue = [];
        this.styleValue = [];
        this.otherValue = [];
    }
  },
  methods: {
    //获取标签值（点击提交后，通过父组件调用该函数）
    getValue: function () {
      var describeText = this.getDescribeText();
      var all = [
        this.colorValue,
        this.brandValue,
        this.sleeveValue,
        this.shoulderValue,
        this.legValue,
        this.neckValue,
        this.styleValue,
        this.otherValue,

      ];

      //生成中文标签
      var c_res = [];
      for (var i = 0; i < all.length; i++) {
        var val = all[i];
        if (val != '') {
          var c = this.getLabel(i, val);
          c_res = c_res.concat(c);
        }
      }

      all = all.concat(describeText);
      var res = [];
      for (var val of all) {
        if (val != '')
          res = res.concat(val);
      }

      console.log("getValue",res,c_res)
      return {
        labels: res,
        c_labels: c_res
      };
    },
    getDescribeText: function () {
      let objectiveText = "Womens Fashion";
      if(this.otherValue == null)
        this.otherValue = [];
      let tagString = this.otherValue.join(' ');
      let textList = [this.radio, this.colorValue, this.sleeveValue, this.shoulderValue, this.legValue, this.neckValue, this.styleValue, tagString];
      for (let text of textList) {
        if (text != '') {
          objectiveText += ' ';
          objectiveText += text;
        }
      }
      if (this.radio == 'Clothing Jeans' || this.radio == 'Clothing Pants' || this.radio == 'Clothing Shorts') {
        objectiveText = objectiveText + ' Trousers';
      }

      if (this.brandValue != '') {
        objectiveText = objectiveText + ' by ' + this.brandValue;
      }
      return objectiveText
    },
    getLabel: function (index, val) {
      console.log('getLbel', index, val);
      var list = [this.colorOptions, this.brandOptions, this.sleeveOptions, this.shoulderOptions,
        this.legOptions, this.neckOptions, this.styleOptions, this.otherOptions];
      var res;
      if (Array.isArray(val)) {
        res = [];
        for (var v of val) {
          res.push(this.getLabel(index, v));
        }
      } else {
        for (var obj of list[index]) {
          console.log(obj.value, val, obj.value == val);
          if (val == obj.value) {
            res = obj.label;
            break;
          }
        }
      }
      console.log(val, res);
      return res;

    },

    getDisable:function (val,disable){
      if(val == this.radio)
        return true;

      if(disable==null && val == null)
        return true;

      if(disable == false)
        return true;

      return false;
    },
    //检查其他标签多选标签数量是否为五个，如果已经选择了5个，那就弹出警告信息
    checkFull:function (){
      if(this.otherValue.length == 5){
        this.$message({
          message: '其他属性个数已达到上限； 期望生成服装标签建议选择5个左右',
          type: 'warning'
        });
      }
    }

  },
};
</script>

<style>
</style>
