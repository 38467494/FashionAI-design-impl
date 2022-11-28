//为每个canvas中的元素添加事件
import store from "../../../store";
export function addObj(obj,canvas){

  obj.on('selected',function(){
    changeType(obj)});
  obj.on('modified',function(){
    store.commit('submitModify')
  })
  canvas.add(obj);
  canvas.renderAll();
}

function changeType(type) {
  store.commit('changeType', {
    type: type
  });
}

export function addEvent(obj){
  obj.on('selected',function(){
    changeType(obj)});
  obj.on('modified',function(){
    store.commit('submitModify')
  })
}

