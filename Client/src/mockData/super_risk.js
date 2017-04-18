var merge = require('webpack-merge');

var commonData = require('./commonData');

module.exports = {
    //自然人基本信息
    "riskTabData": merge(commonData, {
        "data": [
            {
              "fivth": null,
              "fourth": "房间号",
              "second": "离店时间",
              "first": "入住时间",
              "third": "旅店名称"
          },
            {
              "fourth": "402",
              "second": "2015-11-28 16:28:27",
              "first": "2015-11-28 16:28:27",
              "third": "7天连锁（草场门店）"
          }
        ]
    })

};
