const files = require.context(
  "./../static/template",
  true,
  /.jpg$/
);
// 图片库房 存放图片类型
const imageUrl = {};
// 获取到文件进行循环 path为文件路径
files.keys().forEach(path => {
  // 截取名
  const file_name = path.replace(/(.*\/)*([^.]+).*/ig, "$2");
  // 通过路径加载 文件
  const file = require(path + '');
  //  文件名为参数  文件为参数值 形成可用对象
  let object = { [file_name]: file.default }
  // 与库房合并
  Object.assign(imageUrl, object)
});
// 抛出我们做好的数据
export default imageUrl;
