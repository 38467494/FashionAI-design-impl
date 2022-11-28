const objToStrMap = (obj) => {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
const jsonToMap = (jsonStr) => {
  return objToStrMap(JSON.parse(jsonStr));
}
// 找到map中value对应的key
const findKey = (obj, value) => {
  var compare = (function(a, b) {
    return a === b;
  });
  return Object.keys(obj).filter(function(k) {
    return compare(obj[k], value);
  });
}
export {
  objToStrMap,
  jsonToMap, 
  findKey
}
