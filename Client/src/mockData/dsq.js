var merge = require('webpack-merge');

var commonData = require('./commonData');

module.exports = {
    "registerType": merge(commonData, {
        "data": {
            "chartId": 1000,
            "title": "登记分布",
            "subTitle": "勿删",
            "count": 797,
            "inds": [{
                "indId": 10002,
                "indTitle": "底数类型统计数据",
                "indType": "LINE",
                "indData": [{
                    "k": "常口",
                    "v": 161,
                    "change": 1
                }, {
                    "k": "暂口",
                    "v": 222,
                    "change": 30
                }, {
                    "k": "学生",
                    "v": 132,
                    "change": 120
                }, {
                    "k": "未注册",
                    "v": 332,
                    "change": 12345
                }]
            }],
            "expire": "2015-11-16 23:59:59",
            "isExpire": 0
        },
        "code": 200
    }),
    "registerPlace": merge(commonData, {
        "data": {
            "chartId": 1001,
            "title": "位置分布",
            "subTitle": "勿删",
            "count": 0,
            "inds": [{
                "indId": 10003,
                "indTitle": "注册位置分布",
                "indType": "LINE",
                "indData": [{
                    "lng": 120.138,
                    "lat": 30.265,
                    "count_1": 1,
                    "count_2": 2,
                    "count_3": 0,
                    "change": 0
                }, {
                    "lng": 120.187,
                    "lat": 30.267,
                    "count_1": 1,
                    "count_2": 0,
                    "count_3": 3,
                    "change": 0
                }, {
                    "lng": 120.137,
                    "lat": 30.267,
                    "count_1": 0,
                    "count_2": 0,
                    "count_3": 2,
                    "change": 0
                }, {
                    "lng": 120.207,
                    "lat": 30.297,
                    "count_1": 0,
                    "count_2": 24,
                    "count_3": 2,
                    "change": 0
                }, {
                    "lng": 120.237,
                    "lat": 30.367,
                    "count_1": 0,
                    "count_2": 24,
                    "count_3": 2,
                    "change": 0
                }]
            }],
            "expire": "2015-11-16 23:59:59",
            "isExpire": 0
        },
        "code": 200
    }),

    "gatherType": merge(commonData, {
        "data": {
            "chartId": 1002,
            "title": "类型分布",
            "subTitle": "勿删",
            "count": 453,
            "inds": [{
                "indId": 10006,
                "indTitle": "类型分布数据统计",
                "indType": "LINE",
                "indData": [{
                    "k": "在册",
                    "v": 98,
                    "change": 0
                }, {
                    "k": "未注册",
                    "v": 321,
                    "change": 0
                }, {
                    "k": "互联网",
                    "v": 2,
                    "change": 0
                }]
            }],
            "expire": "2015-11-16 23:59:59",
            "isExpire": 0
        },
        "code": 200
    }),
    "gatherPlace": merge(commonData, {
        "data": {
            "chartId": 1003,
            "title": "位置分布",
            "subTitle": "勿删",
            "count": 0,
            "inds": [{
                "indId": 10007,
                "indTitle": "聚集地位置分布",
                "indType": "LINE",
                "indData": [{
                    "lng": 120.138,
                    "lat": 30.265,
                    "count_1": 20,
                    "count_2": 2,
                    "count_3": 0,
                    "change": 0
                }, {
                    "lng": 120.137,
                    "lat": 30.267,
                    "count_1": 14,
                    "count_2": 0,
                    "count_3": 17,
                    "change": 0
                }, {
                    "lng": 120.137,
                    "lat": 30.267,
                    "count_1": 14,
                    "count_2": 0,
                    "count_3": 25,
                    "change": 0
                }, {
                    "lng": 120.137,
                    "lat": 30.267,
                    "count_1": 16,
                    "count_2": 24,
                    "count_3": 25,
                    "change": 0
                }, {
                    "lng": 120.237,
                    "lat": 30.367,
                    "count_1": 6,
                    "count_2": 24,
                    "count_3": 25,
                    "change": 0
                }]
            }],
            "expire": "2015-11-16 23:59:59",
            "isExpire": 0
        },
        "code": 200
    })
    
};