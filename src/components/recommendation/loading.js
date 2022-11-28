// 加载条
import {
  Loading
} from 'element-ui';

let loading = null;
const showLoading = (target) => {
  console.log("show loading");
  if (loading) {
    loading.close();
  }
  let options = {
    fullscreen: false,
    target: document.querySelector(target),
    lock: true,
    text: '数据加载中',
    spinner: 'el-icon-loading',
  }
  loading = Loading.service(options)
  console.log(loading);
}
const hideLoading = () => {
  console.log("hide loading");
  if (loading) {
    loading.close();
    console.log(loading);
  }
}

export {
  showLoading,
  hideLoading,
}
