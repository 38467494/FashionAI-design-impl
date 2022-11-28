# fashionAI UI 设计稿复现说明文档

## 基础设施

### 颜色常量

`src/assets/css/base.css`

基础样式文件中，用CSS变量预设了需要用到的颜色常量，如下所示

```css
:root {

  /* 基础紫色 */
  --base-purple: rgba(96, 106, 255, 1);

  /* pink 色系 */
  --base-pink: rgba(255, 0, 107, 1);
  --base-pink-opac: rgba(255, 0, 107, 0.13);
  --base-pink-lightup: rgb(255, 87, 156);
  --base-pink-darken: rgb(206, 68, 121);
  --base-pink-disabled: rgba(255, 0, 107, 0.33);

  /* ..... */
}
```

> 本CSS已在 `main.js` 中引入，因此所有变量均可直接在所有级别的组件的样式中直接使用


### 基础 CSS 样式类

已在项目中引入 [TailwindCSS](https://tailwindcss.com/)，官方文档的所有CSS Class 都能直接在项目中使用

### ICON 图标使用方法

已通过 CDN 引入 [Bootstrap Icons](https://icons.getbootstrap.com/https://icons.getbootstrap.com/)

使用方法：在 [Bootstrap Icons](https://icons.getbootstrap.com/https://icons.getbootstrap.com/) 上找到要使用的图标名字，例如 `square-fill`，加上前缀 `bi-` 作为 class 名，然后在需要插入的地方使用 `<i>` 标签即可，如

```html
<i class="bi bi-square-fill"></i>
```

## 布局指南

已将项目中几乎所有基于 `el-row` 与 `el-col` 的布局用 div + flex 模式重写（前者容易维护但灵活性差，后者可维护性仍然良好且更灵活）

[Flex 布局基础知识](https://web.dev/learn/css/flexbox/)

### 基本模式范例

下面展示几个基本模式，[点击查看更多范例](https://tailwindcss.com/docs/flex-basis)

按比例分栏
```html
<section class="flex">
  <section class="basis-1/3"></section>
  <section class="basis-2/3"></section>
</section>
```

两边固定，中间可伸缩
```html
<section class="flex">
  <section class="flex-none">固定内容</section>
  <section class="grow">可伸缩内容</section>
  <section class="flex-none">固定内容</section>
</section>
```

垂直居中某个元素
```html
<section class="flex justify-center items-center">
  <div>我是需要垂直居中的元素</div>
</section>
```

项目左对齐/右对齐
```html
<!-- 这里有一组需要右对齐的按钮 -->
<section class="flex justify-end">
  <button>按钮1</button>
  <button>按钮2</button>
  <button>按钮3</button>
</section>
```

### Flex 分栏间距设置

有时候我们用 flex 进行分栏布局后，可能希望为栏与栏之间的 gap 设置一点间距，这时无论是用 padding 还是 margin 实现，都会使得第一栏左边与最后一栏的右边也出现间距，如果不希望出现这样的情况，可以参考以下两种方案：

1. 父容器设置内 padding，子容器设置单边 margin（但其实并不能完全解决问题，而且比较繁琐）
2. 可以使用 TailwindCSS 内置的 gap 预定义类，如

```html
<section class="flex gap-x-6">
  <section class="basis-1/3"></section>
  <!-- 这里有间距 -->
  <section class="basis-1/3"></section>
  <!-- 这里有间距 -->
  <section class="basis-1/3"></section>
</section>
```

更多细节请参考 [Gaps for Flexbox & Grid](https://tailwindcss.com/docs/gap)

## 自定义组件

### 导航栏 AtsNavMenu

重写整个导航栏，新导航栏包括 Logo，可 dropdown 菜单，用户头像悬浮菜单

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111181241.png)

导航栏是可配置的，在 `AtsNavMenu.vue` 的 data 中配置即可

```html
<script>
export default {
 data() {
    return {
      menus: [
        {
          text: "首页",
          route: "/home",
        },
        {
          text: "搭配推荐",
          route: "/recommendation",
        },
        // ......
        {
          text: "工具集",
          route: '/design/match',
          submenu: [
            {
              text: '设计生成',
              route: '/design/match',
            },
            {
              text: 'AI造型工具',
              route: '/stylist',
            }
          ]
        },
      ],
    }
  }
}
</script>
```

### 渐变背景

将设计稿中的渐变背景封装成了可复用的组件，在需要使用该背景的页面中直接引入组件，放置于模板中根组件内部即可（插入组件后，渐变背景色会直接作用在当前页面上）

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111123739.png)

依据设计稿，本项目共两处用到渐变背景：
- 首页
- AboutUs页面

首页中的用例
```vue
<template>
  <div id="home" class="font-sans">
    <GradientBackground />
    <!-- 其他... -->
  </div>
</template>
```

AboutUs 页面的用例
```vue
<template>
  <div>
    <GradientBackground/>
    <!-- 其他.... -->
  </div>
</template>
```

### 按钮 AtsButton

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111145800.png)

与组件库按钮使用方式类似，提供了如下 props
```js
props: {
  // 可选项: primary | pink | silent
  "type": {
    type: String
  },
  // 是否普通按钮（有边框但内部不填充颜色）
  "plain": {
    type: boolean
  },
  // 是否具有圆角
  "round": {
    type: boolean
  },
  // 是否圆形按钮
  "circle": {
    type: boolean
  },
  // 是否自动占满父容器
  "expand": {
    type: boolean
  },
  // 可选项: medium | small | mini
  "size": {
    type: String
  }
}
```

### 回到顶部按钮 AtsBack2TopBtn

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111142732.png)

已封装一键返回页面顶部的功能供复用，用法与普通按钮组件相同

```html
<AtsBack2TopBtn />
```

### AtsLogo

按设计稿 Logo 基本样式封装：圆形 Logo 图 + 右侧文字

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111143003.png)

可在对应组件 `src/components/common/AtsLogo.vue` 内部维护/修改 Logo 静态文件位置

使用时引入组件并插入到想放置的位置即可
```html
<AtsLogo />
```

### 简单圆角阴影内容卡片 SimpleInfoCard

效果如下图

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111124309.png)

