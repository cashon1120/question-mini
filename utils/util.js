// 是否包含
function hasObj(obj, id) {
  let has = false
  obj.forEach((item, index) => {
    if(item.id === id){
      has = index
    }
  });
  return has
}

module.exports = {
  hasObj
}