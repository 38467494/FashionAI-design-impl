export function showError(_this,res){
  console.log("showError");
  var html= "  <h3>系统出现异常，请您稍后再试或联系管理员！</h3>\n" +
    "  <div>\n" +
    "    <div style=\"width: 30%;float: left;box-sizing: border-box;font-weight: bold;margin: 3px 0px;\">\n" +
    "      状态码:\n" +
    "    </div>\n" +
    "    <div style=\"width: 70%;float: left;box-sizing: border-box;margin: 3px 0px;\">\n" +
    `${res.data.code}` +
    "    </div>\n" +
    "  </div>\n" +
    "<div>\n" +
    "  <div style=\"width: 30%;float: left;box-sizing: border-box;font-weight: bold;margin: 3px 0px;\">\n" +
    "    详细信息:\n" +
    "  </div>\n" +
    "  <div style=\"width: 70%;float: left;box-sizing: border-box;margin: 3px 0px;\">\n" +
    `${res.data.message}` +
    "  </div>\n" +
    "</div>"
  _this.$alert(html,'错误提示',{
    dangerouslyUseHTMLString: true,
    customClass:"errorAlert"
  })
}