使用时只需要将卡片内容用这个组件包裹起来即可，如下方代码所示（具体使用例子见 AboutUs 页面）
```html
<FrostedGlassContentCard class="mx-auto mb-24 mt-6">
  <!-- 卡片内容 -->
</FrostedGlassContentCard>
```

### 毛玻璃内容卡片 FrostedGlassContentCard

本组件为带毛玻璃特效的圆角卡片，依据设计稿，建议配合渐变背景使用，效果如下图

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111124418.png)

使用时只需要将卡片内容用这个组件包裹起来即可，如下方代码所示（具体使用例子见 AboutUs 页面）
```html
<FrostedGlassContentCard class="mx-auto mb-24 mt-6">
  <!-- 卡片内容 -->
</FrostedGlassContentCard>
```

### 图文卡片 AtsCard

本组件主要服务于具有 `图片` 和 `标题` 的 `可点击` 信息卡片

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111142259.png)

提供的基本样式：
- 卡片边框
- 卡片阴影及悬浮阴影变化效果

提供了四个插槽：
- `image` 图片
- `title` 标题
- `subtitle` 副标题
- `side-attach` 文字旁边的附属信息，如点赞数

使用时引入组件，往对应插槽中放入元素即可

下面是 `imageitem.vue` 中的使用范例
```html
<template>
<!--  分享区首页图-->
  <AtsCard>
    <template v-slot:image>
      <el-image :src="src" v-if="src" style="border-bottom: #F4F4F5 1px solid; "></el-image>
    </template>
    <template v-slot:title>
      {{title}}
    </template>
    <template v-slot:subtitle>
      <i class="text-gray-400 bi bi-person-circle"></i>
      {{user}}
    </template>
    <template v-slot:side-attach>
      <div class="text-gray-400">
        <i class="bi bi-hand-thumbs-up"></i>
        1.3k
      </div>
      <div class="text-gray-400">
        <i class="bi bi-eye"></i>
        1.3k
      </div>
    </template>
  </AtsCard>
</template>
```

### 带简单动画的超链接 HyperLink

此组件服务于 AboutUs 页面的“个人主页”超链接，带动画，可复用

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111142025.png)

```html
<HyperLink :active="item.personalPage != ''" :href="item.personalPage">
  个人主页
</HyperLink>
```


### 大型展示块 SuperSection

本组件服务于首页的几个大板块，每个板块是一个组件，板块是指如下图所示的内容块

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111135415.png)

提供了两个 prop:
```js
props: {
  // 传入特定结构的对象
  //  {
  //     img: "../../static/img/clothe-example/1.webp",
  //     title: "探索您的衣橱",
  //     btnText: "搭配推荐",
  //     subtitle: "Explore, Discover & Be Inspired",
  //     reverse: false,
  //     step: ["选择待推荐分类", "选择输入单品", "查询中", "查询完成"],
  //     content: [
  //       "或许您还在为今天出门穿什么而烦恼？",
  //       "在这里，你可以设计您所喜欢的搭配",
  //       "也可以寻求AI搭配师的帮助",
  //       "谙图生，让OOTD变得简单"
  //     ],
  //     path: "/recommendation"
  //   },
  "intro": {
    type: Object
  },
  // true 则图片在左内容在右，vice versa.
  "reverse": {
    type: boolean
  }
}
```

具体结构详见代码 `src/components/common/SuperSection.vue`


### 超级按钮 AtsSuperBtn

本组件服务于首页超级板块中的蓝色渐变带阴影圆角按钮，当然亦可将其放置于你想要的任何地方

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111123931.png)

使用方法与普通组件库按钮类似，可监听点击事件，可直接通过插值表达式 `{{text}}` 定义按钮文字，样式已在组件内部写好，若有需要可自行修改
```vue
<AtsSuperButton @click="changeNav(intro.path)">
  {{ intro.btnText }}
</AtsSuperButton>
```


### 侧边导航栏 side-nav

此部分没有封装成组件，为了给自定义导航栏项目留充足的发挥空间，只封装了一套样式

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111180248.png)


样式见 `src/assets/css/ats-sidenav.css`

使用时，给作为单个 item 的元素加上 `ats-sidenav` 类名即可应用样式，示例如下
```html
<div id="nav-container" class="flex-none border-r p-0">
  <div
    class="ats-sidenav"
    v-for="item in sidenavs"
    :class="activeMenu == item.name ? 'active' : ''"
    @click="selectMenu(item.name)"
  >
    <!-- 导航栏item的内容 -->
    <i class="bi mr-2 text-xl" :class="'bi-' + item.icon"></i>
    <span class="text-lg">{{ item.text }}</span>
  </div>
</div>

<style scoped>
/* 引入样式 */
@import "../assets/css/ats-sidenav.css";
</style>

<script>
export default {
  data() {
    return {
      sidenavs: {
        info: {
          name: "info",
          text: "个人信息",
          icon: "person",
        },
        design: {
          name: "design",
          text: "我的设计",
          icon: "palette",
        },
        collect: {
          name: "collect",
          text: "我的收藏",
          icon: "bookmark-star",
        }
      },
    }
  }
}
</script>
```

### 手势卡片轮播图 AtsCardCarousel

本组件服务于首页的手势滑动卡片轮播

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111193245.png)

使用时放入图片 URL 数组即可

```html
<template>
  <AtsCardCarousel :imgs="carouselImgs" />
</template>
<script>
export default {
  data() {
    return {
      carouselImgs: [
        "../../static/img/clothe-example/1.webp",
        "../../static/img/clothe-example/2.webp",
        "../../static/img/clothe-example/3.webp",
        "../../static/img/clothe-example/4.webp",
        "../../static/img/recommendation.png"
      ],
    }
  }
}
</script>
```

### 多选项组合 AtsMultiOptionGroup

分享区内页 - 评论区 - 表情组件的基础组件

抽离“多选项选择器”逻辑，封装成可复用的组件

```html
<AtsMultiOptionGroup :options="commentOptions"/>
```

### 评论 Comment

重写已有的评论组件，修改发表评论及下方评论展示区域的样式

依据设计稿增加表情选项功能（仅提供前端按钮接口）

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111205344.png)

## 基于覆写 element 样式的组件

这批组件只有改变样式的需求，组件的逻辑部分完全没有改变，所以没有必要重新做一套，只需要写一批样式去覆盖 element UI 的样式即可

```js
// src/main.js

/**
 * import default ElementUI styles first,
 * then override it
 */
import 'element-ui/lib/theme-chalk/index.css';
import './icon/fontAlign/iconfont.css'
Vue.use(ElementUI);

/**
 * the below css files overrides the default style of element-UI
 * including el-tabs, el-dialog, el-radio, el-select, el-tag
 */
import "./assets/css/base.css";
import "./assets/css/tabs-override.css";
import "./assets/css/dialog-override.css";
import "./assets/css/radio-override.css";
import "./assets/css/input-override.css";
import "./assets/css/slider-override.css";

/* tag必须在dialog之前引入，否则会有覆写问题 */
import "./assets/css/tag-override.css";
import "./assets/css/select-override.css";
import "./assets/css/input-number-override.css";
import "./assets/css/step-override.css";
```

### 标签页组件 el-tab

覆写样式文件 `tab-override.css`

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111143323.png)

### el-input

覆写样式文件 `input-override.css`

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111180157.png)

### el-select

覆写样式文件 `select-override.css`

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111175852.png)

### el-slider

覆写样式文件 `slider-override.css`

### el-radio

覆写样式文件 `radio-override.css`

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111175907.png)

### el-dialog

覆写样式文件 `dialog-override.css`

主要是修改边框、阴影、关闭按钮样式

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111180038.png)

### el-step

覆写样式文件 `step-override.css`

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111175959.png)

### el-tag

覆写样式文件 `tag-override.css`

![](https://cjpark-1304138896.cos.ap-guangzhou.myqcloud.com/note_img/20221111180114.png)


## 其他事项

- innerPage 评论组件下方的表情按钮，已经做好且仅做好按钮组件
- 某些页面有的右侧四分之一推荐栏，已经做好留白组件
- Logo 未确定用哪一个，现在是随便选了一个放上去
- Footer 未提供内容，已用占位文字填充
- 有一个静态文件依赖，目前还在我的私人服务器上，需要转移到ices的服务器